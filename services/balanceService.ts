import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { wnd } from "@polkadot-api/descriptors";
import { ethers } from "ethers";

const POLKADOT_DECIMALS = 12;
const EVM_DECIMALS = 18;
const ASSET_HUB_WESTEND_RPC = "https://westend-asset-hub-eth-rpc.polkadot.io";

interface FormattedBalance {
  free: number;
  reserved: number;
  total: number;
  frozen: number;
  transferable: number;
  existentialDeposit: number;
  raw: {
    free: string;
    reserved: string;
    total: string;
    frozen: string;
    transferable: string;
    existentialDeposit: string;
  };
}

interface EVMBalance {
  formatted: number;
  raw: string;
}

export class BalanceService {
  private client;
  private api;
  private evmProvider: ethers.JsonRpcProvider;

  constructor() {
    // Initialize connection to Westend Asset Hub for Polkadot
    this.client = createClient(
      withPolkadotSdkCompat(
        getWsProvider('wss://westend-asset-hub-rpc.polkadot.io')
      )
    );
    this.api = this.client.getTypedApi(wnd);

    // Initialize EVM provider
    this.evmProvider = new ethers.JsonRpcProvider(ASSET_HUB_WESTEND_RPC);
  }

  /**
   * Format balance with specified decimals to 2 decimal places
   * @param value Raw balance value
   * @param decimals Number of decimals to format with
   * @returns Formatted balance with 2 decimal places
   */
  private formatBalance(value: bigint, decimals: number): number {
    const converted = Number(value) / Math.pow(10, decimals);
    return Math.round(converted * 100) / 100;
  }

  /**
   * Get the EVM balance of an address
   * @param address The EVM address to check
   * @returns Promise with the balance information
   */
  async getEvmBalance(address: string): Promise<EVMBalance> {
    try {
      const balance = await this.evmProvider.getBalance(address);
      return {
        formatted: this.formatBalance(balance, EVM_DECIMALS),
        raw: balance.toString()
      };
    } catch (error) {
      console.error("Failed to get EVM balance:", error);
      throw error;
    }
  }

  /**
   * Get the formatted Polkadot balance of a specific address including frozen balances and transferable amount
   * @param address The SS58-formatted address to check
   * @returns Promise with the formatted balance information
   */
  async getPolkaBalance(address: string): Promise<FormattedBalance> {
    try {
      // Query the System.Account storage to get account info
      const accountInfo = await this.api.query.System.Account.getValue(address);
      
      // Get existential deposit from constants
      const existentialDeposit = await this.api.constants.Balances.ExistentialDeposit();

      const free = accountInfo.data.free;
      const reserved = accountInfo.data.reserved;
      const frozen = accountInfo.data.frozen;
      const total = free + reserved;

      // Calculate transferable amount
      // transferable = free - max(frozen - reserved, ED)
      const maxLock = frozen > reserved ? frozen - reserved : BigInt(0);
      const transferable = free - (maxLock > existentialDeposit ? maxLock : existentialDeposit);

      // Return both formatted and raw balances
      return {
        free: this.formatBalance(free, POLKADOT_DECIMALS),
        reserved: this.formatBalance(reserved, POLKADOT_DECIMALS),
        total: this.formatBalance(total, POLKADOT_DECIMALS),
        frozen: this.formatBalance(frozen, POLKADOT_DECIMALS),
        transferable: this.formatBalance(transferable, POLKADOT_DECIMALS),
        existentialDeposit: this.formatBalance(existentialDeposit, POLKADOT_DECIMALS),
        raw: {
          free: free.toString(),
          reserved: reserved.toString(),
          total: total.toString(),
          frozen: frozen.toString(),
          transferable: transferable.toString(),
          existentialDeposit: existentialDeposit.toString()
        }
      };
    } catch (error) {
      console.error("Failed to get Polkadot balance:", error);
      throw error;
    }
  }

  /**
   * Destroy all connections
   */
  destroy() {
    if (this.client) {
      this.client.destroy();
    }
    if (this.evmProvider) {
      this.evmProvider.destroy();
    }
  }
} 