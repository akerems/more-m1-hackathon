# 🎮 MORE - Decentralized Mining Game

![Movement Network](https://img.shields.io/badge/Movement-Network-FDB71A?style=for-the-badge)
![Move 2.0](https://img.shields.io/badge/Move-2.0-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)

> ⚠️ **Experimental Project** - Built for hackathon. Smart contracts are not audited. Use at your own risk.

MORE is a provably fair, on-chain mining game featuring a unique **dual motherlode jackpot system** powered by Move 2.0 smart contracts on Movement Network. Players deploy tokens to a 5x5 grid each round, competing for jackpots in both MORE and MOVE tokens.

## ✨ Features

### 🎰 Dual Motherlode System
- Win jackpots in **MORE tokens** (game token) and **MOVE tokens** (native)
- 1 in 625 chance per round with VRF-based provably fair selection
- Real-time jackpot tracking and countdown timer

### 🤖 On-chain Automation
- Stake MOVE tokens for automated deployment
- Keeper network executes your strategy 24/7
- Multiple strategies: Random (5 blocks) or All Blocks (25)
- Top-up stake anytime or disable automation

### 🔐 Seamless Authentication
- **Social login** via Privy (Google, Twitter, Discord, GitHub)
- **Embedded wallets** created automatically
- **Native wallet support** (Petra, Martian, Pontem, etc.)
- No seed phrases required for new users

### ⚡ Provably Fair
- VRF-based randomness for transparent gameplay
- All game logic executed on-chain
- Immutable rules enforced by Move 2.0 smart contracts

## 🛠️ Tech Stack

### Smart Contracts
- **Language:** Move 2.0
- **Network:** Movement Network Testnet (Chain ID: 250)
- **Modules:**
  - `more_token.move` - Fungible asset (MORE token)
  - `game_state.move` - Core mining game logic
  - `motherlode.move` - Dual jackpot system
  - `staking.move` - Time-locked staking with APY
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

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MORE.git
   cd MORE
   ```

2. **Install frontend dependencies**
   ```bash
   cd more-frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `more-frontend` directory:
   ```env
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
   ```
   
   > 🔑 Get your Privy App ID from [Privy Dashboard](https://dashboard.privy.io)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
MORE/
├── more-frontend/           # Next.js frontend application
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configs
│   └── public/             # Static assets
│
└── more-move/              # Move 2.0 smart contracts
    ├── sources/            # Move modules
    │   ├── more_token.move
    │   ├── game_state.move
    │   ├── motherlode.move
    │   ├── staking.move
    │   ├── referral.move
    │   └── automation.move
    └── Move.toml           # Package manifest
```

## 🎮 How to Play

1. **Connect your wallet** using social login or native wallet
2. **Get test MOVE tokens** from the faucet (linked in wallet dropdown)
3. **Select blocks** on the 5x5 grid (or use "All" for maximum chances)
4. **Set deployment amount** per block
5. **Deploy** and wait for the round to complete
6. **Win the Motherlode** if your block is selected! (1 in 625 chance)

### Auto-Deploy Mode

1. Switch to **Auto** tab in the Deploy Panel
2. **Stake MOVE tokens** (minimum 10 MOVE)
3. **Choose strategy:**
   - **Random:** Deploy to 5 random blocks per round
   - **All Blocks:** Deploy to all 25 blocks per round
4. **Enable automation** - Keepers will execute your deployments 24/7
5. **Top-up** your stake anytime or disable when done

## 🌐 Movement Network Details

- **Testnet RPC:** `https://testnet.movementnetwork.xyz/v1`
- **Chain ID:** 250
- **Explorer:** [https://explorer.movementnetwork.xyz](https://explorer.movementnetwork.xyz)
- **Faucet:** [https://faucet.movementnetwork.xyz](https://faucet.movementnetwork.xyz)

## 📝 Smart Contract Deployment

> Note: Contracts are currently deployed on Movement Testnet. Addresses will be updated after deployment.

To deploy your own instance:

1. Install Movement CLI (optional - can also use Aptos CLI)
2. Navigate to `more-move` directory
3. Update `Move.toml` with your address
4. Deploy modules in order:
   ```bash
   aptos move publish --network custom --node-url https://testnet.movementnetwork.xyz/v1
   ```

## 🔒 Security Notes

⚠️ **This is an experimental hackathon project:**
- Smart contracts are **NOT audited**
- Use only with **testnet tokens**
- Do **NOT** use in production
- No guarantees of security or correctness

## 🙏 Acknowledgments

- Built for Movement Network Hackathon
- Inspired by on-chain gaming mechanics
- Powered by Move 2.0 and Privy authentication

## 📧 Contact

For questions or feedback, open an issue or reach out via [your contact method]

---

**⚠️ Disclaimer:** This is experimental software built for educational and hackathon purposes. Use at your own risk. No warranties provided.

