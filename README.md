# Rain rUSD airdrop in Solana

This project offers an script to request an airdrop of rUSD on Solana network.

## Requisites

* Node.js

## ENV Variables

Modify the  `.env` file and modify:

* **RPC_URL:** The URL to a RPC node to send the request.

* **SECRET_KEY:** The secret key of the solana account that is going to send the airdrop transaction and receive the tokens.

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

## Execute the script

Run either of the following commands to receive the airdrop:

```
npm run airdrop:rusd
```

or

```
yarn airdrop:rusd
```
