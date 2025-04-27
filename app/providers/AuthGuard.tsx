"use client";

import { ReactNode } from "react";
import { useWallet } from "./WalletProvider";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected } = useWallet();

  // You can add your auth logic here if needed
  // For example, redirect to login page if not connected
  // const router = useRouter();
  // if (!isConnected) {
  //   router.push('/connect');
  // }

  return <>{children}</>;
}
