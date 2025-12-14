import {
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  generateSigningMessageForTransaction,
} from '@aptos-labs/ts-sdk';
import { aptos, CONTRACT_ADDRESS, toHex } from './aptos';

export interface SignRawHashFunction {
  (params: { address: string; chainType: 'aptos'; hash: `0x${string}` }): Promise<{
    signature: string;
  }>;
}

/**
 * Submit a deploy transaction using Privy wallet
 * @param amount - Amount of MOVE to deploy per block
 * @param blocks - Array of block numbers to deploy to
 * @param walletAddress - User's wallet address
 * @param publicKeyHex - User's public key
 * @param signRawHash - Privy's signing function
 */
export const submitDeployTransaction = async (
  amount: number,
  blocks: number[],
  walletAddress: string,
  publicKeyHex: string,
  signRawHash: SignRawHashFunction
): Promise<string> => {
  try {
    console.log('[Deploy Transaction] Starting:', { amount, blocks, walletAddress });

    // Build the transaction
    const rawTxn = await aptos.transaction.build.simple({
      sender: walletAddress,
      data: {
        function: `${CONTRACT_ADDRESS}::more::deploy` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [amount, blocks],
      },
    });

    console.log('[Deploy Transaction] Transaction built');

    // Generate signing message
    const message = generateSigningMessageForTransaction(rawTxn);

    // Sign with Privy wallet
    const { signature: rawSignature } = await signRawHash({
      address: walletAddress,
      chainType: 'aptos',
      hash: `0x${toHex(message)}`,
    });

    console.log('[Deploy Transaction] Signed');

    // Clean public key
    let cleanPublicKey = publicKeyHex.startsWith('0x') ? publicKeyHex.slice(2) : publicKeyHex;
    if (cleanPublicKey.length === 66) {
      cleanPublicKey = cleanPublicKey.slice(2);
    }

    // Create authenticator
    const senderAuthenticator = new AccountAuthenticatorEd25519(
      new Ed25519PublicKey(cleanPublicKey),
      new Ed25519Signature(rawSignature.startsWith('0x') ? rawSignature.slice(2) : rawSignature)
    );

    // Submit transaction
    const committedTransaction = await aptos.transaction.submit.simple({
      transaction: rawTxn,
      senderAuthenticator,
    });

    console.log('[Deploy Transaction] Submitted:', committedTransaction.hash);

    // Wait for confirmation
    const executed = await aptos.waitForTransaction({
      transactionHash: committedTransaction.hash,
    });

    if (!executed.success) {
      throw new Error('Transaction failed');
    }

    console.log('[Deploy Transaction] Confirmed');

    return committedTransaction.hash;
  } catch (error) {
    console.error('Deploy transaction error:', error);
    throw error;
  }
};

/**
 * Submit deploy transaction using native wallet (e.g., Nightly)
 */
export const submitDeployTransactionNative = async (
  amount: number,
  blocks: number[],
  walletAddress: string,
  signAndSubmitTransaction: any
): Promise<string> => {
  try {
    const response = await signAndSubmitTransaction({
      sender: walletAddress,
      data: {
        function: `${CONTRACT_ADDRESS}::more::deploy` as `${string}::${string}::${string}`,
        functionArguments: [amount, blocks],
      },
    });

    // Wait for confirmation
    const executed = await aptos.waitForTransaction({
      transactionHash: response.hash,
    });

    if (!executed.success) {
      throw new Error('Transaction failed');
    }

    return response.hash;
  } catch (error) {
    console.error('Native wallet deploy error:', error);
    throw error;
  }
};

/**
 * Fetch board state from blockchain
 */
export const fetchBoardState = async (): Promise<any> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${CONTRACT_ADDRESS}::more::get_board_state`,
        typeArguments: [],
        functionArguments: [],
      },
    });

    return result;
  } catch (error) {
    console.error('Error fetching board state:', error);
    return null;
  }
};

/**
 * Fetch miner stats from blockchain
 */
export const fetchMinerStats = async (address: string): Promise<any> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${CONTRACT_ADDRESS}::more::get_miner_stats`,
        typeArguments: [],
        functionArguments: [address],
      },
    });

    return result;
  } catch (error) {
    console.error('Error fetching miner stats:', error);
    return null;
  }
};

