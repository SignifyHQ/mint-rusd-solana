import { Connection } from "@solana/web3.js";

/**
 * Waits for a transaction to be confirmed.
 * @param connection The Solana connection
 * @param tx The transaction signature
 */
export async function waitTransaction(connection: Connection, tx: string): Promise<void> {
  console.log('Waiting for transaction to be confirmed...');
  // Get the latest block hash info
  const lastBlockHash = await connection.getLatestBlockhash();
  // Wait for the transaction to be confirmed
  await connection.confirmTransaction({
    signature: tx,
    blockhash: lastBlockHash.blockhash,
    lastValidBlockHeight: lastBlockHash.lastValidBlockHeight,
  }, 'confirmed');
  console.log('Transaction confirmed');
}
