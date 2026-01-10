import { aptos, CONTRACT_ADDRESS, MODULES, toSmallestUnit, fromSmallestUnit } from './aptos';
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

// ============================================================================
// MORE TOKEN FUNCTIONS
// ============================================================================

/**
 * Get 10,000 MORE tokens from test faucet
 */
export async function claimTestFaucet(): Promise<InputTransactionData> {
  return {
    data: {
      function: `${MODULES.MORE_TOKEN}::test_faucet` as `${string}::${string}::${string}`,
      typeArguments: [],
      functionArguments: [CONTRACT_ADDRESS],
    },
  };
}

// ============================================================================
// GAME STATE FUNCTIONS
// ============================================================================

/**
 * Initialize miner (first time only)
 */
export async function initializeMiner(): Promise<InputTransactionData> {
  return {
    data: {
      function: `${MODULES.GAME_STATE}::initialize_miner` as `${string}::${string}::${string}`,
      typeArguments: [],
      functionArguments: [],
    },
  };
}

/**
 * Deploy MOVE to grid blocks
 * @param blockIndices - Array of block numbers [0-24]
 * @param amountPerBlock - Amount in MOVE (will be converted to smallest unit)
 */
export async function deployToBlocks(
  blockIndices: number[],
  amountPerBlock: number
): Promise<InputTransactionData> {
  const amountInSmallestUnit = toSmallestUnit(amountPerBlock);
  
  // ⚠️ CRITICAL: Convert from visual block numbers (1-25) to contract indices (0-24)
  const contractIndices = blockIndices.map(blockNum => blockNum - 1);
  
  console.log('🚀 Deploy Transaction Payload:');
  console.log('  - Contract:', CONTRACT_ADDRESS);
  console.log('  - Visual Block Numbers:', blockIndices, '(what user sees)');
  console.log('  - Contract Indices:', contractIndices, '(0-indexed for contract)');
  console.log('  - Amount Per Block (input):', amountPerBlock);
  console.log('  - Amount in smallest unit:', amountInSmallestUnit);
  console.log('  - MIN_DEPLOYMENT:', '100000000 (1 MOVE)');
  
  return {
    data: {
      function: `${MODULES.GAME_STATE}::deploy` as `${string}::${string}::${string}`,
      typeArguments: [],
      functionArguments: [
        CONTRACT_ADDRESS,
        contractIndices, // ✅ 0-indexed for contract
        amountInSmallestUnit,
      ],
    },
  };
}

/**
 * Get current game state
 * @returns [round, total_deployed, motherlode_more, is_active]
 */
export async function fetchGameState(adminAddr: string): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.GAME_STATE}::get_game_state` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [adminAddr],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching game state:', error);
    throw error;
  }
}

/**
 * Get round status - V2 NEW FUNCTION! ⭐
 * Returns countdown timer and round info
 * @returns [round, round_start, round_end, time_remaining_seconds, is_ended]
 */
export async function getRoundStatus(adminAddr: string): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.GAME_STATE}::get_round_status` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [adminAddr],
      },
    });
    
    console.log('⏱️ Round Status:', {
      round: result[0],
      start: result[1],
      end: result[2],
      remaining: result[3],
      isEnded: result[4]
    });
    
    return result as any[];
  } catch (error: any) {
    console.error('❌ Error fetching round status:', error);
    
    // If RPC error, return safe defaults
    if (error?.message?.includes('not valid JSON') || error?.message?.includes('Rate limit')) {
      console.warn('⚠️ RPC issue detected, using fallback values');
    }
    
    return [1, 0, 60, 0, true]; // Safe defaults: round 1, ended
  }
}

/**
 * Get miner state
 * @returns [total_deployed, more_earned, rounds_won, blocks_deployed_count]
 */
export async function getMinerState(minerAddr: string): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.GAME_STATE}::get_miner_state` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [minerAddr],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching miner state:', error);
    return [0, 0, 0, 0];
  }
}

/**
 * Get specific block state
 * @returns [total_deployed, miner_count, is_winning]
 */
export async function getBlockState(blockIdx: number): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.GAME_STATE}::get_block` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS, blockIdx],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching block state:', error);
    return [0, 0, false];
  }
}

/**
 * Get protocol fees
 * @returns [protocol_fees_move, protocol_fees_more]
 */
export async function getProtocolFees(): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.GAME_STATE}::get_protocol_fees` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching protocol fees:', error);
    return [0, 0];
  }
}

// ============================================================================
// STAKING FUNCTIONS - ⚠️ DEPRECATED - DO NOT USE
// ============================================================================
// Staking module was removed from contract. Use automation instead.
// These functions are kept for reference but will throw errors if called.
// ============================================================================

/**
 * @deprecated Staking module removed - use automation instead
 */
export async function stakeMORE(amount: number): Promise<InputTransactionData> {
  throw new Error('Staking module deprecated. Use automation instead.');
}

/**
 * @deprecated Staking module removed - use automation instead
 */
export async function claimStakingRewards(): Promise<InputTransactionData> {
  throw new Error('Staking module deprecated. Use automation instead.');
}

/**
 * @deprecated Staking module removed - use automation instead
 */
export async function unstakeMORE(amount: number): Promise<InputTransactionData> {
  throw new Error('Staking module deprecated. Use automation instead.');
}

/**
 * @deprecated Staking module removed - use automation instead
 */
export async function getUserStakeInfo(userAddr: string): Promise<any[]> {
  throw new Error('Staking module deprecated. Use automation instead.');
}

/**
 * @deprecated Staking module removed - use automation instead
 */
export async function getPendingRewards(userAddr: string): Promise<number> {
  throw new Error('Staking module deprecated. Use automation instead.');
}

/**
 * Get staking pool info
 * @returns [total_staked, total_rewards_distributed, total_stakers]
 */
export async function getStakingPoolInfo(): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.STAKING}::get_staking_pool` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching staking pool info:', error);
    return [0, 0, 0];
  }
}

// ============================================================================
// MOTHERLODE FUNCTIONS
// ============================================================================

/**
 * Get motherlode pool size
 */
export async function fetchMotherlodePool(adminAddr: string): Promise<number> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.MOTHERLODE}::get_motherlode_pool` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [adminAddr],
      },
    });
    return result && result[0] ? Number(result[0]) : 0;
  } catch (error) {
    console.error('Error fetching motherlode pool:', error);
    return 0;
  }
}

/**
 * Get latest round result
 * @returns [total_deployed, vaulted, winnings, motherlode_contribution, was_motherlode_round, motherlode_payout]
 */
export async function getLatestRoundResult(): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.MOTHERLODE}::get_round_result` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching latest round result:', error);
    return [0, 0, 0, 0, false, 0];
  }
}

/**
 * Get specific round result
 */
export async function getRoundResultByNumber(round: number): Promise<any[]> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.MOTHERLODE}::get_round_result_by_number` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS, round],
      },
    });
    return result as any[];
  } catch (error) {
    console.error('Error fetching round result:', error);
    return [0, 0, 0, 0, false, 0];
  }
}

/**
 * Get total rounds completed
 */
export async function getTotalRounds(): Promise<number> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.MOTHERLODE}::get_total_rounds` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS],
      },
    });
    return result && result[0] ? Number(result[0]) : 0;
  } catch (error) {
    console.error('Error fetching total rounds:', error);
    return 0;
  }
}

// ============================================================================
// AUTOMATION FUNCTIONS
// ============================================================================

export type AutomationStrategy = "random" | "all" | "custom";

const STRATEGY_MAP: Record<AutomationStrategy, number> = {
  random: 0,
  all: 1,
  custom: 2,
};

/**
 * Enable automation
 * @param stakeAmount - Total MOVE to stake
 * @param amountPerBlock - Amount per block deployment
 * @param strategy - "random", "all", or "custom"
 * @param customBlocks - For custom strategy
 */
export async function enableAutomationNative(
  stakeAmount: number,
  amountPerBlock: number,
  strategy: AutomationStrategy,
  customBlocks: number[],
  signAndSubmitTransaction: any
): Promise<string> {
  const payload: InputTransactionData = {
    data: {
      function: `${MODULES.AUTOMATION}::enable_automation` as `${string}::${string}::${string}`,
      typeArguments: [],
      functionArguments: [
        toSmallestUnit(stakeAmount),
        toSmallestUnit(amountPerBlock),
        STRATEGY_MAP[strategy],
        customBlocks,
      ],
    },
  };

  const response = await signAndSubmitTransaction(payload);
  await aptos.waitForTransaction({ transactionHash: response.hash });
  return response.hash;
}

/**
 * Enable automation (Privy version)
 */
export async function enableAutomation(
  stakeAmount: number,
  amountPerBlock: number,
  strategy: AutomationStrategy,
  customBlocks: number[],
  address: string,
  publicKey: string,
  signRawHash: any
): Promise<string> {
  // TODO: Implement Privy signing
  throw new Error("Privy automation not yet implemented");
}

/**
 * Disable automation
 */
export async function disableAutomationNative(
  signAndSubmitTransaction: any
): Promise<string> {
  const payload: InputTransactionData = {
    data: {
      function: `${MODULES.AUTOMATION}::disable_automation` as `${string}::${string}::${string}`,
      typeArguments: [],
      functionArguments: [],
    },
  };

  const response = await signAndSubmitTransaction(payload);
  await aptos.waitForTransaction({ transactionHash: response.hash });
  return response.hash;
}

/**
 * Disable automation (Privy version)
 */
export async function disableAutomation(
  address: string,
  publicKey: string,
  signRawHash: any
): Promise<string> {
  // TODO: Implement Privy signing
  throw new Error("Privy automation not yet implemented");
}

/**
 * Add more stake to automation
 */
export async function addAutomationStake(
  additionalAmount: number,
  address: string,
  publicKey: string,
  signRawHash: any
): Promise<string> {
  // TODO: Implement Privy signing
  throw new Error("Privy automation not yet implemented");
}

/**
 * Get automation config
 * @returns {isActive, stakedBalance, amountPerBlock, strategy, lastDeployedRound, totalDeployments}
 */
export async function getAutomationConfig(userAddr: string): Promise<any> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.AUTOMATION}::get_automation_config` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [userAddr],
      },
    });

    if (result && result.length >= 6) {
      return {
        isActive: Boolean(result[0]),
        stakedBalance: fromSmallestUnit(result[1] as string),
        amountPerBlock: fromSmallestUnit(result[2] as string),
        strategy: Number(result[3]),
        lastDeployedRound: Number(result[4]),
        totalDeployments: Number(result[5]),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching automation config:', error);
    return null;
  }
}

/**
 * Estimate rounds remaining
 */
export async function estimateRoundsRemaining(userAddr: string): Promise<number> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.AUTOMATION}::estimate_rounds_remaining` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [userAddr],
      },
    });
    return result && result[0] ? Number(result[0]) : 0;
  } catch (error) {
    console.error('Error estimating rounds remaining:', error);
    return 0;
  }
}

/**
 * Check if automation can execute
 */
export async function canExecuteAutomation(userAddr: string): Promise<boolean> {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.AUTOMATION}::can_execute_automation` as `${string}::${string}::${string}`,
        typeArguments: [],
        functionArguments: [userAddr, CONTRACT_ADDRESS],
      },
    });
    return result && result[0] ? Boolean(result[0]) : false;
  } catch (error) {
    console.error('Error checking automation execution:', error);
    return false;
  }
}
