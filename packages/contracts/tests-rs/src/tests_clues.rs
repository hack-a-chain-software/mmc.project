#[cfg(test)]
mod tests {

  use core::panic;

  use crate::*;

  /// integration test happy case
  /// aims to test full aplication flow for mmc project
  #[tokio::test]
  async fn test_normal_flow() -> anyhow::Result<()> {
    let worker: Worker<Sandbox> = workspaces::sandbox().await?;

    let root = worker.root_account().unwrap();

    // CREATE USER ACCOUNTS
    let owner = create_user_account(&root, "owner").await;
    let minter = create_user_account(&root, "minter").await;
    let user = create_user_account(&root, "user").await;
    let user2 = create_user_account(&root, "user2").await;
    let user3 = create_user_account(&root, "user3").await;

    // 1. Initialize contracts
    // DEPLOY BASE TOKEN
    // locked token
    let locked_token_wasm = get_wasm("locked_token.wasm")?;
    let locked_token = deploy_contract(&root, "locked_token", &locked_token_wasm).await;
    // normal token
    let ft_wasm = get_wasm("token_contract.wasm")?;
    let ft_token = deploy_contract(&root, "ft_contract_price", &ft_wasm).await;
    initialize_ft_contract(&ft_token, &owner).await;
    // nft
    let nft_wasm = get_wasm("nft_contract.wasm")?;
    let detective_contract = deploy_contract(&root, "detectives", &nft_wasm).await;
    let pups_contract = deploy_contract(&root, "pups", &nft_wasm).await;
    // clues
    let clues_wasm = get_wasm("clues_contract.wasm")?;
    let clues = deploy_contract(&root, "clues", &clues_wasm).await;

    // INITIALIZE
    // locked_token
    let vesting_duration: u64 = 60 * 60 * TO_NANO;
    transact_call(owner.call(locked_token.id(), "new").args_json(json!({
      "locked_token_name": "locked_solve",
      "locked_token_symbol": "SLV",
      "locked_token_icon": "icon",
      "locked_token_decimals": FT_DECIMALS,
      "contract_config": {
        "owner_id": owner.id(),
        "base_token": ft_token.id(),
        "vesting_duration": vesting_duration.to_string(),
        "fast_pass_cost": 500.to_string(),
        "fast_pass_acceleration": 2.to_string(),
        "fast_pass_beneficiary": owner.id(),
      },
    })))
    .await;

    // token
    initialize_ft_contract(&ft_token, &owner).await;

    // initialize nfts
    initialize_nft_contract(&detective_contract, &owner).await;
    initialize_nft_contract(&pups_contract, &owner).await;

    // clues
    let block_info = worker.view_latest_block().await?;
    let current_ts = block_info.timestamp() / TO_NANO;
    let half_hour: u64 = 60 * 30;
    let ticket_price: u128 = 1_000_000_000_000_000_000_000_000_000;
    transact_call(owner.call(clues_contract.id(), "new").args_json(json!({
      "owner_id": owner.id(),
      "metadata": {
        "spec": "nft-1.0.0",
        "name": "Testers",
        "symbol": "TEST",
        "icon": null,
        "base_uri": "https://imgur.com/gallery/OBB7tLg",
        "reference": null,
        "reference_hash": null,
      },
      "mmc_token_account": ft_token.id(),
      "detective_token_address": detective_contract.id(),
      "pups_token_address": pups_contract.id(),
      "locked_tokens_address": locked_solve.id(),
      "season_begin": current_ts + half_hour,
      "season_end": current_ts + 3 * half_hour,
      "guessing_start": current_ts + 2 * half_hour,
      "ticket_price": ticket_price.to_string,
  })))
    .await;

  // register all storage
    let accounts = vec![
      &owner,
      &minter,
      &user,
      &user2,
      &user3,
      ft_token.as_account(),
      x_token.as_account(),
      locked_token.as_account(),
    ];
    let contracts = vec![&ft_token, &x_token, &locked_token];

    bulk_register_storage(accounts, contracts).await?;

    // 2. Distribute initial token allocations
    let transfer_amount = 1_000_000;
    ft_transfer(&owner, &ft_token, &user, transfer_amount).await;
    ft_transfer(&owner, &ft_token, &user2, transfer_amount).await;
    ft_transfer(&owner, &ft_token, &user3, transfer_amount).await;
    ft_transfer(&owner, &ft_token, &minter, transfer_amount).await;
    ft_transfer_call(
      &user,
      &ft_token,
      x_token.as_account(),
      transfer_amount / 10,
      "mint".to_string(),
    )
    .await;

    json!({
      "ProveOwner": {"account_id": }
    });

    
    ft_transfer_call(
      &user2,
      &ft_token,
      x_token.as_account(),
      transfer_amount,
      "mint".to_string(),
    )
    .await;

    // 3. Create minter account for locked tokens 

    transact_call(
      owner
        .call(locked_token.id(), "add_minter")
        .args_json(json!({
          "new_minter": clues.id()
        }))
        .deposit(1),
    )
    .await;

    // 4. Minter account mints locked_tokens
    let initial_minter: u128 = ft_balance_of(&locked_token, &minter)
      .await?
      .parse()
      .unwrap();

    let mint_amount = transfer_amount;
    ft_transfer_call(
      &owner,
      &ft_token,
      locked_token.as_account(),
      transfer_amount,
      json!({ "type": "Mint", "account_id": minter.id() }).to_string(),
    )
    .await;

    let final_minter: u128 = ft_balance_of(&locked_token, &minter)
      .await?
      .parse()
      .unwrap();
    assert_eq!(initial_minter + mint_amount, final_minter);

    // 6. Mint a detective NFT, a PUP NFT and two clues 

    let send_amount = 1000;
    ft_transfer(&minter, &locked_token, &user, send_amount).await;


    ft_transfer_call(
      &user,
      &ft_token,
      locked_token.as_account(),
      transfer_amount / 10,
      json!({ "type": "BuyFastPass", "account_id": user.id(), "vesting_index": "0" }).to_string(),
    )
    .await;

    

    // 7. time travel
    time_travel(&worker, 60 * 40).await?;

    // 8. withdraw tokens - assert difference between fast pass
    

    anyhow::Ok(())
  }
}
