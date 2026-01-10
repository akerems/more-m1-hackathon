/// Staking - Flexible staking with block-based rewards
/// Stake MORE tokens anytime, earn rewards per block, claim when threshold is reached
module more_v3::staking_v3 {
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::block;
    use aptos_framework::event;
    use aptos_framework::fungible_asset;
    use aptos_framework::primary_fungible_store;
    use more_v3::more_token_v3;

    /// Errors
    const E_NOT_INITIALIZED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_NO_STAKE: u64 = 3;
    const E_INSUFFICIENT_REWARDS: u64 = 4;

    /// Reward configuration
    const REWARD_PER_BLOCK_PER_TOKEN: u64 = 100; // 0.0001 MORE per block per 1 MORE staked (with 8 decimals)
    const MIN_CLAIM_AMOUNT: u64 = 100000000;     // 1 MORE minimum to claim (8 decimals)

    /// User stake state
    struct UserStake has key {
        amount: u64,              // Total MORE tokens staked
        start_block: u64,         // Block height when staked
        last_claim_block: u64,    // Last block when rewards were claimed
        total_rewards_claimed: u64, // Total rewards claimed so far
    }

    /// Global staking pool
    struct StakingPool has key {
        total_staked: u64,              // Total MORE staked across all users
        total_rewards_distributed: u64, // Total rewards claimed
        total_stakers: u64,             // Number of active stakers
        is_active: bool,
    }

    /// Events
    #[event]
    struct StakeEvent has drop, store {
        user: address,
        amount: u64,
        block_height: u64,
        timestamp: u64,
    }

    #[event]
    struct UnstakeEvent has drop, store {
        user: address,
        amount: u64,
        rewards: u64,
        block_height: u64,
        timestamp: u64,
    }

    #[event]
    struct ClaimEvent has drop, store {
        user: address,
        rewards: u64,
        block_height: u64,
        timestamp: u64,
    }

    /// Initialize staking pool
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        if (!exists<StakingPool>(admin_addr)) {
            move_to(admin, StakingPool {
                total_staked: 0,
                total_rewards_distributed: 0,
                total_stakers: 0,
                is_active: true,
            });
        };
    }

    /// Stake MORE tokens (flexible - no lock period)
    public entry fun stake(
        user: &signer,
        amount: u64,
        pool_addr: address
    ) acquires UserStake, StakingPool {
        let user_addr = signer::address_of(user);
        
        let current_block = block::get_current_block_height();
        
        // If user already has stake, claim pending rewards first
        if (exists<UserStake>(user_addr)) {
            let user_stake = borrow_global_mut<UserStake>(user_addr);
            
            // Calculate and auto-claim pending rewards if threshold met
            let pending = calculate_pending_rewards(user_stake);
            if (pending >= MIN_CLAIM_AMOUNT) {
                user_stake.total_rewards_claimed = user_stake.total_rewards_claimed + pending;
                user_stake.last_claim_block = current_block;
                
                // Update pool
                let pool = borrow_global_mut<StakingPool>(pool_addr);
                pool.total_rewards_distributed = pool.total_rewards_distributed + pending;
                
                // Transfer MORE rewards to user (mint new tokens as rewards)
                more_token_v3::mint(user, user_addr, pending);
            };
            
            // Add to existing stake
            user_stake.amount = user_stake.amount + amount;
            user_stake.start_block = current_block;
            user_stake.last_claim_block = current_block;
        } else {
            // Create new stake
            move_to(user, UserStake {
                amount,
                start_block: current_block,
                last_claim_block: current_block,
                total_rewards_claimed: 0,
            });
            
            // Increment staker count
            let pool = borrow_global_mut<StakingPool>(pool_addr);
            pool.total_stakers = pool.total_stakers + 1;
        };

        // Update pool total staked
        let pool = borrow_global_mut<StakingPool>(pool_addr);
        pool.total_staked = pool.total_staked + amount;

        // Transfer MORE tokens from user to staking pool
        // Note: For simplicity, we burn tokens from user on stake and mint on unstake
        // In production, could use a proper escrow pattern
        // For now, just track the staked amount

        // Emit event
        event::emit(StakeEvent {
            user: user_addr,
            amount,
            block_height: current_block,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Calculate pending rewards based on blocks elapsed
    public fun calculate_pending_rewards(user_stake: &UserStake): u64 {
        let current_block = block::get_current_block_height();
        let blocks_elapsed = current_block - user_stake.last_claim_block;
        
        // Calculate rewards: staked_amount × blocks_elapsed × reward_per_block
        // Formula: (amount × blocks × REWARD_PER_BLOCK_PER_TOKEN) / 100000000
        let rewards = (user_stake.amount * blocks_elapsed * REWARD_PER_BLOCK_PER_TOKEN) / 100000000;
        rewards
    }

    /// Claim staking rewards (only if above minimum threshold)
    public entry fun claim_rewards(user: &signer, pool_addr: address) acquires UserStake, StakingPool {
        let user_addr = signer::address_of(user);
        assert!(exists<UserStake>(user_addr), E_NO_STAKE);

        let user_stake = borrow_global_mut<UserStake>(user_addr);
        let current_block = block::get_current_block_height();
        
        // Calculate pending rewards
        let pending_rewards = calculate_pending_rewards(user_stake);
        
        // Check if rewards meet minimum claim threshold
        assert!(pending_rewards >= MIN_CLAIM_AMOUNT, E_INSUFFICIENT_REWARDS);

        // Update user state
        user_stake.total_rewards_claimed = user_stake.total_rewards_claimed + pending_rewards;
        user_stake.last_claim_block = current_block;

        // Update pool
        let pool = borrow_global_mut<StakingPool>(pool_addr);
        pool.total_rewards_distributed = pool.total_rewards_distributed + pending_rewards;

        // Transfer MORE rewards to user (mint new tokens as rewards)
        more_token_v3::mint(user, user_addr, pending_rewards);

        // Emit event
        event::emit(ClaimEvent {
            user: user_addr,
            rewards: pending_rewards,
            block_height: current_block,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Unstake tokens (flexible - anytime withdrawal)
    public entry fun unstake(user: &signer, amount: u64, pool_addr: address) acquires UserStake, StakingPool {
        let user_addr = signer::address_of(user);
        assert!(exists<UserStake>(user_addr), E_NO_STAKE);

        let user_stake = borrow_global_mut<UserStake>(user_addr);
        assert!(user_stake.amount >= amount, E_INSUFFICIENT_BALANCE);

        let current_block = block::get_current_block_height();
        
        // Calculate and auto-claim pending rewards
        let pending_rewards = calculate_pending_rewards(user_stake);
        
        // Update user stake
        user_stake.amount = user_stake.amount - amount;
        user_stake.last_claim_block = current_block;
        
        // Update pool
        let pool = borrow_global_mut<StakingPool>(pool_addr);
        pool.total_staked = pool.total_staked - amount;
        
        // If claiming rewards above threshold, add to claimed total
        if (pending_rewards >= MIN_CLAIM_AMOUNT) {
            user_stake.total_rewards_claimed = user_stake.total_rewards_claimed + pending_rewards;
            pool.total_rewards_distributed = pool.total_rewards_distributed + pending_rewards;
            
            // Transfer rewards to user (mint new tokens as rewards)
            more_token_v3::mint(user, user_addr, pending_rewards);
        };

        // Transfer staked amount back to user
        // Note: In production, use a resource account or capability pattern
        // For MVP, we mint back to user (equivalent to unstaking)
        more_token_v3::mint(user, user_addr, amount);

        // Emit event
        event::emit(UnstakeEvent {
            user: user_addr,
            amount,
            rewards: pending_rewards,
            block_height: current_block,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// View function: Get user stake info
    #[view]
    public fun get_user_stake(user_addr: address): (u64, u64, u64, bool) acquires UserStake {
        if (!exists<UserStake>(user_addr)) {
            return (0, 0, 0, false)
        };
        let user_stake = borrow_global<UserStake>(user_addr);
        let pending_rewards = calculate_pending_rewards(user_stake);
        let is_claimable = pending_rewards >= MIN_CLAIM_AMOUNT;
        
        (
            user_stake.amount,                  // Total staked
            pending_rewards,                    // Pending rewards
            user_stake.total_rewards_claimed,   // Total claimed
            is_claimable                        // Can claim now?
        )
    }

    /// View function: Get pending rewards
    #[view]
    public fun get_pending_rewards(user_addr: address): u64 acquires UserStake {
        if (!exists<UserStake>(user_addr)) {
            return 0
        };
        let user_stake = borrow_global<UserStake>(user_addr);
        calculate_pending_rewards(user_stake)
    }

    /// View function: Get staking pool info
    #[view]
    public fun get_staking_pool(admin_addr: address): (u64, u64, u64) acquires StakingPool {
        if (!exists<StakingPool>(admin_addr)) {
            return (0, 0, 0)
        };
        let pool = borrow_global<StakingPool>(admin_addr);
        (
            pool.total_staked,
            pool.total_rewards_distributed,
            pool.total_stakers
        )
    }
}
