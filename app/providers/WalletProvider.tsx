"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { toast } from "sonner";

interface WalletContextType {
  currentAccount: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
}

interface WalletState {
  currentAccount: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  isLoading: boolean;
}

type WalletAction =
  | { type: "SET_PROVIDER"; payload: ethers.BrowserProvider }
  | { type: "SET_ACCOUNT"; payload: string | null }
  | { type: "SET_CONTRACT"; payload: ethers.Contract | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_STATE" };

const initialState: WalletState = {
  currentAccount: null,
  provider: null,
  contract: null,
  isLoading: false,
};

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case "SET_PROVIDER":
      return { ...state, provider: action.payload };
    case "SET_ACCOUNT":
      return { ...state, currentAccount: action.payload };
    case "SET_CONTRACT":
      return { ...state, contract: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

const WalletContext = createContext<WalletContextType>({
  ...initialState,
  connectWallet: async () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: accounts.length > 0 ? accounts[0] : null,
    });
  }, []);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          dispatch({ type: "SET_PROVIDER", payload: provider });

          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            dispatch({
              type: "SET_ACCOUNT",
              payload: accounts[0].address,
            });
          }

          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", handleChainChanged);
        } else {
          toast.error("Please install MetaMask to use this app");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to initialize wallet connection");
      }
    };

    initialize();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to connect");
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      dispatch({ type: "SET_PROVIDER", payload: provider });
      dispatch({ type: "SET_ACCOUNT", payload: accounts[0] });

      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      connectWallet,
    }),
    [state, connectWallet]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => useContext(WalletContext);
