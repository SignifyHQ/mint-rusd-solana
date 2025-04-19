# Rain rUSD airdrop in Solana

This project offers an script to request an airdrop of rUSD on Solana network.

## Requisites

* Node.js

## ENV Variables

Modify the  `.env` file and modify:

* **RPC_URL:** The URL to a RPC node to send the request. Defaults to `https://api.devnet.solana.com`

* **SECRET_KEY:** The base58 encoded secret key of the solana account that is going to send the airdrop transaction and receive the tokens.

* **AMOUNT:** An optional amount of token to receive, if not provided it will be set to 1000 as default. The rUSD token has 6 decimals, to receive 500 rUSD set the amount variable to 500000000

## Install dependencies

Install the required node packages by running:

```
npm i
```

or 

```
yarn
```

## Compute secret key from mnemonic

> [!WARNING]
> do not use production keys for this

if necessary, use the following script to generate your base58 encoded secret key from a mnemonic you generated when setting up a solana devnet account (e.g. using solflare)

```typescript
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import bs58 from "bs58";

const mnemonic =  "REPLACE THIS WITH YOUR MNEMONIC";
const seed = bip39.mnemonicToSeedSync(mnemonic, "");
const keypair = Keypair.fromSeed(seed.slice(0, 32));

const { secretKey } = keypair;
const secretKeyBase58 = bs58.encode(secretKey);
console.log(secretKeyBase58);

// console.log(`${keypair.publicKey.toBase58()}`);
```

## Execute the script

Run either of the following commands to receive the airdrop:

```
npm run airdrop:rusd
```

or

```
yarn airdrop:rusd
```

> [!IMPORTANT]
> you will need some `SOL` to pay the necessary gas fees to request / receive the aidrop.

you can use this script to generate SOL to cover the gas
```typescript
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function getSolAirdrop() {
  // Get the secret key from environment variables
  const secretKey = process.env.SECRET_KEY;
  
  // Check if secret key exists
  if (!secretKey) {
    throw new Error('Must provide a secret key in the "SECRET_KEY" ENV var');
  }
  
  // Derive keypair from secret key
  const keypair = Keypair.fromSecretKey(bs58.decode(secretKey));
  
  // Get public key from the keypair
  const publicKey = keypair.publicKey;
  console.log(`Using wallet address: ${publicKey.toString()}`);
  
  // Connect to devnet
  console.log("Connecting to devnet...");
  const rpcUrl = process.env.RPC_URL || "https://api.devnet.solana.com";
  const connection = new Connection(rpcUrl, "confirmed");
  
  // Check current balance
  const balanceBefore = await connection.getBalance(publicKey);
  console.log(`Current balance: ${balanceBefore / LAMPORTS_PER_SOL} SOL`);
  
  // Request airdrop (2 SOL should be more than enough)
  console.log("Requesting 2 SOL from devnet...");
  const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
  
  console.log(`Airdrop requested. Signature: ${signature}`);
  console.log("Confirming transaction...");
  
  await connection.confirmTransaction(signature, "confirmed");
  
  // Check new balance
  const balanceAfter = await connection.getBalance(publicKey);
  console.log(`New balance: ${balanceAfter / LAMPORTS_PER_SOL} SOL`);
  console.log("Airdrop successful! You can now run the rUSD script.");
}

getSolAirdrop().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
```
