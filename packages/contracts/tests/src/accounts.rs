use workspaces::Account;

use crate::transactions::create_user_subaccount;

#[derive(Debug)]
pub struct Accounts {
  pub owner: Account,
}

impl Accounts {
  pub async fn from_tla(tla: &Account) -> workspaces::Result<Self> {
    Ok(Accounts {
      owner: create_user_subaccount(&tla, "owner").await?,
    })
  }
}
