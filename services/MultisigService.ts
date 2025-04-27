import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import type { PolkadotSigner } from "polkadot-api/signer";
import { ethers } from "ethers";
import { wnd } from "@polkadot-api/descriptors";
import { Binary } from "polkadot-api";

interface MultisigParams {
  threshold: number;
  otherSignatories: string[];
  multisigAddress: string;
}

interface EVMCallParams {
  target: string;  // Contract address
  input: string;   // Contract call data
  value?: bigint;  // Value to send
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
}

interface TransactionEvent {
  type: string;
  hash?: string;
  events?: any[];
}

interface CreateTokenParams {
  name: string;
  symbol: string;
  metadataURI: string;
  creator: string;
  factoryAddress: string;
  fee: bigint;
}

interface TransactionResult {
  status: string;
  hash?: string;
  events?: any[];
}

export class MultisigService {
  private client;
  private api;
  private factoryInterface: ethers.Interface;

  constructor() {
    this.client = createClient(
      withPolkadotSdkCompat(
        getWsProvider('wss://westend-asset-hub-rpc.polkadot.io')
      )
    );
    this.api = this.client.getTypedApi(wnd);
    
    // Initialize Factory contract interface
    this.factoryInterface = new ethers.Interface([
      "function create(string _name, string _symbol, string _metadataURI, address _creator) payable"
    ]);
  }

  /**
   * Initiate a multisig transaction for creating a token
   */
  async initiateCreateToken(
    signer: PolkadotSigner,
    multisigParams: MultisigParams,
    tokenParams: CreateTokenParams
  ): Promise<TransactionResult> {
    try {
      // Encode the create function call
      const encodedCall = this.factoryInterface.encodeFunctionData("create", [
        tokenParams.name,
        tokenParams.symbol,
        tokenParams.metadataURI,
        tokenParams.creator
      ]);

      // Prepare EVM call parameters
      const evmParams: EVMCallParams = {
        target: tokenParams.factoryAddress,
        input: encodedCall,
        value: tokenParams.fee,
        gasLimit: BigInt(1000000), // Adjust as needed
        maxFeePerGas: BigInt(1000000000) // Adjust as needed
      };

      // Initiate the multisig transaction
      return await this.initiateMultisigEvmCall(
        signer,
        multisigParams,
        evmParams
      );
    } catch (error) {
      console.error("Failed to initiate create token multisig:", error);
      throw error;
    }
  }

  /**
   * Approve a pending create token multisig transaction
   */
  async approveCreateToken(
    signer: PolkadotSigner,
    multisigParams: MultisigParams,
    timepoint: { height: number; index: number },
    callHash: string
  ): Promise<TransactionResult> {
    try {
      return await this.approveMultisig(
        signer,
        multisigParams,
        timepoint,
        callHash
      );
    } catch (error) {
      console.error("Failed to approve create token multisig:", error);
      throw error;
    }
  }

  /**
   * Initiates a multisig EVM contract call
   */
  private async initiateMultisigEvmCall(
    signer: PolkadotSigner,
    multisigParams: MultisigParams,
    evmParams: EVMCallParams
  ): Promise<TransactionResult> {
    try {
      // Create the EVM call using ethers
      const transaction = {
        to: evmParams.target,
        data: evmParams.input,
        value: evmParams.value || BigInt(0),
        gasLimit: evmParams.gasLimit || BigInt(100000),
        maxFeePerGas: evmParams.maxFeePerGas || BigInt(1000000000)
      };
      // Encode the transaction data for the Polkadot API
      const callData = {
        type: "Ethereum",
        value: {
          type: "transact",
          value: {
            transaction: {
              value: transaction.value.toString(),
              input: transaction.data,
              to: transaction.to,
              gasLimit: transaction.gasLimit.toString(),
              maxFeePerGas: transaction.maxFeePerGas.toString()
            }
          }
        }
      };
      // Create the multisig call
      const multisigCall = this.api.tx.Multisig.as_multi({
        threshold: multisigParams.threshold,
        other_signatories: multisigParams.otherSignatories,
        maybe_timepoint: undefined,
        call: callData,
        max_weight: {
          ref_time: BigInt(1000000000),
          proof_size: BigInt(100000)
        }
      });

      // Sign and submit the transaction
      try {
        const result = await multisigCall.signAndSubmit(signer);
        return {
          status: "finalized",
          hash: result.txHash,
          events: result.events
        };
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to initiate multisig call:", error);
      throw error;
    }
  }

  /**
   * Approves a pending multisig transaction
   */
  private async approveMultisig(
    signer: PolkadotSigner,
    multisigParams: MultisigParams,
    timepoint: { height: number; index: number },
    callHash: string
  ): Promise<TransactionResult> {
    try {
      const approvalCall = this.api.tx.Multisig.approve_as_multi({
        threshold: multisigParams.threshold,
        other_signatories: multisigParams.otherSignatories,
        maybe_timepoint: timepoint,
        call_hash: Binary.fromHex(callHash),
        max_weight: {
          ref_time: BigInt(1000000000),
          proof_size: BigInt(100000)
        }
      });

      try {
        const result = await approvalCall.signAndSubmit(signer);
        return {
          status: "finalized",
          hash: result.txHash,
          events: result.events
        };
      } catch (error) {
        console.error("Failed to approve multisig:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to approve multisig:", error);
      throw error;
    }
  }

  /**
   * Explore available pallets and their methods
   */
  async explorePallets(): Promise<void> {
    try {
      const unsafeApi = this.client.getUnsafeApi();
      console.log("Available pallets:", Object.keys(unsafeApi.tx));

      // Log methods for each pallet
      Object.keys(unsafeApi.tx).forEach(pallet => {
        console.log(`\nMethods for ${pallet} pallet:`, Object.keys(unsafeApi.tx[pallet]));
      });
    } catch (error) {
      console.error("Failed to explore pallets:", error);
      throw error;
    }
  }

  /**
   * Destroys the client connection
   */
  destroy() {
    if (this.client) {
      this.client.destroy();
    }
  }
}
