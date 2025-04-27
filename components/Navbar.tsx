"use client";

import Link from "next/link";
import { useWallet } from "@/app/providers/WalletProvider";
import { Globe } from "lucide-react";
import { memo, useMemo } from "react";

// Memoize the logo component since it never changes
const Logo = memo(() => (
  <div className="flex items-center group">
    <div className="text-white font-semibold text-xl flex items-center">
      <div className="w-8 h-8 mr-2 transition-transform duration-500 group-hover:rotate-90">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 9H7V21H3V9Z"
            fill="white"
            className="transition-all duration-500 group-hover:fill-green-400"
          />
          <path
            d="M10 3H21V7H10V3Z"
            fill="white"
            className="transition-all duration-500 group-hover:fill-green-400"
          />
          <path
            d="M10 10H21V21H17V14H10V10Z"
            fill="white"
            className="transition-all duration-500 group-hover:fill-green-400"
          />
        </svg>
      </div>
      <span className="relative">
        FarmDAO
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
      </span>
    </div>
  </div>
));
Logo.displayName = "Logo";

// Memoize the navigation links since they don't depend on props
const NavigationLinks = memo(() => (
  <>
    <Link
      href="/dashboard"
      className="bg-neutral-700 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-neutral-600 transition-colors duration-300 group"
    >
      <div className="animate-spin">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="relative">
        Dashboard
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
    <Link
      href="/buy-insurance"
      className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
    >
      Buy Insurance
    </Link>
    <Link
      href="/my-policies"
      className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
    >
      My Policies
    </Link>
    <Link
      href="/dispute-center"
      className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
    >
      Dispute Center
    </Link>
  </>
));
NavigationLinks.displayName = "NavigationLinks";

// Memoize the wallet button component
const WalletButton = memo(
  ({
    currentAccount,
    connectWallet,
    isLoading,
  }: {
    currentAccount: string | null;
    connectWallet: () => Promise<void>;
    isLoading: boolean;
  }) => {
    if (currentAccount) {
      return (
        <div className="flex gap-2">
          <button className="bg-neutral-700 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="bg-green-600 text-white px-6 py-3 rounded-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10">
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </span>
        <span className="absolute inset-0 bg-green-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
      </button>
    );
  }
);
WalletButton.displayName = "WalletButton";

// Main Navbar component wrapped in memo
const Navbar = memo(function Navbar() {
  const { currentAccount, connectWallet, isLoading } = useWallet();

  // Memoize wallet button props
  const walletButtonProps = useMemo(
    () => ({
      currentAccount,
      connectWallet,
      isLoading,
    }),
    [currentAccount, connectWallet, isLoading]
  );

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 mb-16">
      <div className="flex items-center gap-4">
        <Logo />
        <div className="bg-neutral-700 text-neutral-400 px-4 py-2 rounded-full text-xs">
          DEFI
          <br />
          INSURANCE
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NavigationLinks />
        <WalletButton {...walletButtonProps} />
      </div>
    </nav>
  );
});

export default Navbar;
