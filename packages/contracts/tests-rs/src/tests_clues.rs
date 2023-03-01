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
    let ft_wasm = get_wasm("fungible_token.wasm")?;
    let ft_token = deploy_contract(&root, "ft_token", &ft_wasm).await;
    // nft
    let nft_wasm = get_wasm("nft_contract.wasm")?;
    let detective_contract = deploy_contract(&root, "detectives", &nft_wasm).await;
    let pups_contract = deploy_contract(&root, "pups", &nft_wasm).await;
    // clues
    let clues_wasm = get_wasm("clues_contract.wasm")?;
    let clues = deploy_contract(&root, "clues", &clues_wasm).await;

    // INITIALIZE

    // token
    initialize_ft_contract(&ft_token, &owner).await;

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

    // initialize nfts
    initialize_nft_contract(&detective_contract, &owner).await;
    initialize_nft_contract(&pups_contract, &owner).await;

    // clues
    let block_info = worker.view_latest_block().await?;
    let current_ts = block_info.timestamp();
    let half_hour: u64 = 60 * 30;
    let ticket_price: u128 = 1_000;

    transact_call(owner.call(clues.id(), "new").args_json(json!({
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
        "locked_tokens_address": locked_token.id(),
        "season_begin": current_ts + (half_hour * TO_NANO),
        "season_end": current_ts + 3 * (half_hour * TO_NANO),
        "guessing_start": current_ts + 2 * (half_hour * TO_NANO),
        "ticket_price": ticket_price.to_string(),
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
      locked_token.as_account(),
      clues.as_account(),
    ];
    let contracts = vec![&ft_token, &locked_token];

    bulk_register_storage(accounts, contracts).await?;

    // 2. Distribute initial token allocations
    let transfer_amount = 1_000_000;
    ft_transfer(&owner, &ft_token, &user, transfer_amount).await;
    ft_transfer(&owner, &ft_token, &user2, transfer_amount).await;
    ft_transfer(&owner, &ft_token, &user3, transfer_amount).await;
    ft_transfer(&owner, &ft_token, &minter, transfer_amount).await;

    // 3. Create minter account

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
    let initial_minter: u128 = ft_balance_of(&locked_token, &clues.as_account())
      .await?
      .parse()
      .unwrap();

    let mint_amount = transfer_amount;
    ft_transfer_call(
      &owner,
      &ft_token,
      locked_token.as_account(),
      transfer_amount,
      json!({ "type": "Mint", "account_id": clues.id() }).to_string(),
    )
    .await;

    let final_minter: u128 = ft_balance_of(&locked_token, &clues.as_account())
      .await?
      .parse()
      .unwrap();
    assert_eq!(initial_minter + mint_amount, final_minter);

    // 6. Mint a detective NFT, a PUP NFT and two clue
    // //nft mint automatically creates an id, incrementing it from 1

    let det_id = "#1";
    let det_id2 = "#2";
    let pup_id = "#1";
    let pup_id2 = "#2";
    let clue_id = "#1";
    let clue_id2 = "#2";

    nft_mint(&detective_contract, &owner, Some(&user)).await;
    nft_mint(&detective_contract, &owner, Some(&clues.as_account())).await;
    nft_mint(&pups_contract, &owner, Some(&user)).await;
    nft_mint(&pups_contract, &owner, Some(&user)).await;
    mint(
      &clues,
      &owner,
      clue_id.to_string(),
      Some(sample_token_metadata()),
    )
    .await;
    mint(
      &clues,
      &owner,
      clue_id2.to_string(),
      Some(sample_token_metadata()),
    )
    .await;

    let det_owner = view_nft_token(&detective_contract, det_id).await?;

    assert_eq!(
      det_owner.unwrap().owner_id.to_string(),
      user.id().to_string()
    );

    let det_owner2 = view_nft_token(&detective_contract, det_id2).await?;

    assert_eq!(
      det_owner2.unwrap().owner_id.to_string(),
      clues.id().to_string()
    );

    //7. Set claim price
    let claim_price: u128 = 100;

    insert_token_price(
      &clues,
      &owner,
      ft_token.id().to_string(),
      claim_price.to_string(),
    )
    .await;

    // 8. time travel to open season

    let block_info2 = worker.view_latest_block().await?;
    time_travel(&worker, half_hour).await?;
    let block_info3 = worker.view_latest_block().await?;

    // //9. Prove that user owns a detective and claim a clue

    nft_transfer_call(
      &detective_contract,
      &user,
      &clues.as_account(),
      &det_id,
      None,
      None,
      json!({ "type": "ProveOwner"}).to_string(),
    )
    .await;

    let fn_return = ft_transfer_call(
      &user,
      &ft_token,
      &clues.as_account(),
      claim_price,
      json!({ "type": "Claim", "token_id": clue_id.to_string() }).to_string(),
    )
    .await;

    let clue_owner = view_nft_token(&clues, clue_id).await?;

    assert_eq!(
      clue_owner.unwrap().owner_id.to_string(),
      user.id().to_string()
    );

    //10. Stake the clue
    nft_transfer_call(
      &detective_contract,
      &user,
      &clues.as_account(),
      &det_id,
      None,
      None,
      json!(    { "type":"Stake", "staked_nft_id": clue_id}   ).to_string(),
    )
    .await;

    //verify if clue was staked - in progress - no fucking clue how to catch the answer -
    let staked_clue = view_if_clue_is_staked(&clues, clue_id.to_string()).await?;

    assert!(staked_clue);

    // 11. Guess (first stake an NFT to get a ticket then guess)
    time_travel(&worker, half_hour + 2).await?;

    nft_transfer_call(
      &detective_contract,
      &user,
      &clues.as_account(),
      &det_id,
      None,
      None,
      json!(    { "type":"Guess"}   ).to_string(),
    )
    .await;

    let guess = Guess {
      account_id: user.id().to_string(),
      murderer: "John".to_string(),
      weapon: "Glock".to_string(),
      motive: "Jealous".to_string(),
      random_number: 1.to_string(),
    };

    let guess2 = Guess {
      account_id: user.id().to_string(),
      murderer: "Jane".to_string(),
      weapon: "Knife".to_string(),
      motive: "Hunger".to_string(),
      random_number: 1.to_string(),
    };

    //get the hash for both guesses
    let guess_hash = view_hash(&clues, guess.clone()).await.unwrap();
    let guess_hash2 = view_hash(&clues, guess2.clone()).await.unwrap();

    save_guess(&clues, &user, user.id().to_string(), guess_hash.to_string()).await;

    //verify that guess was saved
    let saved_hash = view_guess_was_inserted(&clues, guess_hash.to_string())
      .await
      .unwrap();
    assert!(saved_hash);

    //12. Buy Guess ticket and guess again - can only buy ticket after staking an NFT

    let tickets_before = view_user_tickets(&clues, user.id().to_string())
      .await
      .unwrap();

    ft_transfer_call(
      &user,
      &ft_token,
      &clues.as_account(),
      ticket_price,
      json!({ "type": "Guess", "det_or_pup": detective_contract.id(), "token_id": det_id })
        .to_string(),
    )
    .await;

    //verify that the ticket was purchased sucessfully

    let ticket = view_user_tickets(&clues, user.id().to_string())
      .await
      .unwrap();
    assert_eq!(ticket, tickets_before + 1);

    save_guess(
      &clues,
      &user,
      user.id().to_string(),
      guess_hash2.to_string(),
    )
    .await;
    let saved_hash2 = view_guess_was_inserted(&clues, guess_hash2.to_string())
      .await
      .unwrap();

    //verify that seconf guess was saved
    assert!(saved_hash2);

    //13. Claim Guess reward - time travel to end season

    time_travel(&worker, half_hour * 3).await?;

    let initial_balance: u128 = ft_balance_of(&locked_token, &user).await?.parse().unwrap();

    //claim first guess reward
    claim_guess_rewards(&clues, &user, guess).await;

    let final_balance: u128 = ft_balance_of(&locked_token, &user).await?.parse().unwrap();

    assert_eq!(initial_balance + 100, final_balance);

    let vesting_1_1 = &view_vesting_paginated(&locked_token, &user).await?[0];
    assert_eq!(vesting_1_1["locked_value"], 100.to_string());
    assert!(!vesting_1_1["fast_pass"].as_bool().unwrap());
    assert_eq!(vesting_1_1["withdrawn_tokens"], 0.to_string());

    let initial_balance2: u128 = ft_balance_of(&locked_token, &user).await?.parse().unwrap();

    //claim second guess reward
    claim_guess_rewards(&clues, &user, guess2).await;

    let final_balance2: u128 = ft_balance_of(&locked_token, &user).await?.parse().unwrap();

    assert_eq!(
      initial_balance2 + 100,
      final_balance2,
      "{}",
      "Fail on 2 balance"
    );

    let vesting_1_2 = &view_vesting_paginated(&locked_token, &user).await?[1];
    assert_eq!(vesting_1_2["locked_value"], 100.to_string());
    assert!(!vesting_1_2["fast_pass"].as_bool().unwrap());
    assert_eq!(vesting_1_2["withdrawn_tokens"], 0.to_string());

    //14. Claim clues reward

    let max_reward_clue = "20_000";

    let initial_balance3: u128 = ft_balance_of(&locked_token, &user).await?.parse().unwrap();

    //insert the amount of rewards elegible for this clue
    insert_clue_raniking(
      &clues,
      &owner,
      clue_id.to_string(),
      max_reward_clue.to_string(),
    )
    .await;

    let clue_reward: u128 = view_available_clue_rewards(&clues, clue_id.to_string()).await?;

    println!("{}{}", "clue_rewards: ", clue_reward);

    //claim clues reward
    claim_rewards(&clues, &user, clue_id.to_string()).await;

    let final_balance3: u128 = ft_balance_of(&locked_token, &user).await?.parse().unwrap();

    assert_eq!(
      initial_balance3 + clue_reward,
      final_balance3,
      "{}",
      "Fail on 3rd balance"
    );

    let vesting_1_3 = &view_vesting_paginated(&locked_token, &user).await?[2];

    assert_eq!(vesting_1_3["locked_value"], clue_reward.to_string());
    assert!(!vesting_1_3["fast_pass"].as_bool().unwrap());
    assert_eq!(vesting_1_3["withdrawn_tokens"], 0.to_string());

    //verify if clue was staked
    let staked_clue_removed = view_if_clue_is_staked(&clues, clue_id.to_string()).await?;

    assert!(!staked_clue_removed);

    //16. Unstake Guess NFT

    unstake_guess(
      &clues,
      &user,
      user.id().to_string(),
      det_id.to_string(),
      detective_contract.id().to_string(),
    )
    .await;

    //verify that the owner of the detective is not the clues contract anymore, but the actual owner
    let det_owner_un = view_nft_token(&detective_contract, det_id).await?;

    assert_eq!(
      det_owner_un.unwrap().owner_id.to_string(),
      user.id().to_string()
    );

    anyhow::Ok(())
  }
}
