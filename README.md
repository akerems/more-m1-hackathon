# MORE Frontend

Movement On-chain Reserve Experiment - A fair-launch mining game on Movement Network.

## Features

- 🎮 **5×5 Grid Mining**: Deploy MOVE tokens on a competitive square grid
- 💎 **Dual Motherlode**: Win both MORE tokens and MOVE in jackpots
- ⚡ **Real-time UI**: Live countdown, block selection, and stats
- 🎨 **Modern Design**: Movement-inspired dark-yellow theme
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 📄 **Complete Pages**: Mine, Stake, Community, Discover, and About
- 👛 **Dual Wallet System**: Privy social login + Native Aptos wallets (Nightly, Martian, etc.)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Privy App ID (get from [console.privy.io](https://console.privy.io/))
  - **Note**: You only need the App ID - no custom chain configuration required!

### Installation

```bash
# Install dependencies
npm install

# Create environment file and add your Privy App ID
echo "NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

**📖 See [SETUP_UPDATED.md](./SETUP_UPDATED.md) for the complete setup guide.**

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
more-frontend/
├── app/
│   ├── page.tsx                # Main game/mine page
│   ├── about/page.tsx          # About page
│   ├── stake/page.tsx          # Staking page
│   ├── community/page.tsx      # Community links
│   ├── discover/page.tsx       # Stats & leaderboard
│   ├── providers.tsx           # App providers (Privy + Wallets)
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── WalletButton.tsx        # Wallet connection UI with dropdown
│   ├── WalletSelectionModal.tsx # Dual wallet selection modal
│   ├── WalletProvider.tsx      # Aptos wallet adapter provider
│   ├── MiningGrid.tsx          # 5×5 game grid
│   ├── GridBlock.tsx           # Square grid block
│   ├── MotherlodeDisplay.tsx   # Jackpot display
│   └── DeployPanel.tsx         # Deploy controls
├── lib/
│   ├── aptos.ts                # Aptos SDK config & Movement network
│   ├── privy-movement.ts       # Movement wallet utilities
│   └── transactions.ts         # Transaction submission helpers
├── hooks/
│   └── useBalance.ts           # Hook for fetching MOVE balance
└── public/                     # Static assets
```

## Key Components

### MiningGrid
Displays the 5×5 grid of blocks. Users can select blocks to deploy MOVE tokens.

### MotherlodeDisplay
Shows the dual jackpot pools (MORE + MOVE) and countdown timer.

### DeployPanel
Controls for deployment amount, block selection, and transaction submission.

## Customization

### Colors
The theme uses Movement-inspired dark-yellow palette. Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: "#FDB71A",    // Movement yellow
    hover: "#e5a617",
  },
  accent: {
    yellow: "#FDB71A",     // Main brand color
    orange: "#ff8c00",
    gold: "#ffd700",
    darkYellow: "#e5a617",
  },
}
```

### Constants
Game constants can be adjusted in the component files or centralized in a `constants.ts` file.

## Wallet Integration

This app uses a **dual-wallet system** based on production-ready patterns:

### Wallet Options

#### 🔐 Privy Social Login
- Email, Twitter, Google, GitHub, Discord
- Automatic Movement wallet creation
- No extension needed
- Perfect for new users

#### 💼 Native Aptos Wallets
- Nightly (recommended)
- Martian
- Other Aptos-compatible wallets
- Direct blockchain access
- For advanced users

### Features
- ✅ Dual wallet support (Privy + Native)
- ✅ Movement Testnet (Chain ID: 250) auto-configured
- ✅ Wallet dropdown with copy, explorer, faucet links
- ✅ Real-time MOVE balance fetching
- ✅ Transaction signing for both wallet types
- ✅ Toast notifications (Sonner)

### Quick Start
1. Get your Privy App ID from [console.privy.io](https://console.privy.io/)
2. Add to `.env.local`: `NEXT_PUBLIC_PRIVY_APP_ID=your_app_id`
3. Run `npm run dev` and click "Connect Wallet"
4. Choose Privy or Native wallet

**📖 Complete Guide**: [WALLET_INTEGRATION.md](./WALLET_INTEGRATION.md)  
**📘 Setup**: [SETUP_UPDATED.md](./SETUP_UPDATED.md)  
**🔄 Migration**: [MIGRATION.md](./MIGRATION.md)

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Privy**: Social login & embedded wallets
- **Aptos SDK**: Movement Network blockchain interactions
- **Aptos Wallet Adapter**: Native wallet integration
- **Sonner**: Toast notifications

## License

MIT

