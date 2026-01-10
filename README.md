# MORE - Decentralized Mining Game

![Movement Network](https://img.shields.io/badge/Movement-Network-FDB71A?style=for-the-badge)
![Move 2.0](https://img.shields.io/badge/Move-2.0-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Live on Testnet](https://img.shields.io/badge/Live-Testnet-green?style=for-the-badge)
> 
> **Experimental Hackathon Project:**
> - Built for Movement Network Hackathon - **some features incomplete due to time constraints**
> - Modules are **NOT audited**
> - Use only with **testnet tokens**
> - Do **NOT** use in production
> - No guarantees of security or correctness
> 
> **Testnet Limitations & Incomplete Features:**
> - Buyback & burn mechanism **not implemented** (requires DEX/token pool on testnet)
> - Auto-deploy feature **removed due to bugs** - could not be completed in hackathon timeline
> - Motherlode jackpot tracking exists but not active
> - Some features may be experimental or incomplete
> - Testnet may be reset periodically
>
> **What Works:** Manual deployment, grid competition, reward distribution, wallet integration

MORE is a live on-chain mining game built on Movement Network. Players compete on a 5x5 grid by deploying MOVE tokens to win rewards. The game combines strategic block selection with provably fair randomness to create an engaging competitive experience.

## Core Concept

Deploy MOVE tokens to blocks on a 5x5 grid (25 blocks total). At the end of each 60-second round, the smart contract determines winning blocks, and players who deployed to those blocks share the rewards proportionally.

### How It Works:

1. **Deploy to Blocks** → Choose 1-25 blocks and deploy MOVE tokens
2. **Wait for Round End** → 60-second rounds with live countdown
3. **Win Rewards** → Winning blocks split the reward pool
4. **Repeat** → New round starts automatically

### Reward Distribution (Per Round):
- **85%** → Winning block miners (proportional to deployment)
- **10%** → Vault (protocol treasury)
- **5%** → Motherlode pool (future feature)

## ive Features

### Grid Mining
- **5x5 grid** (25 blocks) with real-time deployment tracking
- **60-second rounds** with live countdown timer
- **Multiple winners** per round (5 winning blocks typically)
- **Proportional rewards** based on deployment amounts
- **Visual feedback** with heatmap and winning block highlights
- **Block statistics** showing deployed amounts and miner counts

### Strategic Gameplay
- **Select specific blocks** for targeted strategy
- **Deploy varying amounts** to maximize winning potential
- **Track your stats** - total deployed, rounds won, earnings

### Authentication
- **Social login** via Privy (Google, Twitter, Discord, GitHub)
- **Native wallet support** (Nightly, Petra, Martian, Pontem, etc.)
- **Auto-reconnect** on page refresh
- **Embedded wallets** created automatically for social login users

### Real-Time Data
- **Live blockchain sync** - all data fetched from Movement Network
- **Round tracking** with current round number and total deployed
- **Personal statistics** - your deployments and wins
- **Block heatmap** - visualize competition intensity
- **Winning indicators** - green highlights for winning blocks

## Technical Implementation

### Smart Contracts (Live on Testnet)

**Contract Address:** `0x41f50ee5eafbf2d4ac7ebf2df582c8aeb5e5a6070bee6cd55b0c09dac189e8d6`

**Vault Address:** `0xfc7e6f32653414966f60f937f1f7ecf93e0a454b0754929313993956c17c86b1`

**Deployed Modules:**
- `more_token_v3` - MORE fungible asset with 8 decimals
- `game_state_v3` - Core 5x5 grid game logic with vault system
- `motherlode_v3` - Jackpot tracking and round results
- `automation_v3` - Future feature (not active in UI)

**Key Functions:**
- `deploy(admin_addr, block_indices, amount_per_block)` - Deploy MOVE to blocks
- `get_game_state(admin_addr)` - Fetch current round and stats
- `get_round_status(admin_addr)` - Get countdown timer data
- `get_block(admin_addr, block_index)` - Get individual block state
- `balance_of(owner, admin_addr)` - Check MORE token balance
- `test_faucet(admin_addr)` - Claim 10,000 MORE tokens

### Frontend Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Blockchain SDK:** Aptos TS SDK v5.1.5
- **Wallet Integration:** 
  - Privy (social login + embedded wallets)
  - Aptos Wallet Adapter (native wallet support)
- **UI Components:** Custom components with Lucide icons
- **Notifications:** Sonner (toast notifications)
- **State Management:** React hooks with real-time blockchain sync

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/akerems/more-m1-hackathon
   cd more-m1-hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   ```
   
   > Get your Privy App ID from [Privy Dashboard](https://dashboard.privy.io)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Get testnet tokens**
   
   - **MOVE tokens:** [Movement Faucet](https://faucet.movementnetwork.xyz/)
   - **MORE tokens:** Use the "Get MORE" button in the app (calls `test_faucet`)

## How to Play

### Step-by-Step Guide:

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the top right
   - Choose social login (Google, Twitter, etc.) or native wallet
   - Approve the connection

2. **Get Testnet Tokens**
   - **MOVE:** Click "Get MOVE" → Opens Movement faucet
   - **MORE:** Click "Get MORE" → Claims 10,000 MORE tokens instantly

3. **Select Blocks**
   - Click individual blocks on the 5x5 grid to select them
   - Use "All" button to select all 25 blocks
   - Use "Clear" button to deselect

4. **Set Deployment Amount**
   - Enter amount per block (minimum 1 MOVE)
   - Use quick add buttons: +100, +10, +1
   - Total cost shown at bottom

5. **Deploy**
   - Click "Deploy to X Blocks" button
   - Approve transaction in your wallet
   - Wait for confirmation (toast notification)

6. **Watch the Round**
   - Monitor countdown timer (60 seconds per round)
   - See real-time updates as others deploy
   - Heatmap shows competition intensity

7. **Check Results**
   - When round ends, winning blocks turn green
   - Check your stats for updated wins/earnings
   - New round starts automatically

## Reward Calculation

### How Rewards Work:

Each round, rewards are distributed based on:
1. Total MOVE deployed by all players
2. Which blocks win (determined by contract RNG)
3. Your proportional deployment to winning blocks

### Example:

**Round Setup:**
- You deploy: 10 MOVE to Block #5
- Others deploy: 40 MOVE to Block #5
- Total Block #5: 50 MOVE

**Block #5 Wins:**
- Block #5 reward pool: 50 MOVE × 0.85 = 42.5 MOVE (85% to winners)
- Your share: (10 / 50) × 42.5 = **8.5 MOVE**
- Your profit: 8.5 - 10 = **-1.5 MOVE** (you need to win multiple blocks or have higher proportion)

**Winning Strategy:**
- Deploy to 5 blocks × 10 MOVE each = 50 MOVE total
- If 2 blocks win with low competition, you profit!

## Known Limitations & Future Features

### Not Yet Implemented:

1. **Buyback & Burn Mechanism**
   - Requires DEX and liquidity pool on Movement testnet
   - Protocol fees accumulate in vault but aren't used for buybacks yet
   - Will be implemented when Movement DEX launches

2. **Motherlode Jackpot**
   - Pool tracking exists but jackpot not triggered
   - Contract has logic but needs activation
   - Future update will enable 1-in-625 jackpot wins

3. **Staking System**
   - Contract module exists but not integrated in UI
   - Future feature for passive MORE rewards
   - Will allow flexible staking with no lock periods

4. **Auto-Deploy/Automation**
   - **Removed from UI due to bugs** - feature was incomplete and buggy
   - Could not be completed in hackathon timeframe
   - Keeper system designed but implementation had issues
   - Will require significant refactoring before re-adding
   - Manual deployment works perfectly - use that instead!

5. **Referral System**
   - Designed but not yet deployed
   - Will offer 3-tier referral rewards
   - Future social growth feature

### ✅ Fully Working:

- ✅ **Manual deployment** - Core feature, fully functional and tested
- ✅ Real-time grid deployment and visualization
- ✅ 60-second rounds with live countdown
- ✅ Winning block determination and highlights
- ✅ Proportional reward distribution
- ✅ Wallet integration (social + native)
- ✅ Token faucets (MOVE + MORE)
- ✅ Player statistics tracking
- ✅ Blockchain data synchronization
- ✅ Transaction notifications
- ✅ Responsive UI/UX

> **Note:**
## 🔒 Security Notes

**Important Security Information:**

1. **Unaudited Contracts**
   - Smart contracts have NOT been professionally audited
   - Use only with testnet tokens
   - Do NOT deploy to mainnet without audit

2. **Testnet Only**
   - All tokens are for testing purposes
   - No real value - can be reset anytime
   - Do not attempt to use with real funds

3. **Experimental Software**
   - Built for hackathon/educational purposes
   - May contain bugs or unexpected behavior
   - No warranties or guarantees provided

4. **Best Practices**
   - Never share your private keys
   - Use social login for ease (Privy handles keys)
   - Test with small amounts first
   - Report bugs via GitHub Issues

## Troubleshooting

### Common Issues:

**"Wallet won't connect"**
- Clear browser cache and cookies
- Try different wallet or social login
- Check browser console for errors

**"Transaction failed"**
- Ensure sufficient MOVE balance (check gas + deployment)
- Wait for previous transaction to complete
- Try refreshing the page

**"Balance not updating"**
- Wait 5-10 seconds for blockchain sync
- Check transaction on explorer
- Refresh page if needed

**"Timer not counting down"**
- This is normal between rounds
- New round starts when transactions occur
- Timer will resume when round is active

## Acknowledgments

- **Movement Network** for the hackathon opportunity
- **Privy** for seamless authentication infrastructure
- **Aptos** for the Move 2.0 language and SDK
- **Next.js** and **Tailwind CSS** for excellent developer experience
- All testers and early users for feedback


**Final Disclaimer:** This is experimental software built for educational and hackathon purposes. Smart contracts are **not audited**. Use only with testnet tokens at your own risk. No warranties provided.
