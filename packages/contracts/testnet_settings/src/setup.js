const crypto = require("crypto");
const nearAPI = require("near-api-js");
const { BN } = require("near-workspaces");

const {
  connect,
  keyStores,
  accountCreator: { UrlAccountCreator },
} = nearAPI;

const {
  tokenArray,

  deployNft,
  deployGame,
  deployToken,
  createAccount,
  registerContracts,
  deployLockedToken,
} = require("./utils");

const totalClues = 20;

async function testnetSetup() {
  console.log('init deploy');

  // set connection
  const CREDENTIALS_DIR = "../.near-credentials";
  const keyStore = new keyStores.UnencryptedFileSystemKeyStore(CREDENTIALS_DIR);

  const config = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    deps: { keyStore },
  };

  const near = await connect(config);
  const accountCreator = new UrlAccountCreator(near, config.helperUrl);

  let last_block = await near.connection.provider.block({ finality: "final" });
  let last_block_height = last_block.header.height;

  let execution_data = {
    near,
    keyStore,
    accountCreator,
    config,
    accountMap: {},
    connAccountMap: {},
  };

  const TOKEN_SUPPLY = '1000000000000000000000000000000000';

  // save all base accounts to be created
  const random_prefix = crypto.randomBytes(10).toString("hex");

  execution_data.accountMap = {
    ...execution_data.accountMap,

    prefix: random_prefix,
    last_block_height: last_block_height,

    // Owner
    ownerAccount: random_prefix + "owner.testnet",

    // Fungible Tokens
    usdtTokenAccount: random_prefix + "usdt.testnet",
    nekoTokenAccount: random_prefix + "neko.testnet",
    auroraTokenAccount: random_prefix + "aurora.testnet",

    // Non Fungible Tokens
    pups: random_prefix + "pups.testnet",
    detectives: random_prefix + "detectives.testnet",

    // DEFI
    lockedTokenAccount: random_prefix + "locked_token.testnet",

    // Game
    gameAccount: random_prefix + "game.testnet",
  };

  // Create owner account
  execution_data.connAccountMap.ownerAccount = await createAccount(
    execution_data.accountMap.ownerAccount,
    execution_data
  );

  // Crate fungible token accounts
  execution_data.connAccountMap.usdtTokenAccount = await createAccount(
    execution_data.accountMap.usdtTokenAccount,
    execution_data
  );

  execution_data.connAccountMap.nekoTokenAccount = await createAccount(
    execution_data.accountMap.nekoTokenAccount,
    execution_data
  );

  execution_data.connAccountMap.auroraTokenAccount = await createAccount(
    execution_data.accountMap.auroraTokenAccount,
    execution_data
  );

  // Crate non fungible token accounts
  execution_data.connAccountMap.pups = await createAccount(
    execution_data.accountMap.pups,
    execution_data
  );

  execution_data.connAccountMap.detectives = await createAccount(
    execution_data.accountMap.detectives,
    execution_data
  );

  // Create defi account
  execution_data.connAccountMap.lockedTokenAccount = await createAccount(
    execution_data.accountMap.lockedTokenAccount,
    execution_data
  );

  // Crate game core account
  execution_data.connAccountMap.gameAccount = await createAccount(
    execution_data.accountMap.gameAccount,
    execution_data
  );

  console.log('');
  console.log('Created all accounts');
  console.log('');

  // Deploy and initialize Fungible tokens
  await deployToken(
    'usdtTokenAccount',
    TOKEN_SUPPLY,
    tokenArray[0],
    execution_data,
  );

  await deployToken(
    'nekoTokenAccount',
    TOKEN_SUPPLY,
    tokenArray[1],
    execution_data,
  );

  await deployToken(
    'auroraTokenAccount',
    TOKEN_SUPPLY,
    tokenArray[2],
    execution_data,
  );

  // Deploy and initialize Non Fungible Tokens
  await deployNft(
    'pups',
    {
      spec: "nft-1.0.0",
      name: "RealBirds",
      symbol: "REALBIRDS",
      base_uri: "https://api.therealbirds.com/metadata",
    },
    execution_data,
  );

  await deployNft(
    'detectives',
    {
      spec: "nft-1.0.0",
      name: "RealBirds",
      symbol: "REALBIRDS",
      base_uri: "https://api.therealbirds.com/metadata",
    },
    execution_data,
  );

  console.log('');
  console.log('Deployed tokens');
  console.log('');

  // Deploy and initialize locked token
  await deployLockedToken(
    execution_data,
  );

  // Deploy and initialize game contract
  await deployGame(
    execution_data,
  );

  console.log('');
  console.log('Deployed game');
  console.log('');

  // register contracts in eachother
  await registerContracts(
    [
      execution_data.connAccountMap.ownerAccount,

      execution_data.connAccountMap.lockedTokenAccount,

      execution_data.connAccountMap.gameAccount,
    ],
    [
      execution_data.connAccountMap.usdtTokenAccount,
      execution_data.connAccountMap.nekoTokenAccount,
      execution_data.connAccountMap.auroraTokenAccount,

      // execution_data.connAccountMap.pups,
      // execution_data.connAccountMap.detectives,

      execution_data.connAccountMap.lockedTokenAccount,

      // execution_data.connAccountMap.gameAccount,
    ],
  );

  console.log('');
  console.log('Setup minters');
  console.log('');

  // setup minters in locked token contract
  const minterContracts = [
    execution_data.connAccountMap.gameAccount,
    execution_data.connAccountMap.ownerAccount,
  ];

  const promisesMint = [];

  for (let minter of minterContracts) {
    promisesMint.push(
      execution_data.connAccountMap.ownerAccount.functionCall({
        contractId: execution_data.connAccountMap.lockedTokenAccount.accountId,
        methodName: "add_minter",
        args: {
          new_minter: minter.accountId,
        },
        attachedDeposit: new BN("1"),
      })
    );
  }

  await Promise.all(promisesMint);

  // Mint tokens on locked contract
  await execution_data.connAccountMap.ownerAccount.functionCall({
    contractId: execution_data.connAccountMap.usdtTokenAccount.accountId,
    methodName: "ft_transfer_call",
    args: {
      receiver_id: execution_data.connAccountMap.lockedTokenAccount.accountId,
      amount: "500000000000000000000",
      msg: "",
      msg: JSON.stringify({
        type: 'Mint',
        account_id: execution_data.connAccountMap.gameAccount.accountId,
      })
    },
    attachedDeposit: new BN(1),
    gas: new BN(300000000000000),
  });

  // Insert token price on game contract
  await execution_data.connAccountMap.ownerAccount.functionCall({
    contractId: execution_data.connAccountMap.gameAccount.accountId,
    methodName: "insert_token_price",
    args: {
      currency: execution_data.connAccountMap.usdtTokenAccount.accountId,
      price: '1000000',
    },
  });

  await execution_data.connAccountMap.ownerAccount.functionCall({
    contractId: execution_data.connAccountMap.gameAccount.accountId,
    methodName: "insert_token_price",
    args: {
      currency: execution_data.connAccountMap.nekoTokenAccount.accountId,
      price: '1000000',
    },
  });

  await execution_data.connAccountMap.ownerAccount.functionCall({
    contractId: execution_data.connAccountMap.gameAccount.accountId,
    methodName: "insert_token_price",
    args: {
      currency: execution_data.connAccountMap.auroraTokenAccount.accountId,
      price: '1000000',
    },
  });

  console.log('');
  console.log('Setup game');
  console.log('');

  // Mint 20 clues on game
  const promises = [];

  for (let i = 0; i < totalClues; i++) {
    promises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.gameAccount.accountId,
      methodName: 'mint',
      args: {
        token_id: `${i}`,
        token_metadata: {
          title:"mmc bolinho",
          description:null,
          media:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwa4LMJNbjO_w-DrS8F4Wz_KX3zHaxZpurSbi9re9xaEA32c7ERSOrkfyL-AIb2KpQYGU&usqp=CAU",
          extra:null,
          copies:null,
          issued_at:null,
          reference:null,
          starts_at:null,
          updated_at:null,
          expires_at:null,
          media_hash:null,
          reference_hash:null
        },
      },
      attachedDeposit: new BN("10000000000000000000000"),
      gas: new BN(300000000000000),
    }));
  }

  try {
    await Promise.all(promises);
  } catch (e) {
    console.warn(e);
  }

  console.log('');
  console.log('All clues minted');
  console.log('');

  const testers = [
    '1mateus.testnet',
    'jasso_test_mmc.testnet',
    'jkrowling.testnet',
    'mmctestnet.testnet',
  ];

  const storagePromises = []

  for (let i = 0; i < testers.length; i++) {
    let accountId = testers[i];

    // Deposit USDT for testers
    storagePromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.usdtTokenAccount.accountId,
      methodName: 'storage_deposit',
      args: {
        account_id: accountId,
        registration_only: true,
      },
      attachedDeposit: new BN("10000000000000000000000"),
      gas: new BN(300000000000000),
    }));

   // Deposit NEKO for testers
   storagePromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.nekoTokenAccount.accountId,
      methodName: 'storage_deposit',
      args: {
        account_id: accountId,
        registration_only: true,
      },
      attachedDeposit: new BN("10000000000000000000000"),
      gas: new BN(300000000000000),
    }));

   // Deposit AURORA for testers
   storagePromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.auroraTokenAccount.accountId,
      methodName: 'storage_deposit',
      args: {
        account_id: accountId,
        registration_only: true,
      },
      attachedDeposit: new BN("10000000000000000000000"),
      gas: new BN(300000000000000),
    }));
  }

  try {
    await Promise.all(storagePromises);
  } catch (e) {
    console.warn(e);
  }

  console.log('');
  console.log('Deposited all storages');
  console.log('');

  // Mint NFT's and send tokens for all account testers
  const tokenPromises = [];

  for (let i = 0; i < testers.length; i++) {
    let accountId = testers[i];

    // Deposit USDT for testers
    tokenPromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.usdtTokenAccount.accountId,
      methodName: 'ft_transfer',
      args: {
        receiver_id: accountId,
        registration_only: true,
        amount: '500000000000',
        memo: null,
      },
      attachedDeposit: new BN(1),
      gas: new BN(300000000000000),
    }));

   // Deposit NEKO for testers
    tokenPromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.nekoTokenAccount.accountId,
      methodName: 'ft_transfer',
      args: {
        receiver_id: accountId,
        registration_only: true,
        amount: '500000000000',
        memo: null,
      },
      attachedDeposit: new BN(1),
      gas: new BN(300000000000000),
    }));

   // Deposit AURORA for testers
    tokenPromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
      contractId: execution_data.connAccountMap.auroraTokenAccount.accountId,
      methodName: 'ft_transfer',
      args: {
        receiver_id: accountId,
        registration_only: true,
        amount: '500000000000',
        memo: null,
      },
      attachedDeposit: new BN(1),
      gas: new BN(300000000000000),
    }));

    for (let i = 0; i < totalClues/2; i++) {
      tokenPromises.push(execution_data.connAccountMap.ownerAccount.functionCall({
        contractId: execution_data.connAccountMap.detectives.accountId,
        methodName: 'nft_mint',
        args: {
          receiver_id: accountId,
        },
        attachedDeposit: new BN("10000000000000000000000"),
        gas: new BN(300000000000000),
      }));
    }
  }

  try {
    await Promise.all(tokenPromises);
  } catch (e) {
    console.warn(e);
  }

  console.log('');
  console.log('Minted all tokens');
  console.log('');

  console.log(execution_data.accountMap);
}

module.exports = { testnetSetup };
