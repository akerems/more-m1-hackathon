   # 🎮 MORE - Decentralized Mining Game

   ![Movement Network](https://img.shields.io/badge/Movement-Network-FDB71A?style=for-the-badge)
   ![Move 2.0](https://img.shields.io/badge/Move-2.0-orange?style=for-the-badge)
   ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
   ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)

> ## ⚠️ **IMPORTANT DISCLAIMERS**
> 
> **Frontend Prototype Notice:**
> - This is currently a **frontend prototype** with mock data
> - All numbers, statistics, and activity shown on screen are **placeholder values**
> - **NO real blockchain data** is currently integrated
> - Smart contracts are **designed but not yet developed**
> - Wallet connections work but transactions are **not executing on-chain**
> 
> **Experimental Hackathon Project:**
> - Built for Movement Network Hackathon
> - Smart contracts will **NOT be audited** initially
> - Use only with **testnet tokens** once deployed
> - Do **NOT** use in production
> - No guarantees of security or correctness

   MORE is an experimental on-chain mining game built on Movement Network. Players compete on a 5x5 grid to earn MOVE tokens from grid wins and MORE tokens from the Motherlode jackpot, while protocol fees fuel continuous buyback & burn of MORE tokens - aligning long-term holders with on-chain activity growth.

   ## 🎯 Core Concept

   ### Two Ways to Win:

   1. **🎰 Motherlode Jackpot (1 in 625)** → Win **MORE** tokens
      - Shared jackpot pool grows every round
      - 60% to winners, 20% to all miners, 15% buyback & burn, 5% rollover

   2. **⚡ Grid Wins** → Win **MOVE** tokens
      - Deploy to blocks and win from block pool
      - 85% to winners, 15% protocol fee → buyback & burn

   ### 🔥 Buyback & Burn Mechanism
   Protocol fees from both systems are used to continuously buyback MORE tokens from the market and burn them, creating deflationary pressure that aligns holders with the protocol's growth.

   ## ✨ Features

### 🎰 Single Motherlode System (Planned)
- **MORE token jackpot** triggered at 1 in 625 chance
- VRF-based provably fair selection
- Real-time jackpot tracking and countdown timer
- Shared pool grows with each round

### ⚡ Grid Mining (Planned)
- **5x5 grid** with multiple winning blocks per round
- Deploy MOVE tokens to compete
- Win proportional MOVE rewards from winning blocks
- Select specific blocks or deploy to all

### 🤖 On-chain Automation (Planned)
- Stake MOVE tokens for automated deployment
- Keeper network executes your strategy 24/7
- Multiple strategies: Random (5 blocks) or All Blocks (25)
- Top-up stake anytime or disable automation

### 💰 Flexible Staking (Planned)
- Stake MORE tokens to earn block-based rewards
- No lock periods - withdraw anytime
- Earn MORE rewards for every block
- Minimum 1 MORE threshold to claim
- Auto-claim rewards on stake/unstake

   ### 🔐 Seamless Authentication
   - **Social login** via Privy (Google, Twitter, Discord, GitHub)
   - **Embedded wallets** created automatically
   - **Native wallet support** (Petra, Martian, Pontem, etc.)
   - No seed phrases required for new users

### 🔥 Tokenomics (Planned)
- **MORE Token:** Game token with deflationary mechanics
- **Buyback & Burn:** Protocol fees continuously reduce supply
- **Holder Alignment:** Burns benefit all MORE holders
- **Activity Growth:** More gameplay = more burns

   ## 🛠️ Tech Stack

### Smart Contracts (Planned)
- **Language:** Move 2.0
- **Network:** Movement Network Testnet (Chain ID: 250)
- **Status:** Designed and documented, to be developed
- **Planned Modules:**
  - `more_token.move` - Fungible asset (MORE token)
  - `game_state.move` - Core mining game logic with protocol fees
  - `motherlode.move` - Single jackpot system + grid rewards
  - `staking.move` - Flexible staking with block-based rewards
  - `referral.move` - 3-tier referral rewards
  - `automation.move` - On-chain keeper system

   ### Frontend
   - **Framework:** Next.js 14 (App Router)
   - **Language:** TypeScript
   - **Styling:** Tailwind CSS
   - **Wallet Integration:** Privy + Aptos Wallet Adapter
   - **Blockchain SDK:** Aptos TS SDK v5.1.5
   - **UI Components:** Custom components with Lucide icons
   - **Notifications:** Sonner (toast notifications)

## 🚀 Getting Started

> **Note:** This runs the frontend prototype with mock data. For actual on-chain functionality, smart contracts must be deployed first (see deployment section below).

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Running the Frontend Prototype

1. **Clone the repository**
   ```bash
   git clone https://github.com/akerems/more-m1-hackathon.git
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
   
   > 🔑 Get your Privy App ID from [Privy Dashboard](https://dashboard.privy.io)
   > 
   > **Note:** Wallet connections will work, but transactions won't execute until contracts are deployed.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   > You'll see the game interface with **mock data**. All numbers and statistics are placeholders.

## 📁 Project Structure

```
more-m1-hackathon/          # ✅ Frontend prototype (functional, uses mock data)
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main mining page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # Context providers
│   ├── stake/             # Staking page
│   ├── discover/          # Explorer/Stats page
│   └── about/             # About page
├── components/             # React components
│   ├── Header.tsx
│   ├── MiningGrid.tsx
│   ├── DeployPanel.tsx
│   ├── MotherlodeDisplay.tsx
│   ├── WalletButton.tsx
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useBalance.ts
│   └── useAutomation.ts
├── lib/                    # Utilities and configs
│   ├── aptos.ts           # Aptos SDK config
│   ├── privy-config.ts    # Privy wallet config
│   └── transactions.ts    # Transaction helpers
├── public/                 # Static assets
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS config
└── README.md              # This file
```

> **Note:** This repository contains the frontend application. Move 2.0 smart contracts are documented but not yet published in this repo. They will be added in a future update or separate repository.

   ## 🎮 How to Play

   > **Note:** The following describes the intended gameplay mechanics. Current prototype displays mock data - actual on-chain gameplay will be available after smart contract deployment.

   ### Manual Deployment

   1. **Connect your wallet** using social login or native wallet
   2. **Get test MOVE tokens** from the faucet (linked in wallet dropdown)
   3. **Select blocks** on the 5x5 grid (or use "All" for maximum chances)
   4. **Set deployment amount** per block
   5. **Deploy** and wait for the round to complete
   6. **Win rewards:**
      - **Grid win** → Earn MOVE tokens
      - **Motherlode** → Earn MORE tokens (1 in 625 chance!)

   ### Auto-Deploy Mode

   1. Switch to **Auto** tab in the Deploy Panel
   2. **Stake MOVE tokens** (minimum 10 MOVE)
   3. **Choose strategy:**
      - **Random:** Deploy to 5 random blocks per round
      - **All Blocks:** Deploy to all 25 blocks per round
   4. **Enable automation** - Keepers will execute your deployments 24/7
   5. **Top-up** your stake anytime or disable when done

   ### Staking MORE Tokens

   1. Navigate to the **Stake** page
   2. **Stake MORE tokens** (any amount, no minimum)
   3. **Earn rewards** automatically every block:
      - 0.0001 MORE per block per 1 MORE staked
      - Rewards accumulate continuously
   4. **Claim rewards** when you reach 1 MORE minimum
   5. **Unstake anytime** - no lock periods!
      - Withdraw all or partial amount
      - Auto-claims pending rewards

   **Example:**
   - Stake 10,000 MORE
   - After 100 blocks → Earn 1 MORE (claimable!)
   - After 1,000 blocks → Earn 10 MORE
   - Withdraw anytime with no penalties

   ## 💡 Reward Distribution

   > **⚠️ These are the planned mechanics for when contracts are deployed. Current frontend displays mock values.**

   ### Motherlode Win (MORE tokens)
   - 60% → Motherlode block winners
   - 20% → All active miners
   - 15% → Buyback & burn
   - 5% → Next round rollover

   ### Grid Win (MOVE tokens)
   - 85% → Winning block miners
   - 15% → Protocol fee (buyback & burn)

   ### Buyback & Burn Flow
   1. Protocol collects fees in MOVE
   2. Fees used to buy MORE from DEX
   3. Purchased MORE is burned forever
   4. Supply decreases, benefiting all holders

   ## 💎 Staking System

   > **⚠️ Prototype Notice:** The staking interface is functional in the UI, but rewards and transactions are simulated with mock data until contracts are deployed.

   MORE uses a **flexible, block-based staking system** with no lock periods.

   ### How It Works

   **Stake:**
   - Deposit any amount of MORE tokens
   - No minimum, no lock periods
   - Start earning immediately

   **Earn:**
   - Rewards accrue every block: **0.0001 MORE per block per 1 MORE staked**
   - Continuous accumulation based on blocks elapsed
   - Formula: `rewards = (staked_amount × blocks_elapsed × 0.0001)`

   **Claim:**
   - Minimum threshold: **1 MORE**
   - Claim anytime once threshold is met
   - Auto-claim on new stakes or unstakes

   **Unstake:**
   - Withdraw full or partial amount anytime
   - No penalties, no waiting periods
   - Unclaimed rewards automatically paid out (if ≥ 1 MORE)

   ### Reward Examples

   | Staked Amount | Blocks Elapsed | Rewards Earned |
   |---------------|----------------|----------------|
   | 1,000 MORE | 100 blocks | 0.1 MORE |
   | 1,000 MORE | 1,000 blocks | 1 MORE ✅ (claimable) |
   | 10,000 MORE | 100 blocks | 1 MORE ✅ (claimable) |
   | 10,000 MORE | 1,000 blocks | 10 MORE |
   | 100,000 MORE | 1,000 blocks | 100 MORE |

   ### Why Stake?

   - **Passive Income:** Earn MORE just by holding
   - **Deflationary Benefit:** As supply burns, your staked MORE becomes more valuable
   - **Flexible:** No lock-ups, withdraw anytime
   - **Compounding:** Restake rewards to earn more
   - **Zero Risk:** Only opportunity cost vs. selling

   ## 🌐 Movement Network Details

   - **Testnet RPC:** `https://testnet.movementnetwork.xyz/v1`
   - **Chain ID:** 250
   - **Explorer:** [https://explorer.movementnetwork.xyz](https://explorer.movementnetwork.xyz)
   - **Faucet:** [https://faucet.movementnetwork.xyz](https://faucet.movementnetwork.xyz)

## 📝 Smart Contract Documentation

> **Current Status:** Smart contracts are designed and documented but **NOT YET INCLUDED** in this repository. The frontend is a prototype showing intended functionality with mock data.

### Planned Move 2.0 Modules:

The following smart contracts will be implemented for the complete on-chain functionality:

- **`more_token.move`** - MORE fungible asset with mint/burn capabilities
- **`game_state.move`** - Core 5x5 grid game logic and protocol fees
- **`motherlode.move`** - Single jackpot system (MORE) + grid rewards (MOVE)
- **`staking.move`** - Flexible block-based staking with no lock periods
- **`referral.move`** - 3-tier referral reward system
- **`automation.move`** - On-chain keeper system for auto-deployment

### Future Deployment:

Smart contracts will be added to this repository and deployed to Movement Testnet in a future update. Deployment instructions and contract addresses will be provided at that time.

To track deployment status:
- Watch this repository for updates
- Check the Issues section for deployment progress
- Smart contract code will be added in a `contracts/` or similar directory

### Integration Points:

Once deployed, the following files will need contract addresses:
- `lib/aptos.ts` - Update `CONTRACT_ADDRESS` constant
- Transaction functions will be activated
- Real blockchain data will replace mock values

   ## 🔒 Security & Status Notes

⚠️ **Current Project Status:**
- **Frontend Only:** This is currently a UI/UX prototype
- **Mock Data:** All displayed numbers, stats, and activities are placeholder values
- **No Blockchain Integration:** Smart contracts are designed but not yet developed or deployed
- **Wallet Functionality:** Connections work but transactions are simulated

   ⚠️ **Once Deployed (Future):**
   - Smart contracts will be **NOT audited** initially
   - Use only with **testnet tokens**
   - Do **NOT** use in production without thorough testing
   - No guarantees of security or correctness

   ## 🤝 Contributing

   This is a hackathon project and may not be actively maintained. However, feel free to:
   - Report issues
   - Submit pull requests
   - Fork and build your own version

   ## 📄 License

   MIT License - see LICENSE file for details

   ## 🙏 Acknowledgments

   - Built for Movement Network Hackathon
   - Inspired by on-chain gaming mechanics
   - Powered by Move 2.0 and Privy authentication

   ## 📧 Contact

   For questions or feedback, open an issue on GitHub.

   ---

   ## 📊 Current State vs. Future State

### ✅ **Currently Available:**
- Complete frontend UI/UX prototype
- Wallet connection infrastructure (Privy + Native wallets)
- All game screens and interfaces
- Mock data visualization
- Responsive design and animations
- Documentation of Move 2.0 smart contract design

### 🚧 **To Be Implemented:**
- Move 2.0 smart contract development and code publication
- Smart contract deployment to Movement Testnet
- Real blockchain data integration
- Actual token transactions (MOVE/MORE)
- Live game rounds and mining
- Real-time Motherlode jackpot tracking
- Functional staking with on-chain rewards
- Buyback & burn execution
- Protocol analytics from chain data

### 🎯 **Roadmap:**
1. **Phase 1** (Current): Frontend prototype ✅
2. **Phase 2** (Next): Develop and publish Move 2.0 smart contracts
3. **Phase 3**: Deploy contracts to Movement Testnet
4. **Phase 4**: Integrate frontend with deployed contracts
5. **Phase 5**: Test with real testnet tokens
6. **Phase 6**: Security audit (if moving to mainnet)
7. **Phase 7**: Mainnet deployment (if applicable)

   ---

   **⚠️ Disclaimer:** This is experimental software built for educational and hackathon purposes. The current version is a **frontend prototype with mock data**. Use at your own risk once deployed. No warranties provided.

   **💡 Key Innovations (When Fully Implemented):**
   1. **Buyback & Burn:** Protocol fees continuously buyback and burn MORE tokens, creating deflationary pressure that directly benefits all holders as gameplay increases.
   2. **Flexible Staking:** Block-based rewards with no lock periods - stake and unstake anytime while earning continuous passive income.
   3. **Dual Reward System:** Win MOVE from grid play, earn MORE from Motherlode jackpots, and stake MORE for passive rewards - three ways to accumulate value.

