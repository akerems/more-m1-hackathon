/// MORE Token - The native token of Movement On-chain Reserve Experiment
/// A fungible asset implementation using Move 2.0 features
module more_v3::more_token_v3 {
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use std::option;
    use std::signer;
    use std::string::utf8;

    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;

    /// Token configuration
    const TOKEN_NAME: vector<u8> = b"MORE Token";
    const TOKEN_SYMBOL: vector<u8> = b"MORE";
    const TOKEN_DECIMALS: u8 = 8;
    const TOKEN_ICON_URI: vector<u8> = b"https://more.movement/icon.png";
    const TOKEN_PROJECT_URI: vector<u8> = b"https://more.movement";

    /// Store for token references
    struct TokenRefs has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        burn_ref: BurnRef,
    }

    /// Initialize the MORE token
    /// Only callable once by the module publisher
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<TokenRefs>(admin_addr), E_ALREADY_INITIALIZED);

        // Create the fungible asset
        let constructor_ref = &object::create_named_object(admin, TOKEN_NAME);
        
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            option::none(),
            utf8(TOKEN_NAME),
            utf8(TOKEN_SYMBOL),
            TOKEN_DECIMALS,
            utf8(TOKEN_ICON_URI),
            utf8(TOKEN_PROJECT_URI),
        );

        // Generate and store refs
        let mint_ref = fungible_asset::generate_mint_ref(constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(constructor_ref);

        move_to(admin, TokenRefs {
            mint_ref,
            transfer_ref,
            burn_ref,
        });
    }

    /// Mint MORE tokens (only callable by authorized contracts)
    public fun mint(admin: &signer, to: address, amount: u64) acquires TokenRefs {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenRefs>(admin_addr), E_NOT_AUTHORIZED);
        
        let token_refs = borrow_global<TokenRefs>(admin_addr);
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(to, get_metadata(admin_addr));
        let fa = fungible_asset::mint(&token_refs.mint_ref, amount);
        fungible_asset::deposit_with_ref(&token_refs.transfer_ref, to_wallet, fa);
    }

    /// Burn MORE tokens (for buyback & bury)
    public fun burn(admin: &signer, from: address, amount: u64) acquires TokenRefs {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenRefs>(admin_addr), E_NOT_AUTHORIZED);
        
        let token_refs = borrow_global<TokenRefs>(admin_addr);
        let from_wallet = primary_fungible_store::ensure_primary_store_exists(from, get_metadata(admin_addr));
        fungible_asset::burn_from(&token_refs.burn_ref, from_wallet, amount);
    }

    /// Get token metadata
    public fun get_metadata(admin_addr: address): Object<Metadata> {
        let metadata_address = object::create_object_address(&admin_addr, TOKEN_NAME);
        object::address_to_object<Metadata>(metadata_address)
    }

    /// Get balance of an account
    #[view]
    public fun balance_of(account: address, admin_addr: address): u64 {
        let metadata = get_metadata(admin_addr);
        primary_fungible_store::balance(account, metadata)
    }

    /// Test faucet - mint MORE tokens for testing (testnet only)
    /// Anyone can call this to get test tokens
    public entry fun test_faucet(user: &signer, admin_addr: address) acquires TokenRefs {
        let user_addr = signer::address_of(user);
        let amount = 10000_00000000; // 10,000 MORE tokens
        
        assert!(exists<TokenRefs>(admin_addr), E_NOT_AUTHORIZED);
        let token_refs = borrow_global<TokenRefs>(admin_addr);
        let to_wallet = primary_fungible_store::ensure_primary_store_exists(user_addr, get_metadata(admin_addr));
        let fa = fungible_asset::mint(&token_refs.mint_ref, amount);
        fungible_asset::deposit_with_ref(&token_refs.transfer_ref, to_wallet, fa);
    }
}

