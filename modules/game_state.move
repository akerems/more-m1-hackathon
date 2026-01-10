/// Game State - Core game board and miner state management
/// Implements the 5×5 mining grid with Move 2.0 features
module more_v3::game_state_v3 {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::block;
    use aptos_framework::event;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use aptos_framework::resource_account;

    /// Errors
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_BLOCK: u64 = 3;
    const E_GAME_NOT_ACTIVE: u64 = 4;
    const E_INSUFFICIENT_BALANCE: u64 = 5;

    /// Constants
    const GRID_SIZE: u64 = 25; // 5×5 grid
    const BLOCKS_PER_ROUND: u64 = 25;
    const MIN_DEPLOYMENT: u64 = 1_00000000; // 1 MOVE (8 decimals)

    /// Block state in the mining grid
    struct Block has store, copy, drop {
        total_deployed: u64,        // Total MOVE deployed to this block
        miner_count: u64,           // Number of unique miners
        is_winning: bool,           // Whether this block won in current round
        last_update: u64,           // Last update timestamp
    }

    /// Individual miner state
    struct Miner has key {
        total_deployed: u64,        // Total MOVE deployed across all blocks
        blocks_deployed: vector<u64>, // Block indices where miner has deployment
        deployment_amounts: vector<u64>, // Amount deployed in each block
        more_earned: u64,           // Total MORE tokens earned
        rounds_won: u64,            // Number of rounds won
        last_claim: u64,            // Last claim timestamp
    }

    /// Global game board state
    struct GameBoard has key {
        round: u64,                 // Current round number
        blocks: vector<Block>,      // 25 blocks in the grid
        total_deployed: u64,        // Total MOVE deployed in current round
        motherlode_more: u64,       // MORE tokens in Motherlode jackpot
        protocol_fees_move: u64,    // Collected MOVE fees for buyback
        protocol_fees_more: u64,    // Collected MORE fees
        round_start: u64,           // Round start timestamp
        round_duration: u64,        // Round duration in seconds
        is_active: bool,            // Whether game is active
        admin: address,             // Admin address
        vault_address: address,     // Vault address for holding MOVE tokens
    }
    
    /// Resource account capability for vault
    struct VaultCapability has key {
        signer_cap: account::SignerCapability,
    }

    /// Events
    #[event]
    struct DeploymentEvent has drop, store {
        miner: address,
        blocks: vector<u64>,
        amount_per_block: u64,
        total_amount: u64,
        round: u64,
        timestamp: u64,
    }

    #[event]
    struct RoundEndEvent has drop, store {
        round: u64,
        total_deployed: u64,
        vaulted: u64,               // Amount sent to vault (10%)
        winnings: u64,              // Amount for winners (85%)
        motherlode_contribution: u64, // Amount to motherlode (5%)
        timestamp: u64,
    }

    /// Initialize the game board with vault
    public entry fun initialize(admin: &signer, round_duration: u64) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<GameBoard>(admin_addr), E_ALREADY_INITIALIZED);

        // Create resource account for vault
        let (vault_signer, signer_cap) = account::create_resource_account(admin, b"MORE_VAULT_v2");
        let vault_addr = signer::address_of(&vault_signer);
        
        // Register vault for AptosCoin
        coin::register<AptosCoin>(&vault_signer);
        
        // Store vault capability
        move_to(admin, VaultCapability {
            signer_cap,
        });

        // Initialize 25 empty blocks
        let blocks = vector::empty<Block>();
        let i = 0;
        while (i < GRID_SIZE) {
            vector::push_back(&mut blocks, Block {
                total_deployed: 0,
                miner_count: 0,
                is_winning: false,
                last_update: timestamp::now_seconds(),
            });
            i = i + 1;
        };

        move_to(admin, GameBoard {
            round: 1,
            blocks,
            total_deployed: 0,
            motherlode_more: 0,
            protocol_fees_move: 0,
            protocol_fees_more: 0,
            round_start: timestamp::now_seconds(),
            round_duration,
            is_active: true,
            admin: admin_addr,
            vault_address: vault_addr,
        });
    }

    /// Initialize miner state
    public entry fun initialize_miner(miner: &signer) {
        let miner_addr = signer::address_of(miner);
        if (!exists<Miner>(miner_addr)) {
            move_to(miner, Miner {
                total_deployed: 0,
                blocks_deployed: vector::empty<u64>(),
                deployment_amounts: vector::empty<u64>(),
                more_earned: 0,
                rounds_won: 0,
                last_claim: timestamp::now_seconds(),
            });
        };
    }

    /// Check and auto-reset round if time is up
    fun check_and_reset_round_if_needed(game_board: &mut GameBoard) {
        let now = timestamp::now_seconds();
        let round_end = game_board.round_start + game_board.round_duration;
        
        // If round time is up, automatically start new round
        if (now >= round_end && game_board.total_deployed > 0) {
            // Reset for new round
            game_board.round = game_board.round + 1;
            game_board.total_deployed = 0;
            game_board.round_start = now;
            
            // Reset all blocks
            let i = 0;
            while (i < GRID_SIZE) {
                let block = vector::borrow_mut(&mut game_board.blocks, i);
                block.total_deployed = 0;
                block.miner_count = 0;
                block.is_winning = false;
                i = i + 1;
            };
            
            // Emit round end event
            event::emit(RoundEndEvent {
                round: game_board.round - 1,
                total_deployed: 0,
                vaulted: 0,
                winnings: 0,
                motherlode_contribution: 0,
                timestamp: now,
            });
        };
    }

    /// Deploy MOVE to selected blocks
    public entry fun deploy(
        miner: &signer,
        admin_addr: address,
        block_indices: vector<u64>,
        amount_per_block: u64
    ) acquires GameBoard, Miner {
        let miner_addr = signer::address_of(miner);
        
        // Ensure miner is initialized
        if (!exists<Miner>(miner_addr)) {
            move_to(miner, Miner {
                total_deployed: 0,
                blocks_deployed: vector::empty<u64>(),
                deployment_amounts: vector::empty<u64>(),
                more_earned: 0,
                rounds_won: 0,
                last_claim: timestamp::now_seconds(),
            });
        };

        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global_mut<GameBoard>(admin_addr);
        
        // Auto-reset round if time is up
        check_and_reset_round_if_needed(game_board);
        
        assert!(game_board.is_active, E_GAME_NOT_ACTIVE);
        assert!(amount_per_block >= MIN_DEPLOYMENT, E_INSUFFICIENT_BALANCE);

        // Validate block indices
        let num_blocks = vector::length(&block_indices);
        let i = 0;
        while (i < num_blocks) {
            let block_idx = *vector::borrow(&block_indices, i);
            assert!(block_idx < GRID_SIZE, E_INVALID_BLOCK);
            i = i + 1;
        };

        // Update blocks
        let total_amount = amount_per_block * num_blocks;
        i = 0;
        while (i < num_blocks) {
            let block_idx = *vector::borrow(&block_indices, i);
            let block = vector::borrow_mut(&mut game_board.blocks, block_idx);
            block.total_deployed = block.total_deployed + amount_per_block;
            block.miner_count = block.miner_count + 1;
            block.last_update = timestamp::now_seconds();
            i = i + 1;
        };

        // Update miner state
        let miner_state = borrow_global_mut<Miner>(miner_addr);
        miner_state.total_deployed = miner_state.total_deployed + total_amount;
        vector::append(&mut miner_state.blocks_deployed, block_indices);
        
        let j = 0;
        while (j < num_blocks) {
            vector::push_back(&mut miner_state.deployment_amounts, amount_per_block);
            j = j + 1;
        };

        // Update game board
        game_board.total_deployed = game_board.total_deployed + total_amount;
        
        // Transfer MOVE tokens from miner to vault (not admin!)
        let vault_addr = game_board.vault_address;
        coin::transfer<AptosCoin>(miner, vault_addr, total_amount);

        // Emit event
        event::emit(DeploymentEvent {
            miner: miner_addr,
            blocks: block_indices,
            amount_per_block,
            total_amount,
            round: game_board.round,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// View function: Get block state
    #[view]
    public fun get_block(admin_addr: address, block_idx: u64): (u64, u64, bool) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        let block = vector::borrow(&game_board.blocks, block_idx);
        (block.total_deployed, block.miner_count, block.is_winning)
    }

    /// View function: Get game state
    #[view]
    public fun get_game_state(admin_addr: address): (u64, u64, u64, bool) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        (
            game_board.round,
            game_board.total_deployed,
            game_board.motherlode_more,
            game_board.is_active
        )
    }
    
    /// View function: Get vault address
    #[view]
    public fun get_vault_address(admin_addr: address): address acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        game_board.vault_address
    }
    
    /// View function: Get all blocks at once (for frontend grid)
    #[view]
    public fun get_all_blocks(admin_addr: address): (vector<u64>, vector<u64>, vector<bool>) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        
        let deployed_amounts = vector::empty<u64>();
        let miner_counts = vector::empty<u64>();
        let is_winnings = vector::empty<bool>();
        
        let i = 0;
        while (i < GRID_SIZE) {
            let block = vector::borrow(&game_board.blocks, i);
            vector::push_back(&mut deployed_amounts, block.total_deployed);
            vector::push_back(&mut miner_counts, block.miner_count);
            vector::push_back(&mut is_winnings, block.is_winning);
            i = i + 1;
        };
        
        (deployed_amounts, miner_counts, is_winnings)
    }
    
    /// Transfer MOVE from vault to an address (only callable by game modules)
    public fun transfer_from_vault(admin_addr: address, to: address, amount: u64) acquires VaultCapability {
        assert!(exists<VaultCapability>(admin_addr), E_NOT_INITIALIZED);
        let vault_cap = borrow_global<VaultCapability>(admin_addr);
        let vault_signer = account::create_signer_with_capability(&vault_cap.signer_cap);
        coin::transfer<AptosCoin>(&vault_signer, to, amount);
    }
    
    /// Update motherlode and protocol fees (only callable by motherlode module)
    public fun update_fees(admin_addr: address, motherlode_more_add: u64, protocol_fees_move_add: u64) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global_mut<GameBoard>(admin_addr);
        game_board.motherlode_more = game_board.motherlode_more + motherlode_more_add;
        game_board.protocol_fees_move = game_board.protocol_fees_move + protocol_fees_move_add;
    }

    /// View function: Get protocol fees collected
    #[view]
    public fun get_protocol_fees(admin_addr: address): (u64, u64) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        (game_board.protocol_fees_move, game_board.protocol_fees_more)
    }

    /// View function: Get miner state
    #[view]
    public fun get_miner_state(miner_addr: address): (u64, u64, u64, u64) acquires Miner {
        if (!exists<Miner>(miner_addr)) {
            return (0, 0, 0, 0)
        };
        let miner = borrow_global<Miner>(miner_addr);
        (
            miner.total_deployed,
            miner.more_earned,
            miner.rounds_won,
            vector::length(&miner.blocks_deployed)
        )
    }

    /// View function: Get round timing info
    #[view]
    public fun get_round_info(admin_addr: address): (u64, u64) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        (game_board.round_start, game_board.round_duration)
    }

    /// View function: Get round status with countdown (for frontend)
    #[view]
    public fun get_round_status(admin_addr: address): (u64, u64, u64, u64, bool) acquires GameBoard {
        assert!(exists<GameBoard>(admin_addr), E_NOT_INITIALIZED);
        let game_board = borrow_global<GameBoard>(admin_addr);
        
        let now = timestamp::now_seconds();
        let round_end = game_board.round_start + game_board.round_duration;
        let time_remaining = if (now >= round_end) { 0 } else { round_end - now };
        let is_round_ended = now >= round_end;
        
        (
            game_board.round,           // Current round number
            game_board.round_start,     // Round start timestamp
            round_end,                  // Round end timestamp
            time_remaining,             // Seconds remaining (0 if ended)
            is_round_ended              // true if round should end
        )
    }
}

