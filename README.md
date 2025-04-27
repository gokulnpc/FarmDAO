# 🌾 FarmDAO — Decentralized Crop Insurance & Governance on Polkadot

Try it out here: [https://farmdao.vercel.app/](https://farmdao.vercel.app/)

---

## 🌟 Overview

- **FarmDAO** is a decentralized insurance and governance platform revolutionizing agricultural insurance through smart contracts, Chainlink oracles, and DAO-driven dispute resolution on the Polkadot network.
- Farmers purchase **parametric crop insurance policies** using stablecoins (FUSD), represented as NFTs, ensuring transparent, automated coverage against real-world weather events.
- In case of disputes, token holders vote via a decentralized governance system, ensuring fairness, transparency, and economic incentives for honest participation.

---

![FarmDAO Demo](https://drive.google.com/uc?export=view&id=1Yyv9mu3I-EcebO1VjZGbonQvjVZELGK_)

---

## 💻 Demo

> 🌐 Access the live application: [https://farmdao.vercel.app/](https://farmdao.vercel.app/)

---

## 🚀 Smart Contract Deployment (Moonbase Alpha Testnet)

| Contract | Address | Purpose |
|:---|:---|:---|
| **DisputeManager** | [`0x23988C9d187A064Feb7EE21dB389B469FbDc6421`](https://moonbase.moonscan.io/address/0x23988C9d187A064Feb7EE21dB389B469FbDc6421) | Manages disputes after weather event triggers |
| **GovernanceDAO** | [`0x37035da168BaEE11970019B3fe7377aB3984A18b`](https://moonbase.moonscan.io/address/0x37035da168baee11970019b3fe7377ab3984a18b) | Stake and vote on dispute resolutions |
| **InsuranceContract** | [`0x7784f99F10b318D41Ea040d4EaAd8f385Ad1f511`](https://moonbase.moonscan.io/address/0x7784f99F10b318D41Ea040d4EaAd8f385Ad1f511) | Buy insurance policies and trigger payouts |
| **ReceiptNFT** | [`0x20db875112FF5083267A3C19C3812de5eb3C4C8C`](https://moonbase.moonscan.io/address/0x20db875112FF5083267A3C19C3812de5eb3C4C8C) | NFT representing farmer’s insurance policies |
| **FUSD (Stablecoin)** | [`0xF52593b79C6a6c48DE918C1a3469959029DC3a8e`](https://moonbase.moonscan.io/address/0xF52593b79C6a6c48DE918C1a3469959029DC3a8e) | Stablecoin for premium payments and payouts |
| **FDAO (Governance Token)** | [`0xaC348bAB58b649a41DC23D108e90d949A8852fa0`](https://moonbase.moonscan.io/address/0xaC348bAB58b649a41DC23D108e90d949A8852fa0) | Governance and staking token for dispute resolution |

- **Block Explorer:** [Moonbase Moonscan](https://moonbase.moonscan.io/)
- **RPC Endpoint:** `https://rpc.api.moonbase.moonbeam.network`

---

## 📂 Smart Contract Structure

- **InsuranceContract.sol** — Policy purchase, premium payments, payouts, NFT minting.
- **DisputeManager.sol** — Manage dispute lifecycle and link with DAO governance.
- **GovernanceDAO.sol** — Staking, voting, dispute resolution, rewarding voters.
- **ReceiptNFT.sol** — ERC721 NFT representing crop insurance policies.
- **FUSD.sol** — ERC20 stablecoin for buying insurance and receiving payouts.
- **FDAO.sol** — ERC20 governance token for staking, voting, and redemption.

👉 [FarmDAO Contracts Repo](https://github.com/Thongnguyentam/FarmDAO-Contracts)

---

## 📄 Smart Contract Functions

| Contract | Key Functions |
|:---|:---|
| `InsuranceContract.sol` | `buyPolicy()`, `triggerPayout()`, `openDisputeWindow()` |
| `DisputeManager.sol` | `proposeDispute()`, `resolveDispute()` |
| `GovernanceDAO.sol` | `stakeTokens()`, `voteOnDispute()`, `rewardVoters()` |
| `RedemptionPool.sol` | `redeemFDAOforFUSD()` |

---

## ✨ Key Features

### 🌾 Parametric Crop Insurance
- Automated payouts based on real-world weather data.
- Instant, transparent claim settlement via smart contracts.

### 🖼 On-Chain NFT Insurance Policies
- Farmers hold **Receipt NFTs** representing their active insurance policies.

### 🌩 Decentralized Oracles
- Real-time, tamper-proof weather data via **Chainlink Oracles** on Polkadot parachains.

### 🗳 Community-Driven Governance
- FDAO token holders vote anonymously to resolve payout disputes fairly and transparently.

### 🔒 Incentive-Aligned Voting
- Honest voters earn FDAO rewards.
- Minimum staking requirement ensures participation integrity and prevents sybil attacks.

---

## 🛠 Core Platform Functionalities

- Connect Wallet (Metamask, WalletConnect support)
- Buy Insurance using stablecoins (FUSD/WUSD)
- Real-Time Weather Monitoring via Chainlink Oracle
- Automatic Payouts for insured weather events
- DAO-Based Dispute Resolution (stake & vote)
- FDAO Token Rewards and Redemption System
- Treasury Yield Farming:
  - Tokenized T-Bills (3–5% APY)
  - Delta-neutral strategies for additional yield

---

## 📈 Treasury Strategy (Profitability)

| Asset Strategy | Allocation | Notes |
|:---|:---|:---|
| Tokenized T-Bills | 40% | Stable 4–5% APY |
| Delta-Neutral LPs | 30% | Low-volatility farming |
| Stablecoin Lending | 20% | Aave, Compound pools |
| Liquid Cash Reserve | 10% | Fast payouts anytime |

---

## 🛠️ In Progress (Future Enhancements)

- 🌐 **Cross-Parachain Participation:**  
  Enabling users across different Polkadot parachains using XCM and native asset transfers.

- 🔒 **Enhanced Payout Security:**  
  Using Polkadot multisig accounts for highly secure, verifiable payouts.

- 📡 **Advanced Decentralized Oracle Integration:**  
  Deeper integration with Chainlink DON (Decentralized Oracle Network) for even faster, on-chain weather data.

---

## ❄️ Project Structure

```
FarmDao-Frontend/
├── app/
│   ├── abi/                  # Smart contract ABIs
│   ├── components/            # Frontend UI components
│   ├── pages/                 # Pages and routing
│
├── services/                  
│   ├── PinataService.ts       # IPFS upload for metadata storage
│   ├── WeatherService.ts      # Weather API service
│
FarmDao-Contracts/
├── contracts/                 
│   ├── InsuranceContract.sol
│   ├── DisputeManager.sol
│   ├── GovernanceDAO.sol
│   ├── ReceiptNFT.sol
│
├── test/                      # Unit tests for smart contracts
├── hardhat.config.ts          # Hardhat configuration
```

---

## 💻 Technology Stack

### ⛓️ Blockchain & Smart Contracts
![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=Polkadot&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFD700?style=for-the-badge&logo=hardhat&logoColor=black)

### 🎨 Frontend & UI
![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 📦 Storage & Data
![Pinata](https://img.shields.io/badge/Pinata-E4405F?style=for-the-badge&logo=pinata&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 👥 Contributors

- **Gokuleshwaran Narayanan**
- **Dylan**

---

## 🤝 Support

For support or questions, feel free to reach out or join our community discussions.

---

# 🌟  
_"Powered by Polkadot — Revolutionizing the farm economy, one policy at a time."_
