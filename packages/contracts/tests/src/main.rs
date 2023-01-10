use crate::{
  contracts::{
    ft::{FungibleTokenClient, FungibleTokenMetadata},
    locked_token::{LockedTokenClient, ContractConfig},
    vesting::VestingClient,
  },
  transactions::create_contract_subaccount,
  accounts::Accounts,
};

mod accounts;
mod constants;
mod contracts;
mod methods;
mod transactions;
mod units;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  // TODO: consider making ports configurable. Because it is containerized, there's little point at the moment.
  let worker = workspaces::sandbox_at(1337, 1338).await?;

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

  let fungible_token_contract_account = create_contract_subaccount(&root, "fungible_token").await?;
  let _fungible_token_client = FungibleTokenClient::deploy_and_initialize(
    &fungible_token_contract_account,
    &accounts.owner,
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

  let locked_token_contract_account = create_contract_subaccount(&root, "locked_token").await?;
  let _locked_token_client = LockedTokenClient::deploy_and_initialize(
    &locked_token_contract_account,
    "Locked MMC".to_string(),
    "LMMC".to_string(),
    "".to_string(),
    18,
    ContractConfig {
      owner_id: accounts.owner.id().to_string(),
      base_token: fungible_token_contract_account.id().to_string(),
      fast_pass_acceleration: "0".to_string(),
      fast_pass_beneficiary: accounts.owner.id().to_string(),
      fast_pass_cost: "0".to_string(),
      vesting_duration: "200".to_string(),
    },
  )
  .await?;

  let vesting_contract_account = create_contract_subaccount(&root, "vesting").await?;
  let _vesting_client = VestingClient::deploy_and_initialize(
    &vesting_contract_account,
    &accounts.owner,
    &fungible_token_contract_account,
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
