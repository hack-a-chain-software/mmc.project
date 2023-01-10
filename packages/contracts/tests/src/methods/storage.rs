use futures::future::try_join_all;
use near_units::parse_near;
use serde_json::json;
use workspaces::{result::ExecutionFinalResult, Account, Contract};

#[allow(dead_code)]
pub async fn bulk_register_storage(
  accounts: Vec<&Account>,
  contracts: Vec<&Contract>,
) -> workspaces::Result<Vec<ExecutionFinalResult>> {
  let mut batch = Vec::new();
  for account in accounts.into_iter() {
    for contract in contracts.iter() {
      batch.push(
        account
          .call(contract.id(), "storage_deposit")
          .args_json(json!({
            "account_id": account.id(),
            "registration_only": false,
          }))
          .deposit(parse_near!("1 N"))
          .transact(),
      );
    }
  }

  try_join_all(batch).await
}
