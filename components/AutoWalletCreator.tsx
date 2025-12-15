"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { createMovementWallet } from "@/lib/privy-movement";

/**
 * This component automatically creates a Movement wallet when a user
 * logs in via Privy social login but doesn't have a wallet yet
 */
export function AutoWalletCreator() {
  const { ready, authenticated, user } = usePrivy();
  const { createWallet } = useCreateWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    const autoCreateWallet = async () => {
      // Check if user is authenticated
      if (!ready || !authenticated || !user) {
        return;
      }

      // Check if we already attempted creation
      if (hasAttempted || isCreating) {
        return;
      }

      // Check if user already has a Movement wallet
      const movementWallet = user?.linkedAccounts?.find(
        (account: any) => account.type === 'wallet' && account.chainType === 'aptos'
      );

      if (movementWallet) {
        console.log('[AutoWalletCreator] User already has a Movement wallet');
        return;
      }

      // User is authenticated but has no wallet - create one automatically
      console.log('[AutoWalletCreator] Creating Movement wallet automatically...');
      
      try {
        setIsCreating(true);
        setHasAttempted(true);
        await createMovementWallet(user, createWallet);
        console.log('[AutoWalletCreator] ✅ Wallet created successfully!');
      } catch (error) {
        console.error('[AutoWalletCreator] ❌ Failed to create wallet:', error);
      } finally {
        setIsCreating(false);
      }
    };

    autoCreateWallet();
  }, [ready, authenticated, user, createWallet, hasAttempted, isCreating]);

  // This component doesn't render anything
  return null;
}


