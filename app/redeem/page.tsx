"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, RefreshCw } from "lucide-react"

export default function Redeem() {
  const [fdaoAmount, setFdaoAmount] = useState<string>("0")
  const [fusdAmount, setFusdAmount] = useState<string>("0")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")

  const handleFdaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFdaoAmount(value)
    // Calculate FUSD amount (1 FDAO = 2 FUSD in this example)
    const fusd = Number.parseFloat(value) * 2 || 0
    setFusdAmount(fusd.toString())
  }

  const handleRedeem = () => {
    setIsRedeeming(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsRedeeming(false)
      setIsSuccess(true)
      setTransactionHash("0x" + Math.random().toString(16).substring(2, 42))
    }, 2000)
  }

  const handleReset = () => {
    setIsSuccess(false)
    setFdaoAmount("0")
    setFusdAmount("0")
  }

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-4 mb-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="text-white font-semibold text-xl flex items-center">
                <div className="w-8 h-8 mr-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9H7V21H3V9Z" fill="white" />
                    <path d="M10 3H21V7H10V3Z" fill="white" />
                    <path d="M10 10H21V21H17V14H10V10Z" fill="white" />
                  </svg>
                </div>
                FarmDAO
              </div>
            </Link>
            <div className="bg-neutral-700 text-neutral-400 px-4 py-2 rounded-full text-xs">
              DEFI
              <br />
              INSURANCE
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="bg-neutral-700 text-white px-6 py-3 rounded-full">
              Dashboard
            </Link>
            <Link href="/buy-insurance" className="border border-white text-white px-6 py-3 rounded-full">
              Buy Insurance
            </Link>
            <Link href="/my-policies" className="border border-white text-white px-6 py-3 rounded-full">
              My Policies
            </Link>
            <Link href="/dispute-center" className="border border-white text-white px-6 py-3 rounded-full">
              Dispute Center
            </Link>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif mb-4">Redeem FDAO</h1>
          <p className="text-neutral-400">Convert your FDAO governance tokens to FUSD stablecoins.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSuccess ? (
            <div className="bg-neutral-900 rounded-3xl p-8 text-center">
              <div className="bg-green-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Check className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Redemption Successful!</h2>
              <p className="text-xl mb-6">
                You have successfully redeemed <span className="text-green-400 font-bold">{fdaoAmount} FDAO</span> for{" "}
                <span className="text-green-400 font-bold">{fusdAmount} FUSD</span>
              </p>

              <div className="bg-neutral-800 rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-neutral-400 mb-2">Transaction Hash</p>
                <p className="font-mono text-sm break-all">{transactionHash}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                >
                  Redeem More
                </button>
                <Link
                  href="/dashboard"
                  className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-full inline-flex items-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">Redeem FDAO for FUSD</h2>

              <div className="space-y-8">
                <div>
                  <label htmlFor="fdao-amount" className="block text-xl mb-3">
                    FDAO Amount
                  </label>
                  <div className="relative">
                    <input
                      id="fdao-amount"
                      type="number"
                      value={fdaoAmount}
                      onChange={handleFdaoChange}
                      className="w-full bg-neutral-800 border-0 rounded-xl p-4 text-xl h-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 text-xl">
                      FDAO
                    </div>
                  </div>
                  <p className="text-neutral-400 mt-2">Available: 75.50 FDAO</p>
                </div>

                <div className="flex justify-center my-6">
                  <div className="bg-neutral-700 p-4 rounded-full">
                    <ArrowRight className="h-6 w-6 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="fusd-amount" className="block text-xl mb-3">
                    FUSD Amount (Estimated)
                  </label>
                  <div className="relative">
                    <input
                      id="fusd-amount"
                      type="number"
                      value={fusdAmount}
                      disabled
                      className="w-full bg-neutral-800 border-0 rounded-xl p-4 text-xl h-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 text-xl">
                      FUSD
                    </div>
                  </div>
                  <p className="text-neutral-400 mt-2">Exchange Rate: 1 FDAO = 2 FUSD</p>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={handleRedeem}
                  disabled={isRedeeming || Number.parseFloat(fdaoAmount) <= 0}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white text-xl py-4 rounded-xl ${
                    isRedeeming || Number.parseFloat(fdaoAmount) <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isRedeeming ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 inline-block animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Redeem FDAO"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
