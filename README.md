# 🌾 FarmDAO — Decentralized Crop Insurance & Governance on Polkadot 🌾

Try it our here: https://farmdao.vercel.app/

## 🌟 Overview

- FarmDAO is a decentralized insurance and governance platform revolutionizing agricultural insurance through smart contracts, Chainlink oracles, and DAO-driven dispute resolution on the Polkadot network.  
- Farmers purchase parametric crop insurance policies using stablecoins (FUSD), represented as NFTs, ensuring transparent, automated coverage against real-world weather events.  
- In the case of disputes, token holders vote via a decentralized governance system, ensuring fairness, transparency, and economic incentives for honest participation.

![Image Description](https://drive.google.com/uc?export=view&id=1Yyv9mu3I-EcebO1VjZGbonQvjVZELGK_)

## 💻 DEMO

## 🚀 Contract Address on testnet:

- **DisputeManager**: 
0x23988C9d187A064Feb7EE21dB389B469FbDc6421
- **GovernanceDao**: 0x37035da168BaEE11970019B3fe7377aB3984A18b
- **InsuranceContract**: 0x7784f99F10b318D41Ea040d4EaAd8f385Ad1f511
- **ReceiptNFT**: 
0x20db875112FF5083267A3C19C3812de5eb3C4C8C
- **FUSD**: 0xF52593b79C6a6c48DE918C1a3469959029DC3a8e
- **FDAO**: 0xaC348bAB58b649a41DC23D108e90d949A8852fa0

[FarmDAO Contracts](https://github.com/Thongnguyentam/FarmDAO-Contracts)

## 📄 Smart Contract Functions

| Contract | Key Functions |
|:---|:---|
| `InsuranceContract.sol` | `buyPolicy()`, `triggerPayout()`, `openDisputeWindow()` |
| `DisputeManager.sol` | `proposeDispute()`, `resolveDispute()` |
| `GovernanceDAO.sol` | `stakeTokens()`, `voteOnDispute()`, `rewardVoters()` |
| `RedemptionPool.sol` | `redeemFDAOforFUSD()` |


## 🎯 Key Features

- 🌾 **Parametric Crop Insurance**: Instant, automated payouts triggered by real-world weather data.
- ⛓ **On-Chain NFT Insurance Policies**: Farmers own policy NFTs transparently on-chain.
- 🌩 **Decentralized Oracles**: Secure, tamper-proof weather data via Chainlink on Polkadot parachains.
- 🗳 **Community-Driven Governance**: Token holders resolve disputes through an anonymous, incentivized voting system.
- 🔒 **Incentive-Aligned Voting**: Honest voters earn FDAO rewards, ensuring unbiased governance participation.

- **Connect Wallet** (Metamask, WalletConnect support)
- **Buy Insurance** plans using stablecoin (FUSD/WUSD)
- **Real-Time Weather Monitoring** via Chainlink Oracle
- **Automatic Payouts** for insured disasters
- **Dispute Resolution DAO** (vote to approve or reject payout)
- **Staking Model** for voters (anti-sybil protection)
- **FDAO Token Economy** (Governance + Redeem for FUSD)
- **Treasury Yield Farming** (T-Bills, delta-neutral strategies for 3–5% APY)
  
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
