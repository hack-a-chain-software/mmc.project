use near_sdk::AccountId;

pub fn create_investment_id(category: String, account_id: AccountId) -> String {
  format!("{}{}{}", category, "@", account_id)
}

pub fn split_investment_id(investment_id: String) -> Vec<String> {
  investment_id[..]
    .split("@")
    .map(|s| s.to_string())
    .collect()
}
