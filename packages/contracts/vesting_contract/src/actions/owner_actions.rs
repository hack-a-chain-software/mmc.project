use near_sdk::{
  env, near_bindgen,
  utils::assert_one_yocto,
  Promise, AccountId,
  json_types::{U64, U128},
};

use crate::{
  Contract, ContractExt,
  errors::{ERR_301, ERR_302, ERR_303, ERR_304},
  schema::CurveType,
  BASE_GAS,
  utils::create_investment_id,
  ext_interface,
};

//blockchain exposed

#[near_bindgen]
impl Contract {
  // ft on transfer is an onwner action, but it is called by the token contract
  pub fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> U128 {
    // validate the predecessor is the token contract
    assert_eq!(
      env::predecessor_account_id(),
      self.token_contract,
      "{}",
      ERR_302
    );

    //validate that the sender is the contract owner
    assert_eq!(sender_id, self.owner, "{}", ERR_301);

    let parsed_message: serde_json::Value = serde_json::from_str(&msg).expect(ERR_303);

    let category: String = parsed_message["category"]
      .as_str()
      .expect(ERR_303)
      .to_string();

    let initial_release: u128 = parsed_message["initial_release"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let cliff_release: u128 = parsed_message["cliff_release"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let final_release: u128 = parsed_message["final_release"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let initial_timestamp: u64 = parsed_message["initial_timestamp"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let cliff_delta: u64 = parsed_message["cliff_delta"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let final_delta: u64 = parsed_message["final_delta"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let curve_type: String = parsed_message["curve_type"]
      .as_str()
      .expect(ERR_303)
      .to_string();

    let discrete_period: u64 = parsed_message["discrete_period"]
      .as_str()
      .expect(ERR_303)
      .parse()
      .expect(ERR_303);

    let curve;
    if curve_type == "Linear" {
      curve = CurveType::Linear { discrete_period };
    } else {
      panic!("Curve type not supported. Currently, only curve type available is: 'Linear'");
    }

    self.new_schema(
      category,
      amount.0,
      initial_release,
      cliff_release,
      final_release,
      initial_timestamp,
      cliff_delta,
      final_delta,
      curve,
    );

    U128(0)
  }

  #[payable]
  pub fn create_investment(
    &mut self,
    category: String,
    account: AccountId,
    total_value: U128,
    date_in: Option<U64>,
  ) {
    //validate that the sender is the contract owner
    assert_one_yocto();
    self.only_owner();
    self.new_investment(category, account, total_value, date_in);
  }

  #[payable]
  pub fn owner_withdraw_investments(
    &mut self,
    value_to_withdraw: U128,
    category: String,
    investor_account: AccountId,
  ) -> Promise {
    assert_one_yocto();
    self.only_owner();
    assert!(env::prepaid_gas() >= BASE_GAS * 3, "{}", ERR_304);
    let now = env::block_timestamp();

    let investment_id = create_investment_id(category.clone(), investor_account.clone());
    self.withdraw_investment(now, investment_id.clone(), value_to_withdraw.0);

    ext_interface::token_contract::ext(self.token_contract.clone())
      .with_static_gas(BASE_GAS)
      .with_attached_deposit(1)
      .ft_transfer(
        investor_account.clone(),
        value_to_withdraw,
        "Vesting withdraw".to_string(),
      )
      .then(
        ext_interface::ext_self::ext(env::current_account_id())
          .with_static_gas(BASE_GAS)
          .undo_transfer(value_to_withdraw, investment_id, self.owner.clone()),
      )
  }
}

#[cfg(test)]
mod tests {
  use std::str::FromStr;

  use crate::tests::*;
  use crate::*;

  use rstest::{rstest, fixture};
  use serde_json::json;

  #[fixture]
  fn account_id() -> AccountId {
    AccountId::from_str("account.test.near").unwrap()
  }

  // ft_on_transfer TEST_SUITE
  // Asserts the correct behaviour of ft_on_transfer.
  // Method must:
  // (1) Assert that tokens transferred where from self.token_contract;
  // (2) Assert that initializor of the transfer was self.owner;
  // (3) Assert that cliff_release + final_release + final_delta equal FRACTION_BASE;
  // (4) Assert that msg is correctly formatted;
  // (5) Create a new Schema instance in the self.schemas UnorderedMap with the data from msg and
  //     total_quantity equal to the transferred amount of tokens;
  // (6) Return U128(0) after a succesful run;
  #[rstest]
  fn test_ft_on_tranfer_5_6(
    mut contract: Contract,
    token_account: AccountId,
    owner_account: AccountId,
  ) {
    // Asserts:
    // (5) Create a new Schema instance in the self.schemas UnorderedMap with the data from msg and
    //     total_quantity equal to the transferred amount of tokens;
    // (6) Return U128(0) after a succesful run;
    let context = get_context(vec![], false, 0, 0, token_account, 0, DEFAULT_GAS);
    testing_env!(context);

    let transfer_amount: u128 = 10;

    let category = "category_test".to_string();
    let initial_release = "1000".to_string();
    let cliff_release = "5000".to_string();
    let final_release = "4000".to_string();
    let initial_timestamp = "10000".to_string();
    let cliff_delta = "100".to_string();
    let final_delta = "100".to_string();
    let curve_type = "Linear".to_string();
    let discrete_period = "1".to_string();
    let msg = json!({
        "category": category,
        "initial_release" : initial_release,
        "cliff_release" : cliff_release,
        "final_release": final_release,
        "initial_timestamp": initial_timestamp,
        "cliff_delta" : cliff_delta,
        "final_delta" : final_delta,
        "curve_type" : curve_type,
        "discrete_period": discrete_period
    })
    .to_string();

    let return_val = contract.ft_on_transfer(owner_account, U128(transfer_amount), msg);

    //(5) asserts creation fo schema with correct data
    let schema;
    if let Some(value) = contract.schemas.get(&category) {
      schema = value;
    } else {
      panic!("Schema was not created succesfully");
    }

    assert_eq!(schema.category, category);
    assert_eq!(schema.allocated_quantity, 0);
    assert_eq!(schema.total_quantity, transfer_amount);
    assert_eq!(schema.initial_release, initial_release.parse().unwrap());
    assert_eq!(schema.cliff_release, cliff_release.parse().unwrap());
    assert_eq!(schema.final_release, final_release.parse().unwrap());
    assert_eq!(schema.cliff_delta, cliff_delta.parse::<u64>().unwrap());
    assert_eq!(schema.final_delta, final_delta.parse::<u64>().unwrap());
    assert_eq!(
      schema.curve_type,
      schema::CurveType::Linear {
        discrete_period: discrete_period.parse().unwrap()
      }
    );

    //(6) asserts that function returns 0 so that interaction with token contract goes correctly
    assert_eq!(return_val, U128(0));
  }

  #[rstest]
  #[should_panic(
    expected = "Actions: owner_actions:ft_on_transfer: only the vesting token contract can be used 
    - no other token can be used on this contract"
  )]
  fn test_ft_on_tranfer_1(mut contract: Contract, owner_account: AccountId) {
    // Asserts:
    // (1) Assert that tokens transferred where from self.token_contract;
    let context = get_context(vec![], false, 0, 0, owner_account.clone(), 0, DEFAULT_GAS);
    testing_env!(context);

    contract.ft_on_transfer(owner_account, U128(10), "msg".to_string());
  }

  #[rstest]
  #[should_panic(expected = "Actions: owner_actions:ft_on_transfer: function is private to owner")]
  fn test_ft_on_tranfer_2(mut contract: Contract, token_account: AccountId) {
    // Asserts:
    // (2) Assert that initializor of the transfer was self.owner;
    let context = get_context(vec![], false, 0, 0, token_account.clone(), 0, DEFAULT_GAS);
    testing_env!(context);

    contract.ft_on_transfer(token_account, U128(10), "msg".to_string());
  }

  #[rstest]
  #[should_panic(expected = "Vesting: Schema: Cannot create schema: sum of
    initial_release + cliff_release + final_release  MUST be equal to FRACTION_BASE")]
  fn test_ft_on_tranfer_3(
    mut contract: Contract,
    token_account: AccountId,
    owner_account: AccountId,
  ) {
    // Asserts:
    // (3) Assert that cliff_release + final_release + final_delta equal FRACTION_BASE;
    let context = get_context(vec![], false, 0, 0, token_account, 0, DEFAULT_GAS);
    testing_env!(context);

    let msg = json!({
        "category": "category".to_string(),
        "initial_release" : "4000".to_string(),
        "cliff_release" : "4000".to_string(),
        "final_release": "4000".to_string(),
        "initial_timestamp": "10000".to_string(),
        "cliff_delta" : "100".to_string(),
        "final_delta" : "100".to_string(),
        "curve_type" : "Linear".to_string(),
        "discrete_period": "1".to_string()
    })
    .to_string();

    contract.ft_on_transfer(owner_account, U128(10), msg);
  }

  #[rstest]
  #[should_panic(
    expected = r#"Actions: owner_actions:ft_on_transfer: Cannot parse the message - please use the following format: 
    {
        "category": " ",
        "initial_release" : " ",
        "cliff_release" : " ", 
        "final_release": " ",
        "initial_timestamp": " ",
        "cliff_delta" : " ",
        "final_delta" : " ",
        "curve_type" : " ",
        "discrete_period": " "
    }"#
  )]
  fn test_ft_on_tranfer_4(
    mut contract: Contract,
    token_account: AccountId,
    owner_account: AccountId,
  ) {
    // Asserts:
    // (4) Assert that msg is correctly formatted;
    let context = get_context(vec![], false, 0, 0, token_account, 0, DEFAULT_GAS);
    testing_env!(context);

    let msg = json!({
        "category": "category",
        "initial_release" : "4000",
        "cliff_release" : "4000",
        "final_release": "4000",
        "initial_timestamp": "10000",
        "cliff_delta" : 100,
        "final_delta" : "100",
        "curve_type" : "Linear",
        "discrete_period": "1"
    })
    .to_string();

    contract.ft_on_transfer(owner_account, U128(10), msg);
  }

  // create_investment TEST_SUITE
  // Asserts the correct behaviour of create_investment.
  // Method must:
  // (1) Assert that initializor of the transaction was self.owner;
  // (2) Assert that caller deposited 1 yoctoNear
  // (3) Assert that the schema associated with the new investment exists;
  // (4) Assert that the total_value allocated to the investment is within the
  //     availability of the schema;
  // (5) Assert that there is no existing Investment with the same id;
  // (6) Create Investment instance and persist it in self.investments at investment_id key
  #[rstest]
  fn test_create_investment_6(mut contract: Contract, owner_account: AccountId) {
    // Asserts:
    // (6) Create Investment instance and persist it in self.investments at investment_id key
    let context = get_context(vec![], false, 1, 0, owner_account, 0, DEFAULT_GAS);
    testing_env!(context);

    let category = "category".to_string();
    let account_id = AccountId::from_str("account.test.near").unwrap();
    let total_value = 100;
    let date_in = None;

    let investment_id = create_investment_id(category.clone(), account_id.clone());

    contract.schemas.insert(
      &category,
      &schema::Schema {
        category: category.clone(),
        allocated_quantity: 0,
        total_quantity: total_value,
        initial_release: 10,
        cliff_release: 10,
        final_release: 80,
        initial_timestamp: 0,
        cliff_delta: 100,
        final_delta: 100,
        curve_type: schema::CurveType::Linear { discrete_period: 1 },
        investments: Vec::new(),
      },
    );

    contract.create_investment(
      category.clone(),
      account_id.clone(),
      U128(total_value),
      date_in,
    );

    let investment;

    if let Some(value) = contract.investments.get(&investment_id) {
      investment = value;
    } else {
      panic!("Investment was not created succesfuly");
    }

    assert_eq!(investment.account, account_id);
    assert_eq!(investment.total_value, total_value);
    assert_eq!(investment.withdrawn_value, 0);
    assert_eq!(investment.date_in, date_in.map(|v| v.0));
  }

  #[rstest]
  #[should_panic(expected = "Vesting: Contract: function is private to owner")]
  fn test_create_investment_1(
    mut contract: Contract,
    token_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (1) Assert that initializor of the transaction was self.owner;
    let context = get_context(vec![], false, 1, 0, token_account, 0, DEFAULT_GAS);
    testing_env!(context);

    contract.create_investment("category".to_string(), account_id, U128(100), None);
  }

  #[rstest]
  #[should_panic(expected = "Requires attached deposit of exactly 1 yoctoNEAR")]
  fn test_create_investment_2(
    mut contract: Contract,
    owner_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (2) Assert that caller deposited 1 yoctoNear
    let context = get_context(vec![], false, 0, 0, owner_account, 0, DEFAULT_GAS);
    testing_env!(context);

    contract.create_investment("category".to_string(), account_id, U128(100), None);
  }

  #[rstest]
  #[should_panic(expected = "Vesting: Contract: Schema: Schema does not exist")]
  fn test_create_investment_3(
    mut contract: Contract,
    owner_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (3) Assert that the schema associated with the new investment exists;
    let context = get_context(vec![], false, 1, 0, owner_account, 0, DEFAULT_GAS);
    testing_env!(context);

    contract.create_investment("category".to_string(), account_id, U128(100), None);
  }

  #[rstest]
  #[should_panic(
    expected = "Vesting: Contract: new_investment: The allocated amount for this investment 
    is greater than the amount of tokens available on that  schema category:  
    (schema.aloccated_quantity + total_value) MUST be SMALLER then or EQUAL to schema.total_value"
  )]
  fn test_create_investment_4(
    mut contract: Contract,
    owner_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (4) Assert that the total_value allocated to the investment is within the
    //     availability of the schema;
    let context = get_context(vec![], false, 1, 0, owner_account, 0, DEFAULT_GAS);
    testing_env!(context);

    let category = "category".to_string();
    let total_value = 100;
    let date_in = None;

    contract.schemas.insert(
      &category,
      &schema::Schema {
        category: category.clone(),
        allocated_quantity: 0,
        total_quantity: total_value,
        initial_release: 10,
        cliff_release: 10,
        final_release: 80,
        initial_timestamp: 0,
        cliff_delta: 100,
        final_delta: 100,
        curve_type: schema::CurveType::Linear { discrete_period: 1 },
        investments: Vec::new(),
      },
    );

    contract.create_investment(category.clone(), account_id, U128(total_value + 1), date_in);
  }

  #[rstest]
  #[should_panic(
    expected = "Vesting: Contract: new_investment: There is already an Investment with this ID 
    (it uses the same schema and same acconunt)"
  )]
  fn test_create_investment_5(
    mut contract: Contract,
    account_id: AccountId,
    owner_account: AccountId,
  ) {
    // Asserts:
    // (5) Assert that there is no existing Investment with the same id;
    let context = get_context(vec![], false, 1, 0, owner_account, 0, DEFAULT_GAS);
    testing_env!(context);

    let category = "category".to_string();
    let total_value = 100;
    let date_in = None;

    let investment_id = create_investment_id(category.clone(), account_id.clone());

    contract.schemas.insert(
      &category,
      &schema::Schema {
        category: category.clone(),
        allocated_quantity: 0,
        total_quantity: total_value,
        initial_release: 10,
        cliff_release: 10,
        final_release: 80,
        initial_timestamp: 0,
        cliff_delta: 100,
        final_delta: 100,
        curve_type: schema::CurveType::Linear { discrete_period: 1 },
        investments: Vec::new(),
      },
    );

    contract.investments.insert(
      &investment_id,
      &investment::Investment {
        account: account_id.clone(),
        total_value,
        withdrawn_value: 0,
        date_in: None,
      },
    );

    contract.create_investment(
      category.clone(),
      account_id.clone(),
      U128(total_value),
      date_in,
    );
  }

  // owner_withdraw_investments TEST_SUITE
  // Asserts the correct behaviour of owner_withdraw_investments.
  // Cross Contract Calls cannot be tested on unit tests, therefore, testing for this
  // function won't cover all it's workings. Integration tests are needed
  // Method must:
  // (1) Assert that caller is the owner;
  // (2) Assert that 1 yoctoNear was sent with the transaction;
  // (3) Assert that the necessary gas was passed to the transaction;
  // (4) Assert that the investment_id (Investment of the sender's account in the
  //     informed schema exists);
  // (5) Assert that the investor has enough vested funds to withdraw;
  // (6) Persist the total amount of funds that have been withdrawn from a given Investment;
  // Tests must not:
  // (a) prove the mathematical correctness of the funds released. This is proved in
  //     internal unit tests (refer to implementation_tests in lib.rs and schema.rs);
  // (b) prove the correctness of the cross crontract calls flow, which needs to be tested
  //     with integration tests
  #[rstest]
  #[should_panic(expected = "Vesting: Contract: function is private to owner")]
  fn test_withdraw_your_investments_1(
    mut contract: Contract,
    token_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (1) Assert that caller is the owner;
    let context = get_context(vec![], false, 1, 0, token_account, 0, DEFAULT_GAS);
    testing_env!(context);

    contract.owner_withdraw_investments(U128(10), "category".to_string(), account_id);
  }

  #[rstest]
  #[should_panic(expected = "Requires attached deposit of exactly 1 yoctoNEAR")]
  fn test_withdraw_your_investments_2(
    mut contract: Contract,
    owner_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (2) Assert that 1 yoctoNear was sent with the transaction;
    let context = get_context(vec![], false, 0, 0, owner_account, 0, DEFAULT_GAS);
    testing_env!(context);

    contract.owner_withdraw_investments(U128(10), "category".to_string(), account_id);
  }

  #[rstest]
  #[should_panic(
    expected = "Vesting: Owner Actions: owner_withdraw_investments: Not enough gas was attatched on the transaction  - attach at least
    150 Tgas"
  )]
  fn test_withdraw_your_investments_3(
    mut contract: Contract,
    owner_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (3) Assert that the necessary gas was passed to the transaction;
    let context = get_context(vec![], false, 1, 0, owner_account, 0, BASE_GAS);
    testing_env!(context);

    contract.owner_withdraw_investments(U128(10), "category".to_string(), account_id);
  }
  #[rstest]
  #[should_panic(expected = "Vesting: Contract: Investment: Investment does not exist")]
  fn test_withdraw_your_investments_4(
    mut contract: Contract,
    owner_account: AccountId,
    account_id: AccountId,
  ) {
    // Asserts:
    // (4) Assert that the investment_id (Investment of the sender's account in the
    //     informed schema exists);
    let context = get_context(vec![], false, 1, 0, owner_account, 0, BASE_GAS * 3);
    testing_env!(context);

    let category = "category".to_string();

    contract.schemas.insert(
      &category,
      &schema::Schema {
        category: category.clone(),
        allocated_quantity: 0,
        total_quantity: 100,
        initial_release: 10,
        cliff_release: 10,
        final_release: 80,
        initial_timestamp: 0,
        cliff_delta: 100,
        final_delta: 100,
        curve_type: schema::CurveType::Linear { discrete_period: 1 },
        investments: Vec::new(),
      },
    );

    contract.owner_withdraw_investments(U128(10), "category".to_string(), account_id);
  }

  #[rstest]
  #[should_panic(
    expected = "Vesting: Contract: withdraw_investment: The value you are trying to withdraw is greater then 
    this investment's balance"
  )]
  fn test_withdraw_your_investments_5(
    mut contract: Contract,
    token_account: AccountId,
    owner_account: AccountId,
  ) {
    // Asserts:
    // (5) Assert that the investor has enough vested funds to withdraw;
    let context = get_context(vec![], false, 1, 0, owner_account, 0, BASE_GAS * 3);
    testing_env!(context);

    let category = "category".to_string();
    let total_value = 100;

    let investment_id = create_investment_id(category.clone(), token_account.clone());

    contract.schemas.insert(
      &category,
      &schema::Schema {
        category: category.clone(),
        allocated_quantity: 0,
        total_quantity: total_value,
        initial_release: 10,
        cliff_release: 10,
        final_release: 80,
        initial_timestamp: 0,
        cliff_delta: 100,
        final_delta: 100,
        curve_type: schema::CurveType::Linear { discrete_period: 1 },
        investments: Vec::new(),
      },
    );

    contract.investments.insert(
      &investment_id,
      &investment::Investment {
        account: token_account.clone(),
        total_value,
        withdrawn_value: 0,
        date_in: None,
      },
    );

    contract.owner_withdraw_investments(U128(total_value + 1), category, token_account);
  }

  #[rstest]
  fn test_withdraw_your_investments_6(
    mut contract: Contract,
    token_account: AccountId,
    owner_account: AccountId,
  ) {
    // Asserts:
    // (6) Persist the total amount of funds that have been withdrawn from a given Investment;
    let context = get_context(vec![], false, 1, 0, owner_account, 200, BASE_GAS * 3);
    testing_env!(context.clone());

    let category = "category".to_string();
    let total_value = 100;

    let investment_id = create_investment_id(category.clone(), token_account.clone());

    contract.schemas.insert(
      &category,
      &schema::Schema {
        category: category.clone(),
        allocated_quantity: 0,
        total_quantity: total_value,
        initial_release: 10,
        cliff_release: 10,
        final_release: 80,
        initial_timestamp: 0,
        cliff_delta: 100,
        final_delta: 100,
        curve_type: schema::CurveType::Linear { discrete_period: 1 },
        investments: Vec::new(),
      },
    );

    let first_withdrawal = 10;
    let second_withdrawal = 10;
    contract.investments.insert(
      &investment_id,
      &investment::Investment {
        account: token_account.clone(),
        total_value,
        withdrawn_value: first_withdrawal,
        date_in: None,
      },
    );
    contract.owner_withdraw_investments(U128(second_withdrawal), category.clone(), token_account);
    assert_eq!(
      contract
        .investments
        .get(&investment_id)
        .unwrap()
        .withdrawn_value,
      first_withdrawal + second_withdrawal
    );
  }
}
