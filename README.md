# Rain rUSD airdrop in Solana

This project offers an script to request an airdrop of rUSD on Solana network.

## Requisites

* Node.js

## ENV Variables

Modify the  `.env` file and modify:

* **RPC_URL:** The URL to a RPC node to send the request. Defaults to `https://api.devnet.solana.com`

* **SECRET_KEY:** The base58 encoded secret key of the solana account that is going to send the airdrop transaction and receive the tokens.

* **AMOUNT:** An optional amount of token to receive, if not provided it will be set to 1000 as default. The rUSD token has 6 decimals, to to receive 500 rUSD set the amount variable to 500000000

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
