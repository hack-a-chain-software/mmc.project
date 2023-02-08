# Clues contract
The clues contract is the main contract for the MMC Game. This contract contains:

 - The Clues NFTs (standard NEP-171 NFT)
	 - Clue minting (by the contract owner)
	 - Clue claiming (by users) with multiple tokens 
 - Native staking function for the Clues
 -  Guessing feature to solve the mystery
 -  Reward distribution feature
	 - For clues 
	 - For the guessing 
- Treasury management
- Game management 

The game is a blockchain-native murder mystery, where the user's objective is to guess who murdered a character, what was the motive, and what the murder weapon was. 

The game happens in seasons, and a new contract should be deployed for each season. The season has a beginning date, a guessing start date, and a season-end date. 

To successfully guess the answer, users must look for clues. Those clues can be then claimed (bought), to reveal their information - to claim a clue, a user must hold a detective NFT.

The clue that was claimed will only display its information to the owner of the clue. To display the information to other users, the owner can then stake that clue. By staking the clue, the user will receive rewards at the end of the season.  

Once the guessing starts, users (that hold a detective or undercover pup nft) can guess the answer to the mystery. To guess, users must stake their NFTs. Each staked NFT gives the owner one guessing ticket. If the owner wants more tickets, they can purchase a new NFT and stake it or a guessing ticket. 

By the end of the season, the users will receive a reward proportional to the percentage of the answer that they got right. Also, the sooner a user guesses, the more rewards he is eligeble to. 

The owner of the contract is the only user that can manage the game. 

## Deploying and initializing the contract

In order to deploy and setup the contract, there are a few prerequisites necessary:
- Install Near CLI (Command Line Interface) - (Please ensure you [have NodeJS](https://nodejs.org/en/download/package-manager/) > 12.)
- Install yarn
- Install RUST
- Add Wasm toolchain
### Yarn
To install yarn run:
```
npm install --global yarn
```

### NEAR CLI
To Install the near CLI, open your terminal:
 - On Mac open Terminal using Spotlight with these steps: Press Command + Space Bar on your Mac Keyboard. Type in “Terminal” When you see Terminal in the Spotlight search list, click it to open the app
 - On Windows, click Start and search for "Command Prompt." Alternatively, you can also access the command prompt by pressing Ctrl + r on your keyboard, type "cmd" and then click OK.

and run the following command: 
```bash
  npm install -g near-cli
```
Now, you can run:

```bash
near
```

After that, you can log in on the NEAR account that you would like to be 
the **address where the contract will be deployed** - Please note that this 
is **not the owner of the contract**. To log in, type: 
```bash
near login
```

This will bring you to NEAR Wallet again where you can confirm the creation of a full-access key.

### RUST

Rust is the programming language used to program the smart contract. In order to use this contract, you must have rust installed on your computer.

To install Rust we will be using ```rustup``` an installer for rust.
Please see the directions from the [Rustup](https://rustup.rs/#) site. For OS X or Unix, you may use (type on command line):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Pro tip: to keep your command line clean, type ```clear``` and hit enter.

### Wasm toolchain

Smart contracts compile to WebAssembly (Wasm) so we'll add the toolchain for Rust:

```bash
rustup target add wasm32-unknown-unknown
```

More info about it can be found [here](https://rustwasm.github.io/docs/book/).

If you followed correctly the steps above, you are now ready to go. 
You can read more about the NEAR CLI and the deployment of rust codes [here](https://www.near-sdk.io/zero-to-hero/basics/set-up-skeleton)

If the contract is not compiled (it should be), you can compile it using: 

```bash
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
```

or alternatively: 

```bash
yarn build:contract 
``` 

### Deploying the contract 

This is an explanation of how to manually deploy the contract and initialize it - **we strongly recommend that you use the deploy script** (will be explained later) to deploy and initialize the game.

Assuming that you already have the ```NEAR CLI```, ```Rust``` and the ```Wasm Toolchain``` installed, and is logged in 
into the account that you want to deploy the project, we can now 
deploy it.

Now, we are going to deploy this project to the nar blockchain mainnet. 

First, make sure you are in the project folder. You can change your folder by typing:

```bash
cd your-project-folder-path
```

Now, check if your project folders have a folder called ``` out ``` 
and a file called ``` clues.wasm ``` if not, [check near-sdk git](https://github.com/near/near-sdk-rs) 
on how to compile the code.


To make it easier to deploy the project, let's create an environment variable
with the **address that we want for our contract** (you must be logged into this wallet)

To log in do:
```bash
near login
```

You'll be redirected to your browser were you will login to your wallet

```bash
  export CONTRACT_ID="YOUR_ACCOUNT_NAME.near"
```

Now, finally, we are going to run the following command to deploy the code:

```bash
near deploy --wasmFile out/clues.wasm --accountId $CONTRACT_ID
```

At this point, the contract should have been deployed to your account and you're ready to move on configuring the game specifications and setting the contract owner.

### Initializing the contract 
 
 After the deployment of the contract, it is necessary to initialize it.  You can initialize it by running the following command and substituting the parameters with the desired parameters:
```bash
near call $CONTRACT_ID new 
'{"owner_id": "owner_account.near", 
"metadata":{
"spec": "nft-1.0.0",
"name": "Clues",
"symbol": "CLUE",
"icon": null,
"base_uri": "https://imgur.com/gallery/OBB7tLg",
"reference": null,
"reference_hash": null,
},
"mmc_token_account": "mmc-token.near",
"detective_token_address": "detectives.near",
"pups_token_address": "pups.near",
"locked_tokens_address": "locked-mmc-token.near",
"season_begin": 1680361200000000000,
"season_end": 1685631600000000000,
"guessing_start": 1686150000000000000,
"ticket_price": 100}'
 --accountId <ownerAccountId>
```

 - `metadata` refers is the [NFT Contract metadata](https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata)
- `season_begin` is the Unix Timestamp in **nanoseconds**  for when the game will start. Same goes for `season_end` and `guessing_start`
- `ticket_price` is the **initial price** for the guessing ticket

Regarding the timestamps, here are some useful information:

In the example above, the game will start *Sat Apr 01 2023 15:00:00 GMT+0000* (UNIX: `1680361200`; UNIX in nanoseconds: `1680361200000000000`)

The guessing will start on *Wed Jun 07 2023 15:00:00 GMT+0000* (UNIX in nanoseconds `1686150000000000000`)

The game will end one week after the guessing starts, on *Thu Jun 01, 2023, 15:00:00 GMT+0000* (UNIX in nanoseconds `1685631600000000000`)

You can check what is the UNIX timestamp (**in seconds**) of a date [here](https://www.unixtimestamp.com/). Don't forget to convert it from *seconds* to *nanoseconds*.

The owner can alter the `guessing_start` date and the `season_end` date.

### Deployment using the deploy and init script

//TO-DO: explain how to deploy with that script

## Game configuration (owner)

There are a couple of configurations/actions that are necessary for this contract to work:

 1. Minting of the clues (will be done with an automated script)
 2. Setting the claim price for the clues (multiple currencies)
	 a. Register the clues contract on the currency storage
 3. Changing the guessing and end dates (optional)
 4. Add rewards to the contract //TO-DO

### Clue minting

Minting a clue means generating a clue, this is not a random mint. Only the owner can mint the clues, and the owner should mint all the clues before the game starts. 

When a user buys a clue, it is called "claiming".

Clue minting can be performed in two ways:
1. Using the CLI
2. Using the minting script

First, we'll cover how to mint the clues using the CLI, which would have to mint the clues one by one.  The following command shows how to mint a clue. 

**Manually minting a clue**
In order to manually mint a clue we must pass the `token_id` and the `token_metadata`: 

```bash
near call $CONTRACT_ID mint '{ "token_id": "1", "token_metadata": {
"title": "clue #1" ,
"description": "This is the first clue",
"media":"https://imgur.com/gallery/OBB7tLg",
"media_hash":null,
"copies":1,
"issued_at": 1680361200000000000,
"expires_at": null,
"starts_at": null,
"updated_at": null,
"extra": null,
"reference": null,
"reference_hash":null,
} }' --accountId <ownerAccountId>
```

The `token_id` is a string, and it should match the same id you gave to the clues on the database (don't worry - our script will handle this)

The `token_metada` has some parameters that we must be alert to:
- `media` is the link to the NFT image - we recommend hosting it on ipfs.
- `issued_at` is the UNIX timestamp for the date that the nft was issued at, you can leave "null".

For more reference on token metadata, you can check it [here](https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata). 

**Using the script to mint a clue**
//TO-DO

### Setting the claim price

We can set a price with any currency that has the [NEP-141 standard](https://nomicon.io/Standards/Tokens/FungibleToken/Core). The same function used to set a price for the first time can be used to overwrite the price. 

In order to see the price for a set currency, we can use the `view_price`. The call below shows the minting price using **Wrapped Near**. 

```bash
near view $CONTRACT_ID view_price '{"currency": "wrap.near" }'
```
Now, if you want to add a currency, here is the call necessary:

```bash
near call $CONTRACT_ID insert_token_price '{"currency": mmc-token.near,"price": "1000",}' --accountId <ownerAccountId>
```

- `currency` is the contract address (`AccountId`) for the NEP-141 token you want to add.
- `price` is the price to claim the token in that currency. That parameter is a `U128`, therefore it's necessary to add the " ". Don't forget that tokens have a set amount of decimals, so take that into consideration when adding the price.

#### Storage deposit

One thing that we can't forget to do is to register the clues contract on the token contracts that we want to use.  To do that, we must call the `storage_deposit` function. For more reference on it, check this [link](https://nomicon.io/Standards/StorageManagement). To register the contract, do the following if you are logged in with the contract account:

```bash
near call ft storage_deposit ''--accountId $CONTRACT_ID --amount 0.00235
```
If you want to register a given account or if you are not logged in to the contract and want to register it, you can do the following:

```bash
near call ft storage_deposit '{"account_id": "account_that_you_want_to_register.near"}' --accountId <any_account.near> --amount 0.00235
```

### Changing the guessing and end dates 

If for some reason the owner wants to change the the `season_end` date or the `guessing_start` date, there are two functions available in the contract for that.

#### Changing the guessing date

The `guessing_start` cannot be a date after the end of the season, and also cannot be a date in the past.  To see what those dates are you can do the following:

```bash
near view $CONTRACT_ID view_guessing_date ''
```
```bash
near view $CONTRACT_ID view_season_end_date ''
```
To change the guessing date, you perform: 
```bash
near call $CONTRACT_ID change_guessing_date '{"new_guesssing_date": 1680361200000000000}' --accountId <ownerAccountId>
```
The `new_guessing_date` parameter must be a UNIX Timestamp in nanoseconds 

#### Changing the end date

The `season_end` cannot be a date before the  `guessing_start`, and also cannot be a date in the past. 

To change the end date, you perform: 
```bash
near call $CONTRACT_ID change_season_end_date '{"new_end_date": 1680361200000000000}' --accountId <ownerAccountId>
```
The `new_guessing_date` parameter must be a UNIX Timestamp in nanoseconds 

### Adding rewards to the contract //TO-DO
###
