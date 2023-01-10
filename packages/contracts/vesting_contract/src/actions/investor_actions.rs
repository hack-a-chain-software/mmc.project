use near_sdk::{env, near_bindgen, utils::assert_one_yocto, Promise, json_types::U128};

use crate::{
  Contract, ContractExt, errors::ERR_403, utils::create_investment_id, BASE_GAS, ext_interface,
};

#[near_bindgen]
impl Contract {
  #[payable]
  pub fn withdraw_your_investments(
    &mut self,
    value_to_withdraw: U128,
    category: String,
  ) -> Promise {
    assert_one_yocto();
    assert!(env::prepaid_gas() >= BASE_GAS * 3, "{}", ERR_403);
    let predecessor = env::predecessor_account_id();
    let now = env::block_timestamp();

    let investment_id = create_investment_id(category.clone(), predecessor.clone());
    self.withdraw_investment(now, investment_id.clone(), value_to_withdraw.0);

    ext_interface::token_contract::ext(self.token_contract.clone())
      .with_static_gas(BASE_GAS)
      .with_attached_deposit(1)
      .ft_transfer(
        predecessor.clone(),
        value_to_withdraw,
        "Vesting withdraw".to_string(),
      )
      .then(
        ext_interface::ext_self::ext(env::current_account_id())
          .with_static_gas(BASE_GAS)
          .undo_transfer(value_to_withdraw, investment_id, predecessor.clone()),
      )
  }
}

#[cfg(test)]
mod tests {
  use rstest::rstest;

  use crate::tests::*;
  use crate::*;

  // withdraw_your_investments TEST_SUITE
  // Asserts the correct behaviour of withdraw_your_investments.
  // Cross Contract Calls cannot be tested on unit tests, therefore, testing for this
  // function won't cover all it's workings. Integration tests are needed
  // Method must:
  // (1) Assert that 1 yoctoNear was sent with the transaction;
  // (2) Assert that the necessary gas was passed to the transaction;
  // (3) Assert that the investment_id (Investment of the sender's account in the
  //     informed schema exists);
  // (4) Assert that the investor has enough vested funds to withdraw;
  // (5) Persist the total amount of funds that have been withdrawn from a given Investment;
  // Tests must not:
  // (a) prove the mathematical correctness of the funds released. This is proved in
  //     internal unit tests (refer to implementation_tests in lib.rs and schema.rs);
  // (b) prove the correctness of the cross crontract calls flow, which needs to be tested
  //     with integration tests
  #[rstest]
  #[should_panic(expected = "Requires attached deposit of exactly 1 yoctoNEAR")]
  fn test_withdraw_your_investments_1(mut contract: Contract, token_account: AccountId) {
    // Asserts:
    // (1) Assert that 1 yoctoNear was sent with the transaction;
    let context = get_context(vec![], false, 0, 0, token_account, 0, Gas(10u64.pow(18)));
    testing_env!(context);

    contract.withdraw_your_investments(U128(10), "category".to_string());
  }

  #[rstest]
  #[should_panic(
    expected = "Vesting: Investor Actions: withdraw_your_investments: Not enough gas was attatched on the transaction  - attach at least
    150 Tgas"
  )]
  fn test_withdraw_your_investments_2(mut contract: Contract, token_account: AccountId) {
    // Asserts:
    // (2) Assert that the necessary gas was passed to the transaction;
    let context = get_context(vec![], false, 1, 0, token_account, 0, BASE_GAS * 2);
    testing_env!(context);

    contract.withdraw_your_investments(U128(10), "category".to_string());
  }
  #[rstest]
  #[should_panic(expected = "Vesting: Contract: Investment: Investment does not exist")]
  fn test_withdraw_your_investments_3(mut contract: Contract, token_account: AccountId) {
    // Asserts:
    // (3) Assert that the investment_id (Investment of the sender's account in the
    //     informed schema exists);
    let context = get_context(vec![], false, 1, 0, token_account, 0, BASE_GAS * 3);
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

    contract.withdraw_your_investments(U128(10), "category".to_string());
  }

  #[rstest]
  #[should_panic(
    expected = "Vesting: Contract: withdraw_investment: The value you are trying to withdraw is greater then 
    this investment's balance"
  )]
  fn test_withdraw_your_investments_4(mut contract: Contract, token_account: AccountId) {
    // Asserts:
    // (4) Assert that the investor has enough vested funds to withdraw;
    let context = get_context(vec![], false, 1, 0, token_account.clone(), 0, BASE_GAS * 3);
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
        account: token_account,
        total_value,
        withdrawn_value: 0,
        date_in: None,
      },
    );

    contract.withdraw_your_investments(U128(total_value + 1), category);
  }

  #[rstest]
  fn test_withdraw_your_investments_5(mut contract: Contract, token_account: AccountId) {
    // Asserts:
    // (5) Persist the total amount of funds that have been withdrawn from a given Investment;
    let context = get_context(
      vec![],
      false,
      1,
      0,
      token_account.clone(),
      200,
      BASE_GAS * 3,
    );
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
        account: token_account,
        total_value,
        withdrawn_value: first_withdrawal,
        date_in: None,
      },
    );

    contract.withdraw_your_investments(U128(second_withdrawal), category.clone());
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
