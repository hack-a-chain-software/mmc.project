use near_units::parse_near;
use workspaces::{Contract, Worker, AccountId, network::Sandbox};

use crate::constants::SPOON_BLOCK_HEIGHT;

pub mod storage;

pub async fn spoon_contract(
  contract_id: &str,
  worker: &Worker<Sandbox>,
) -> workspaces::Result<Contract> {
  let mainnet = workspaces::mainnet_archival().await?; // TODO: use workspaces::with_mainnet_archival() when async closures are stable
  let contract_id: AccountId = contract_id.parse().unwrap();

  worker
    .import_contract(&contract_id, &mainnet)
    .initial_balance(parse_near!("1000000 N"))
    .block_height(SPOON_BLOCK_HEIGHT)
    .transact()
    .await
}

pub async fn time_travel(
  worker: &Worker<Sandbox>,
  seconds_to_advance: u64,
) -> workspaces::Result<()> {
  let blocks_to_advance = crate::units::seconds_to_blocks(seconds_to_advance);
  worker.fast_forward(blocks_to_advance).await
}
