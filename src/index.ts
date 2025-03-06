import {Connection, Keypair, sendAndConfirmTransaction} from '@solana/web3.js';
import {BN} from 'bn.js';
import bs58 from 'bs58';
import {MockToken, mockTokenIDL} from './IDL';
import {waitTransaction} from './utils';
import * as anchor from "@coral-xyz/anchor";
import dotenv from 'dotenv';

// Load the env variables
dotenv.config();

/**
 * Get an the anchor provider using the RPC URL loaded in the env vars
 * @returns An AnchorProvider connected with the given RPC URL
 */
function getProvider(): Connection {
  // Get the RPC URL from the ENV variables
  console.log('Setting up connection...');
  const providerUrl = process.env.RPC_URL;
  // Check the value was given
  if (!providerUrl) {
    throw new Error('The ENV "RPC_URL" was not given');
  }
  // Create the anchor provider
  const connection = new Connection(providerUrl, {commitment: 'confirmed'});
  console.log('Connection ready!');
  // Return the provider
  return connection;
}

/**
 * Get the requester secret key from the EVN variables and load it into a Keypair
 * @returns The Keypair associated to the given secret
 */
function getRequesterKeyPair(): Keypair {
  // Get the secret from the ENV
  console.log('Setting up token requester Keypair...');
  const secretKey = process.env.SECRET_KEY;
  // Check the value was given
  if (!secretKey) {
    throw new Error('Must provide a secret key to request the airdrop in the "SECRET_KEY" ENV var');
  }

  // Create the Keypair from the secret
  const requesterKeypair = Keypair.fromSecretKey(bs58.decode(secretKey));
  console.log('Requester keypair loaded!');
  // Return the keypair
  return requesterKeypair;
}

async function sendAirdrop(connection: Connection, requester: Keypair): Promise<string> {
  // Get the mock token program
  console.log('Loading the program...');
  const mockTokenProgram = new anchor.Program<MockToken>(mockTokenIDL, {} as anchor.Provider);

  // Set the amount
  const amount = Number(process.env.AMOUNT ?? 1e9);
  // Create the airdrop instruction
  console.log(`Requesting ${amount / 1e6} rUSD...`);
  const airdropTransaction = await mockTokenProgram.methods.mintTokens(new BN(amount)).accounts({
    payer: requester.publicKey,
  }).signers([requester]).transaction();
  // Send the transaction
  const airdropTx = await sendAndConfirmTransaction(
    connection,
    airdropTransaction,
    [requester],
    {commitment: 'processed'},
  );
  console.log(`Transaction sent with signature: ${airdropTx}`);
  // Return the transaction signature
  return airdropTx;
}

async function main() {
  // Get the anchor provder
  const connection = getProvider();
  // Set the requester
  const requesterKeypair = getRequesterKeyPair();
  // Sent the airdrop
  const tx = await sendAirdrop(connection, requesterKeypair);
  // Wait for the transaction to be confirmed
  await waitTransaction(connection, tx);
}

// Run the main function
main().catch((error) => {
  // Log the error
  console.error(error);
  // Exit with a failure code
  process.exit(1);
});
