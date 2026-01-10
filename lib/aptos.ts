import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Movement network configurations
export const MOVEMENT_CONFIGS = {
  mainnet: {
    chainId: 126,
    name: "Movement Mainnet",
    fullnode: "https://full.mainnet.movementinfra.xyz/v1",
    explorer: "https://explorer.movementnetwork.xyz",
    faucet: null
  },
  testnet: {
    chainId: 250,
    name: "Movement Bardock Testnet",
    // Alternative RPC endpoints (try these if primary fails):
    // Option 1: Primary (Current)
    fullnode: "https://testnet.movementnetwork.xyz/v1",
    // Option 2: Alternative (Uncomment if primary fails)
    // fullnode: "https://aptos.testnet.porto.movementlabs.xyz/v1",
    // Option 3: Aptos Labs (Uncomment if both fail)
    // fullnode: "https://fullnode.testnet.aptoslabs.com/v1",
    explorer: "https://explorer.movementnetwork.xyz",
    faucet: "https://faucet.testnet.movementnetwork.xyz/",
    contractAddress: '0x41f50ee5eafbf2d4ac7ebf2df582c8aeb5e5a6070bee6cd55b0c09dac189e8d6'
  }
};

export const CURRENT_NETWORK = 'testnet';

// Initialize Aptos SDK with Movement network
export const aptos = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    fullnode: MOVEMENT_CONFIGS[CURRENT_NETWORK].fullnode,
  })
);

// Contract address
export const CONTRACT_ADDRESS = '0x41f50ee5eafbf2d4ac7ebf2df582c8aeb5e5a6070bee6cd55b0c09dac189e8d6';

// Faucet URL
export const FAUCET_URL = MOVEMENT_CONFIGS[CURRENT_NETWORK].faucet;

// Log current network on initialization
// Vault address (V3 - Resource Account)
export const VAULT_ADDRESS = '0xfc7e6f32653414966f60f937f1f7ecf93e0a454b0754929313993956c17c86b1';

console.log('🌐 Network Configuration:');
console.log(`  Network: Movement Bardock Testnet`);
console.log(`  RPC: ${MOVEMENT_CONFIGS.testnet.fullnode}`);
console.log(`  Explorer: ${MOVEMENT_CONFIGS.testnet.explorer}`);
console.log(`  Faucet: ${FAUCET_URL}`);
console.log(`  Contract: ${CONTRACT_ADDRESS}`);
console.log(`  Vault: ${VAULT_ADDRESS}`);
console.log(`  Modules: more_token_v3, game_state_v3, motherlode_v3, automation_v3`);

// Module names - V3 UPDATE
export const MODULES = {
  MORE_TOKEN: `${CONTRACT_ADDRESS}::more_token_v3`,
  GAME_STATE: `${CONTRACT_ADDRESS}::game_state_v3`,
  MOTHERLODE: `${CONTRACT_ADDRESS}::motherlode_v3`,
  AUTOMATION: `${CONTRACT_ADDRESS}::automation_v3`,
};

// Constants
export const DECIMALS = 8;
export const DECIMAL_MULTIPLIER = 100000000; // 10^8
export const MIN_DEPLOYMENT = 100000000; // 1 MOVE minimum
export const GRID_SIZE = 25; // 5x5 grid
export const MIN_STAKE_AUTOMATION = 1000000000; // 10 MOVE minimum

// Helper functions for number conversion
export function toSmallestUnit(amount: number): string {
  return Math.floor(amount * DECIMAL_MULTIPLIER).toString();
}

export function fromSmallestUnit(amount: string | number): number {
  return Number(amount) / DECIMAL_MULTIPLIER;
}

// Utility to convert Uint8Array to hex string
export const toHex = (buffer: Uint8Array): string => {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Get transaction explorer URL
export function getTxExplorerUrl(txHash: string): string {
  if (!txHash) {
    console.warn('⚠️ No txHash provided for explorer URL');
    return 'https://explorer.movementnetwork.xyz/?network=bardock+testnet';
  }
  const formattedHash = txHash.startsWith('0x') ? txHash : `0x${txHash}`;
  return `https://explorer.movementnetwork.xyz/txn/${formattedHash}?network=bardock+testnet`;
}

// Get account explorer URL
export const getAccountExplorerUrl = (address: string | undefined | null): string => {
  if (!address || typeof address !== 'string') {
    console.warn('⚠️ No address provided for explorer URL');
    return 'https://explorer.movementnetwork.xyz/?network=bardock+testnet';
  }
  const formattedAddress = address.startsWith('0x') ? address : `0x${address}`;
  return `https://explorer.movementnetwork.xyz/account/${formattedAddress}?network=bardock+testnet`;
};

// Get account MOVE balance (native token)
export async function getAccountMOVEBalance(address: string): Promise<number> {
  try {
    if (!address) {
      console.warn('⚠️ No address provided for MOVE balance');
      return 0;
    }

    console.log('🔍 Fetching MOVE balance for:', address);

    const resource = await aptos.getAccountResource({
      accountAddress: address,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });
    
    console.log('📦 MOVE Resource:', resource);
    
    const balance = (resource as any)?.coin?.value;
    
    if (!balance) {
      console.warn('⚠️ No balance found in resource');
      return 0;
    }
    
    const balanceInMOVE = fromSmallestUnit(balance);
    
    console.log('💰 MOVE Balance:', {
      raw: balance,
      formatted: balanceInMOVE.toFixed(4),
    });
    
    return balanceInMOVE;
  } catch (error: any) {
    console.error("❌ Error fetching MOVE balance:", error?.message || error);
    
    if (error?.message?.includes('Resource not found')) {
      console.warn('⚠️ Account not initialized or no MOVE balance');
    }
    
    return 0;
  }
}

// Get Vault MOVE balance (V3 - Resource Account)
export async function getVaultBalance(): Promise<number> {
  try {
    console.log('💰 Fetching Vault MOVE balance...');

    const resource = await aptos.getAccountResource({
      accountAddress: VAULT_ADDRESS,
      resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    });
    
    const balance = (resource as any)?.coin?.value;
    
    if (!balance) {
      console.warn('⚠️ No balance found in vault');
      return 0;
    }
    
    const balanceInMOVE = fromSmallestUnit(balance);
    
    console.log('🏦 Vault Balance:', {
      raw: balance,
      formatted: balanceInMOVE.toFixed(4),
    });
    
    return balanceInMOVE;
  } catch (error: any) {
    console.error("❌ Error fetching Vault balance:", error?.message || error);
    return 0;
  }
}

// Get vault address from contract (view function)
export async function getVaultAddressFromContract(): Promise<string> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.GAME_STATE}::get_vault_address` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS],
      },
    });
    
    return result[0] as string;
  } catch (error: any) {
    console.error("❌ Error fetching vault address:", error?.message || error);
    return VAULT_ADDRESS; // Fallback to hardcoded address
  }
}

// Get MORE token balance
export async function getMOREBalance(address: string): Promise<number> {
  try {
    if (!address) {
      console.warn('⚠️ No address provided for MORE balance');
      return 0;
    }

    console.log('🪙 Fetching MORE balance for:', address);

    const result = await aptos.view({
      payload: {
        function: `${MODULES.MORE_TOKEN}::balance_of` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [address, CONTRACT_ADDRESS], // V3: balance_of(account, admin_addr)
      },
    });
    
    console.log('📦 MORE View Result:', result);
    
    if (!result || !result[0]) {
      console.warn('⚠️ No MORE balance returned from view function');
      return 0;
    }
    
    const balance = fromSmallestUnit(result[0] as string);
    
    console.log('🪙 MORE Balance:', {
      raw: result[0],
      formatted: balance.toFixed(4),
    });
    
    return balance;
  } catch (error: any) {
    console.error("❌ Error fetching MORE balance:", error?.message || error);
    
    if (error?.message?.includes('EBALANCE_NOT_FOUND') || error?.message?.includes('not found')) {
      console.warn('⚠️ User has no MORE balance or not initialized');
    }
    
    return 0;
  }
}
