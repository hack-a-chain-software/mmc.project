use near_sdk::{near_bindgen, AccountId, json_types::U128, env};

use crate::{Contract, ContractExt, errors::UNAUTHORIZED_ERR};

#[near_bindgen]
impl Contract{
    pub fn insert_token_price(&mut self, currency: AccountId, price: U128){
    assert_eq!(env::signer_account_id(), self.owner, "{}", UNAUTHORIZED_ERR);
        self.fungible_tokens.insert(&currency, &price);
    }
}

