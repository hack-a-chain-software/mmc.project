use near_contract_standards::fungible_token::metadata::FungibleTokenMetadata;
use workspaces::Account;

use crate::{
  contracts::ft::FtContract,
  transactions::{create_user_subaccount, create_contract_subaccount},
};

mod constants;
mod contracts;
mod methods;
mod transactions;
mod units;

#[derive(Debug)]
struct Accounts {
  owner: Account,
}

impl Accounts {
  async fn from_tla(tla: &Account) -> workspaces::Result<Self> {
    Ok(Accounts {
      owner: create_user_subaccount(&tla, "owner").await?,
    })
  }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  let worker = workspaces::sandbox().await?;

  println!(
    "Sandbox available at: http://localhost:{}",
    &worker.rpc_port()
  );

  let root = worker.root_account()?;

  println!(
    "Root account {} with keys:\n - {:?}\n - {:?}\n",
    &root.id(),
    &root.secret_key(),
    &root.secret_key().public_key()
  );

  let accounts = Accounts::from_tla(&root).await?;

  println!("All user accounts created."); // TODO: pretty print accounts

  let ft_contract_account = create_contract_subaccount(&root, "ft").await?;

  FtContract::deploy_and_initialize(
    ft_contract_account,
    &accounts.owner,
    1000000000000000000000,
    FungibleTokenMetadata {
      spec: "ft-1.0.0".to_string(),
      name: "name".to_string(),
      symbol: "NME".to_string(),
      icon: None,
      reference: None,
      reference_hash: None,
      decimals: 24,
    },
  )
  .await?;

  println!("All contracts deployed and initialized."); // TODO: pretty print contract accounts

  /*
    We could instantiate the sandbox manually, and just use this script with a client to deploy
   the contracts. However, that would be more laborious, so we take advantage of the `workspaces::sandbox()`
   and just park the thread so the main process doesn't finish, which would result in the `worker` reference
   being dropped, and the child process dying.
  */
  std::thread::park();

  anyhow::Ok(())
}
