/**
 * Utility functions for creating and managing Movement wallets with Privy
 */

export interface CreateWalletFunction {
  (params: { chainType: 'aptos' }): Promise<any>;
}

/**
 * Create a Movement wallet for a Privy user
 * @param user - The Privy user object
 * @param createWallet - The createWallet function from useCreateWallet hook
 * @returns The created wallet object with address
 */
export async function createMovementWallet(
  user: any,
  createWallet: CreateWalletFunction
): Promise<any> {
  try {
    // Check if user already has an Aptos/Movement wallet
    const existingWallet = user?.linkedAccounts?.find(
      (account: any) => account.type === 'wallet' && account.chainType === 'aptos'
    );

    if (existingWallet) {
      console.log('Movement wallet already exists:', existingWallet.address);
      return existingWallet;
    }

    // Create a new Aptos/Movement wallet
    console.log('Creating new Movement wallet for user...');
    const wallet = await createWallet({ chainType: 'aptos' });
    
    console.log('Movement wallet created successfully:', (wallet as any).address);
    return wallet;
  } catch (error) {
    console.error('Error creating Movement wallet:', error);
    throw error;
  }
}

/**
 * Convert address to hex string (handles Uint8Array, AccountAddress, etc.)
 */
function addressToString(address: any): string {
  if (!address) return '';
  
  // Already a string
  if (typeof address === 'string') {
    return address.startsWith('0x') ? address : `0x${address}`;
  }
  
  // Uint8Array or Buffer
  if (address instanceof Uint8Array || address?.data instanceof Uint8Array) {
    const bytes = address instanceof Uint8Array ? address : address.data;
    const hex = Array.from(bytes)
      .map((b: number) => b.toString(16).padStart(2, '0'))
      .join('');
    return `0x${hex}`;
  }
  
  // Object with address property
  if (address.address) {
    return addressToString(address.address);
  }
  
  // Try toString()
  if (typeof address.toString === 'function') {
    const str = address.toString();
    return str.startsWith('0x') ? str : `0x${str}`;
  }
  
  console.warn('⚠️ Unknown address format:', address);
  return '';
}

/**
 * Get the Movement wallet from a Privy user
 * @param user - The Privy user object
 * @returns The Movement wallet with normalized address or null
 */
export function getMovementWallet(user: any) {
  const wallet = user?.linkedAccounts?.find(
    (account: any) => account.type === 'wallet' && account.chainType === 'aptos'
  );
  
  if (!wallet) return null;
  
  // Normalize the address to a hex string
  const normalizedAddress = addressToString(wallet.address);
  
  console.log('🔍 getMovementWallet:', {
    rawAddress: wallet.address,
    rawType: typeof wallet.address,
    normalizedAddress,
    publicKey: wallet.publicKey
  });
  
  return {
    ...wallet,
    address: normalizedAddress, // Override with normalized string
  };
}

