/// Motherlode - Single jackpot system (MORE only)
/// Handles round completion, winner selection, and rewards distribution
/// Normal grid wins pay MOVE, Motherlode wins pay MORE
/// Protocol fees fund continuous buyback & burn of MORE
module more_v3::motherlode_v3 {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::randomness;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use more_v3::game_state_v3;

    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_ROUND_NOT_ENDED: u64 = 2;
    const E_NO_DEPLOYMENTS: u64 = 3;
    const E_GAME_NOT_ACTIVE: u64 = 4;

    /// Round reward distribution
    const WINNERS_PERCENTAGE: u64 = 85;     // 85% to winners
    const VAULT_PERCENTAGE: u64 = 10;       // 10% to vault (protocol fees for buyback)
    const MOTHERLODE_PERCENTAGE: u64 = 5;   // 5% to motherlode jackpot
    
    /// Motherlode payout distribution (when triggered)
    const MOTHERLODE_WINNER: u64 = 70;      // 70% to winner
    const MOTHERLODE_ROLLOVER: u64 = 30;    // 30% stays for next

    /// Buyback distribution of MORE purchased
    const BURN_PERCENTAGE: u64 = 70;        // 70% burned forever
    const MOTHERLODE_FROM_BUYBACK: u64 = 20; // 20% to motherlode
    const TREASURY_PERCENTAGE: u64 = 10;    // 10% to treasury

    /// Single round result
    struct RoundResult has store, drop, copy {
        round: u64,
        winning_blocks: vector<u64>,     // Blocks that won this round
        winners: vector<address>,        // Miners who won
        total_deployed: u64,             // Total MOVE deployed
        vaulted: u64,                    // Amount sent to vault (10%)
        winnings: u64,                   // Amount distributed to winners (85%)
        motherlode_contribution: u64,    // Amount added to motherlode (5%)
        was_motherlode_round: bool,      // Whether motherlode was triggered
        motherlode_payout: u64,          // Motherlode payout if triggered
        timestamp: u64,
    }

    /// Round history storage
    struct RoundHistory has key {
        results: vector<RoundResult>,    // All round results
        current_round: u64,              // Current round number
    }

    /// Events
    #[event]
    struct RoundCompleteEvent has drop, store {
        round: u64,
        winning_blocks: vector<u64>,
        total_deployed: u64,
        vaulted: u64,
        winnings: u64,
        motherlode_contribution: u64,
        timestamp: u64,
    }

    #[event]
    struct MotherlodeWinEvent has drop, store {
        round: u64,
        winner_block: u64,
        winners_count: u64,
        more_payout: u64,
        timestamp: u64,
    }

    #[event]
    struct BuybackEvent has drop, store {
        move_spent: u64,
        more_bought: u64,
        more_burned: u64,
        to_motherlode: u64,
        to_treasury: u64,
        timestamp: u64,
    }

    /// Initialize round history
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        if (!exists<RoundHistory>(admin_addr)) {
            move_to(admin, RoundHistory {
                results: vector::empty<RoundResult>(),
                current_round: 0,
            });
        };
    }

    /// Complete round and distribute rewards (ADMIN ONLY)
    /// Uses VRF for randomness in winner selection
    #[randomness]
    #[lint::allow_unsafe_randomness]
    entry fun complete_round(admin: &signer, admin_addr: address) acquires RoundHistory {
        // Admin check - CRITICAL SECURITY
        let admin_signer = signer::address_of(admin);
        assert!(admin_signer == admin_addr, E_NOT_AUTHORIZED);
        
        // RoundHistory must be initialized
        assert!(exists<RoundHistory>(admin_addr), E_NOT_AUTHORIZED);
        
        // Get game state
        let (round, total_deployed, motherlode_more, is_active) = 
            game_state_v3::get_game_state(admin_addr);
        
        assert!(is_active, E_GAME_NOT_ACTIVE);
        assert!(total_deployed > 0, E_NO_DEPLOYMENTS);
        
        // Check if round duration has passed
        let (round_start, round_duration) = game_state_v3::get_round_info(admin_addr);
        let now = timestamp::now_seconds();
        let round_end = round_start + round_duration;
        assert!(now >= round_end, E_ROUND_NOT_ENDED);

        // Calculate reward distribution
        let winnings = (total_deployed * WINNERS_PERCENTAGE) / 100;      // 85%
        let vaulted = (total_deployed * VAULT_PERCENTAGE) / 100;         // 10%
        let motherlode_contribution = (total_deployed * MOTHERLODE_PERCENTAGE) / 100; // 5%

        // Select winning blocks (5 random blocks)
        let winning_blocks = vector::empty<u64>();
        let i = 0;
        while (i < 5) {
            let random_block = randomness::u64_range(0, 25);
            if (!vector::contains(&winning_blocks, &random_block)) {
                vector::push_back(&mut winning_blocks, random_block);
            } else {
                continue // Skip if duplicate
            };
            i = i + 1;
        };

        // 1. Update protocol fees (vaulted amount stays in vault)
        // 2. Update motherlode pool (contribution stays as record, not actual MORE yet)
        game_state_v3::update_fees(admin_addr, motherlode_contribution, vaulted);
        
        // 3. Distribute winnings to admin (simplified - admin can redistribute manually)
        // In production, this should go to winning miners proportionally
        // For now: Transfer to admin to enable manual distribution testing
        game_state_v3::transfer_from_vault(admin_addr, admin_addr, winnings);

        // Check if Motherlode should trigger (1 in 625 chance using VRF)
        let motherlode_roll = randomness::u64_range(0, 625);
        let was_motherlode_round = (motherlode_roll == 0); // 1/625 chance
        let motherlode_payout = 0;

        if (was_motherlode_round) {
            // Payout 70% of motherlode (MORE only), keep 30% for next
            let more_payout = (motherlode_more * MOTHERLODE_WINNER) / 100;
            motherlode_payout = more_payout;

            // Select winner from a random winning block
            let winner_block = *vector::borrow(&winning_blocks, 0);
            let (_, miner_count, _) = game_state_v3::get_block(admin_addr, winner_block);

            // Transfer MORE motherlode to admin (simplified)
            // In production: Transfer to actual winner(s)
            // For now: Admin gets it for testing/manual distribution
            // Note: This requires MORE tokens to be minted first
            // use more_v3::more_token_v3;
            // more_token_v3::mint(admin, admin_addr, more_payout);

            event::emit(MotherlodeWinEvent {
                round,
                winner_block,
                winners_count: miner_count,
                more_payout,
                timestamp: timestamp::now_seconds(),
            });
        };

        // Emit round complete event
        event::emit(RoundCompleteEvent {
            round,
            winning_blocks: copy winning_blocks,
            total_deployed,
            vaulted,
            winnings,
            motherlode_contribution,
            timestamp: timestamp::now_seconds(),
        });

        // Store round result in history
        let history = borrow_global_mut<RoundHistory>(admin_addr);
        vector::push_back(&mut history.results, RoundResult {
            round,
            winning_blocks,
            winners: vector::empty<address>(),
            total_deployed,
            vaulted,
            winnings,
            motherlode_contribution,
            was_motherlode_round,
            motherlode_payout,
            timestamp: timestamp::now_seconds(),
        });
        history.current_round = round;
    }

    /// Claim round rewards
    public entry fun claim_rewards(miner: &signer, admin_addr: address, round: u64) acquires RoundHistory {
        let miner_addr = signer::address_of(miner);
        
        // Get round result
        assert!(exists<RoundHistory>(admin_addr), E_NOT_AUTHORIZED);
        let history = borrow_global<RoundHistory>(admin_addr);
        let len = vector::length(&history.results);
        
        // Find the round
        let i = 0;
        let found = false;
        let result: &RoundResult;
        while (i < len) {
            let r = vector::borrow(&history.results, i);
            if (r.round == round) {
                result = r;
                found = true;
                break
            };
            i = i + 1;
        };
        
        assert!(found, E_NO_DEPLOYMENTS);
        
        // TODO: Check if miner deployed to any winning blocks
        // TODO: Calculate proportional share based on deployment amount
        // TODO: Transfer rewards (MOVE for normal rounds)
        // TODO: Mark as claimed to prevent double-claiming
        
        // For MVP: Basic implementation would go here
        // Requires tracking miner deployments per block per round
    }

    /// Claim motherlode jackpot
    public entry fun claim_motherlode(miner: &signer, admin_addr: address, round: u64) acquires RoundHistory {
        let miner_addr = signer::address_of(miner);
        
        // Get round result
        assert!(exists<RoundHistory>(admin_addr), E_NOT_AUTHORIZED);
        let history = borrow_global<RoundHistory>(admin_addr);
        let len = vector::length(&history.results);
        
        // Find the round
        let i = 0;
        let found = false;
        let result: &RoundResult;
        while (i < len) {
            let r = vector::borrow(&history.results, i);
            if (r.round == round && r.was_motherlode_round) {
                result = r;
                found = true;
                break
            };
            i = i + 1;
        };
        
        assert!(found, E_NO_DEPLOYMENTS);
        
        // TODO: Verify miner was in winning block during motherlode round
        // TODO: Calculate share of jackpot based on deployment in winning block
        // TODO: Transfer MORE tokens as motherlode payout
        // TODO: Mark as claimed to prevent double-claiming
        
        // For MVP: Basic implementation would go here
        // Requires tracking miner deployments per block per round
    }

    /// Execute buyback & bury of MORE tokens
    /// Uses collected vault fees (MOVE) to buy MORE from market and burn/distribute
    public entry fun execute_buyback(
        admin: &signer,
        admin_addr: address,
        move_amount: u64,
        min_more_out: u64
    ) {
        let admin_signer = signer::address_of(admin);
        assert!(admin_signer == admin_addr, E_NOT_AUTHORIZED);

        // TODO: Implement buyback logic
        // 1. Use MOVE to buy MORE from DEX (with slippage protection)
        let more_bought = min_more_out; // Placeholder - actual DEX integration needed
        
        // 2. Distribute bought MORE:
        let burned = (more_bought * BURN_PERCENTAGE) / 100;           // 70% burn
        let to_motherlode = (more_bought * MOTHERLODE_FROM_BUYBACK) / 100; // 20% motherlode
        let to_treasury = (more_bought * TREASURY_PERCENTAGE) / 100;  // 10% treasury

        // TODO: Execute burn (send to 0x0 or burn function)
        // TODO: Add to motherlode pool
        // TODO: Add to treasury

        event::emit(BuybackEvent {
            move_spent: move_amount,
            more_bought,
            more_burned: burned,
            to_motherlode,
            to_treasury,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// View function: Get latest round result
    #[view]
    public fun get_round_result(admin_addr: address): (u64, u64, u64, u64, bool, u64) acquires RoundHistory {
        if (!exists<RoundHistory>(admin_addr)) {
            return (0, 0, 0, 0, false, 0)
        };
        let history = borrow_global<RoundHistory>(admin_addr);
        let len = vector::length(&history.results);
        if (len == 0) {
            return (0, 0, 0, 0, false, 0)
        };
        let result = vector::borrow(&history.results, len - 1);
        (
            result.total_deployed,
            result.vaulted,
            result.winnings,
            result.motherlode_contribution,
            result.was_motherlode_round,
            result.motherlode_payout
        )
    }

    /// View function: Get specific round result
    #[view]
    public fun get_round_result_by_number(admin_addr: address, round: u64): (u64, u64, u64, u64, bool, u64) acquires RoundHistory {
        if (!exists<RoundHistory>(admin_addr)) {
            return (0, 0, 0, 0, false, 0)
        };
        let history = borrow_global<RoundHistory>(admin_addr);
        let len = vector::length(&history.results);
        
        // Find the round
        let i = 0;
        while (i < len) {
            let result = vector::borrow(&history.results, i);
            if (result.round == round) {
                return (
                    result.total_deployed,
                    result.vaulted,
                    result.winnings,
                    result.motherlode_contribution,
                    result.was_motherlode_round,
                    result.motherlode_payout
                )
            };
            i = i + 1;
        };
        
        (0, 0, 0, 0, false, 0)
    }

    /// View function: Get total rounds completed
    #[view]
    public fun get_total_rounds(admin_addr: address): u64 acquires RoundHistory {
        if (!exists<RoundHistory>(admin_addr)) {
            return 0
        };
        let history = borrow_global<RoundHistory>(admin_addr);
        vector::length(&history.results)
    }

    /// View function: Get motherlode pool size (MORE only)
    #[view]
    public fun get_motherlode_pool(admin_addr: address): u64 {
        let (_, _, motherlode_more, _) = game_state_v3::get_game_state(admin_addr);
        motherlode_more
    }
}

