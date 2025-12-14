"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WalletProvider } from "@/components/WalletProvider";
import { AutoWalletCreator } from "@/components/AutoWalletCreator";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    console.error(
      "Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable. Please add it to your .env.local file."
    );
  }

  return (
    <WalletProvider>
      <PrivyProvider
        appId={appId || ""}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#FDB71A",
            logo: undefined,
          },
          // Login methods - email and social logins enabled
          loginMethods: ['email', 'google', 'twitter', 'discord', 'github'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <AutoWalletCreator />
        <Toaster position="top-right" />
        {children}
      </PrivyProvider>
    </WalletProvider>
  );
}

