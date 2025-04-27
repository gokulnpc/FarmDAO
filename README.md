# 🌾 FarmDAO — Decentralized Crop Insurance & Governance on Polkadot 🌾

Try it our here: https://farmdao.vercel.app/

## 🌟 Overview

- FarmDAO is a decentralized insurance and governance platform revolutionizing agricultural insurance through smart contracts, Chainlink oracles, and DAO-driven dispute resolution on the Polkadot network.  
- Farmers purchase parametric crop insurance policies using stablecoins (FUSD), represented as NFTs, ensuring transparent, automated coverage against real-world weather events.  
- In the case of disputes, token holders vote via a decentralized governance system, ensuring fairness, transparency, and economic incentives for honest participation.

![Image Description](https://drive.google.com/uc?export=view&id=1Yyv9mu3I-EcebO1VjZGbonQvjVZELGK_)

## 💻 DEMO


## 🚀 Contract Addresses on Moonbase Alpha (Moonbeam Testnet)

| Contract | Address | Purpose |
|:---|:---|:---|
| **DisputeManager** | [`0x23988C9d187A064Feb7EE21dB389B469FbDc6421`](https://moonbase.moonscan.io/address/0x23988C9d187A064Feb7EE21dB389B469FbDc6421) | Manages disputes after weather event triggers |
| **GovernanceDAO** | [`0x37035da168BaEE11970019B3fe7377aB3984A18b`](https://moonbase.moonscan.io/address/0x37035da168baee11970019b3fe7377ab3984a18b) | Stake and vote on dispute resolutions |
| **InsuranceContract** | [`0x7784f99F10b318D41Ea040d4EaAd8f385Ad1f511`](https://moonbase.moonscan.io/address/0x7784f99F10b318D41Ea040d4EaAd8f385Ad1f511) | Buy insurance policies and trigger payouts |
| **ReceiptNFT** | [`0x20db875112FF5083267A3C19C3812de5eb3C4C8C`](https://moonbase.moonscan.io/address/0x20db875112FF5083267A3C19C3812de5eb3C4C8C) | NFT representing farmer’s insurance policies |
| **FUSD (Stablecoin)** | [`0xF52593b79C6a6c48DE918C1a3469959029DC3a8e`](https://moonbase.moonscan.io/address/0xF52593b79C6a6c48DE918C1a3469959029DC3a8e) | Payment token for insurance premiums and payouts |
| **FDAO (Governance Token)** | [`0xaC348bAB58b649a41DC23D108e90d949A8852fa0`](https://moonbase.moonscan.io/address/0xaC348bAB58b649a41DC23D108e90d949A8852fa0) | Governance and staking token for dispute resolution |

> ✨ **Block Explorer:** [Moonbase Moonscan](https://moonbase.moonscan.io/)

> ✨ **RPC Endpoint:** `https://rpc.api.moonbase.moonbeam.network`

---

## 📂 Contract Descriptions

- **InsuranceContract.sol**  
  Handles policy purchase, premium payments, weather-triggered payouts, and minting ReceiptNFTs.

- **DisputeManager.sol**  
  Manages the dispute lifecycle and interacts with the DAO for resolution.

- **GovernanceDAO.sol**  
  Allows FDAO token holders to stake, vote, and resolve disputes transparently.

- **ReceiptNFT.sol**  
  ERC721 NFTs representing insured policies.

- **FUSD.sol**  
  ERC20 stablecoin for buying insurance and receiving payouts.

- **FDAO.sol**  
  ERC20 governance token for staking, voting, and redeeming for FUSD.


## 📄 Smart Contract Functions

| Contract | Key Functions |
|:---|:---|
| `InsuranceContract.sol` | `buyPolicy()`, `triggerPayout()`, `openDisputeWindow()` |
| `DisputeManager.sol` | `proposeDispute()`, `resolveDispute()` |
| `GovernanceDAO.sol` | `stakeTokens()`, `voteOnDispute()`, `rewardVoters()` |
| `RedemptionPool.sol` | `redeemFDAOforFUSD()` |

[FarmDAO Contracts](https://github.com/Thongnguyentam/FarmDAO-Contracts)

## ✨ Key Features

---

### 🌾 Parametric Crop Insurance  
- Instant, automated payouts triggered by real-world weather data using smart contracts.  
- No need for manual claims or traditional insurance agents.

### 🖼 On-Chain NFT Insurance Policies  
- Farmers receive a **Receipt NFT** representing their active insurance coverage.  
- Full transparency and ownership on-chain.

### 🌩 Decentralized Oracles  
- Secure, tamper-proof real-world weather data sourced from **Chainlink**.  
- Integrated via oracles operating on **Polkadot parachains** for enhanced reliability.

### 🗳 Community-Driven Governance  
- Disputes are resolved by the community of **FDAO token holders**.  
- Voting is conducted anonymously to ensure fair, unbiased decisions.

### 🔒 Incentive-Aligned Voting  
- Honest voters on the majority side earn **FDAO rewards**.  
- Anti-sybil protection with minimum staking requirements to vote.  
- Aligns governance participation with platform sustainability.

---

## 🛠 Core Platform Functionalities

- **Connect Wallet:**  
  Seamless Metamask and WalletConnect support for onboarding farmers.

- **Buy Insurance Plans:**  
  Purchase fixed insurance coverage tiers using **FUSD** or **WUSD** stablecoins.

- **Real-Time Weather Monitoring:**  
  Chainlink Oracles monitor climate data and trigger payouts based on predefined thresholds.

- **Automatic Disaster Payouts:**  
  Farmers automatically receive payouts if insured weather events occur — no need for manual intervention.

- **Dispute Resolution DAO:**  
  In case of contested payouts, FDAO token holders vote to approve or reject the payout transparently.

- **Staking Model for Governance:**  
  Voters must stake FDAO tokens to participate in voting, preventing spam and malicious votes.

- **FDAO Token Economy:**  
  Earn FDAO tokens by participating in governance.  
  Redeem FDAO tokens for FUSD at a fixed rate via the redemption pool.

- **Treasury Yield Farming:**  
  Insurance premiums are invested into low-risk strategies:  
  - Tokenized T-Bills (3–5% APY)  
  - Delta-neutral liquidity pools for sustainable treasury growth.
  
## 📈 Treasury Strategy (Profitability)

- 40% - Tokenized T-Bills (Stable 4–5% APY)
- 30% - Delta-Neutral LPs (low-volatility farming)
- 20% - Stablecoin Lending (Aave, Compound)
- 10% - Liquid cash reserve for fast payouts

### 🛠️ [In Progress]
- 🌐 Cross-Parachain Participation: Building a scalable, accessible ecosystem where users across different Polkadot parachains can participate using XCM messaging and native asset transfers.

- 🔒 Enhanced Payout Security: Strengthening payout mechanisms with Polkadot multisig accounts for even higher security and transparency.

- 📡 Advanced Decentralized Oracle Integration: Deepening integration with Chainlink's Decentralized Oracle Network to fetch real-time, on-chain weather data more efficiently.

## ❄️ Project Structure
```
FarmDao-Frontend/
├── app                       # Main directory of front-end app
│   ├── abi/                  # abi of the contracts
│   ├── 
│
├── services/                 # Backend services
│   └── PinataService.py      # IPFS to story metadata
│   └── WeatherService.ts     # Weather-API 
├── ...
FarmDao-Contracts/
├── contracts/                # Contracts main folder
│   └── ...
│   └── DisputManager.sol     
│   └── InsuranceContract.sol      
│
├── test/                     # test file for the contract
├── hardhat.config.ts         # Configuratiton for deployed network
```

## 💻 Technology Stack

### ⛓️ Blockchain & Smart Contracts

![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=Polkadot&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFD700?style=for-the-badge&logo=hardhat&logoColor=black)


### 🎨 Frontend & UI

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 📦 Storage & IPFS

![Pinata](https://img.shields.io/badge/Pinata-E4405F?style=for-the-badge&logo=pinata&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-E4405F?style=for-the-badge&logo=mongoDB&logoColor=white)



## 👥 Built By

FarmDao is developed by a team of top university researchers and blockchain developers, passionate about crypto, AI, and market analytics.

## 🤝 Support

For support, please reach out to our team or join our community channels.

_Powered by Polkadot - Revolutionizing the farm economy, one token at a time._
