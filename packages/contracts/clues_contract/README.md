# Clues Contract

The clues contract provide a NFT contract with built-in staking and specific-token claiming for the MMC game.

## Functionality

### Minting
In the context of the clue contract, when refering to minting we mean the contract call which the contract owner may issue to create new clues.

### Claiming
When users want to own a specific clue token they found when browsing the game, they may _claim_ it.

In order to claim a clue token the user must own a detective/pup NFT which they have to transfer to the contract in order to validate ownership; if the clue is available (unclaimed) the contract will give it to the user; finally, the contract will transfer the user's NFT back.

### Staking
Users may stake their clues, losing their trading capabilities for the season, but receiving a reward for it. Then all players will be able to see the clue image, which's _a priori_ only accessible by the clue owner through the MMC backend.

## Technical notes
This contract does not implement *NEP-178: Approval Management*. This matter should be deliberated.

The staking rewards functionality still isn't implemented.
