import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Send, Sun } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-800 text-white">
      <div className="h-screen overflow-auto bg-[#1a1a1a]">
        <div className="max-w-[1920px] mx-auto">
          {/* Hero Section */}
          <div className="mb-16 relative mt-8">
            <div className="max-w-5xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight animate-fade-in">
                Decentralized
                <span className="relative mx-4">
                  <span className="relative z-10">insurance</span>
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-green-900 opacity-20 z-0 animate-pulse-slow"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>
                <br />
                <span className="inline-block bg-green-200 text-green-900 px-6 py-2 rounded-full my-2 hover:bg-green-300 transition-colors duration-300">
                  platform
                </span>{" "}
                for{" "}
                <span className="text-green-400 relative group">
                  farmers
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                </span>
                <br />
                to protect their crops
              </h1>
            </div>

            {/* Free Delivery Badge */}
            <div className="absolute right-20 top-1/3 md:top-1/2 animate-float">
              <div className="relative">
                <div className="text-green-400 border border-green-400 rounded-full px-4 py-1 text-sm rotate-6 hover:rotate-0 transition-transform duration-300">
                  AUTOMATIC PAYOUTS
                </div>
                <div className="absolute -bottom-8 -left-4 bg-green-900 p-3 rounded-full animate-bounce-slow">
                  <Send size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Curved Arrow */}
            <div className="absolute right-0 top-0 w-40 h-40 text-green-400 opacity-30 animate-draw-arrow">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 90 C 30 30, 70 30, 90 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="path"
                />
              </svg>
            </div>
          </div>

          {/* Stats and Navigation */}
          <div className="flex flex-wrap justify-between items-center mb-16 gap-6">
            <div className="bg-white text-black rounded-full pl-2 pr-6 py-1 flex items-center group hover:bg-green-100 transition-colors duration-300">
              <div className="bg-black text-white rounded-full p-2 mr-2 group-hover:bg-green-600 transition-colors duration-300">
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>
              <span className="text-xl font-bold mr-2 group-hover:text-green-800 transition-colors duration-300">
                5000+
              </span>
              <span className="text-xs uppercase">
                Farmers protected by our platform
              </span>

              <Link
                href="/dashboard"
                className="bg-black text-white rounded-full px-4 py-1 ml-2 group-hover:bg-green-600 transition-colors duration-300"
              >
                Join
              </Link>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
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
            </div>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 - Logo */}
            <div className="bg-green-200 rounded-3xl p-6 aspect-square relative overflow-hidden group hover:bg-green-300 transition-all duration-500 cursor-pointer">
              <div className="absolute bottom-0 right-0 p-4 text-xs text-green-900 font-semibold rotate-90 origin-bottom-right">
                FarmDAO
              </div>
              <div className="w-40 h-40 bg-green-300 rounded-full absolute -bottom-20 -right-20 group-hover:bg-green-400 transition-all duration-500"></div>
              <div className="text-green-900 text-8xl font-bold absolute top-10 left-10 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 9H7V21H3V9Z" fill="currentColor" />
                  <path d="M10 3H21V7H10V3Z" fill="currentColor" />
                  <path d="M10 10H21V21H17V14H10V10Z" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Card 2 - Farm Image */}
            <div className="bg-neutral-200 rounded-3xl overflow-hidden aspect-square relative group">
              <Image
                src="/patchwork-fields.png"
                alt="Farm fields aerial view"
                width={400}
                height={400}
                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-b from-transparent to-black/50">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-2 transition-all duration-500">
                  Blockchain-powered/
                  <br />
                  weather-based payouts.
                </div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-12 bg-white rounded-full opacity-70 transform transition-transform duration-500"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 - Mission */}
            <div className="bg-green-200 rounded-3xl p-6 aspect-square relative overflow-hidden group hover:bg-green-300 transition-all duration-500">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <svg
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin-slow"
                >
                  <path
                    d="M0,50 C0,50 50,0 100,50 C100,50 50,100 0,50 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M10,50 C10,50 50,10 90,50 C90,50 50,90 10,50 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M20,50 C20,50 50,20 80,50 C80,50 50,80 20,50 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="flex flex-col h-full">
                <div className="flex gap-4 mb-4">
                  <Sun className="text-green-900 hover:rotate-90 transition-transform duration-500 cursor-pointer" />
                  <Globe className="text-green-900 hover:rotate-180 transition-transform duration-500 cursor-pointer" />
                </div>
                <ArrowRight className="text-green-900 mb-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                <div className="text-green-900 text-xl mt-auto transform group-hover:translate-y-2 transition-transform duration-500">
                  Our mission is to make crop insurance accessible to all
                  farmers through decentralized technology.
                </div>
              </div>
            </div>

            {/* Card 4 - Blockchain */}
            <div className="bg-neutral-200 rounded-3xl overflow-hidden aspect-square relative group cursor-pointer">
              <Image
                src="/blockchain-farm-traceability.png"
                alt="Blockchain technology"
                width={400}
                height={400}
                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white transform group-hover:scale-125 transition-transform duration-500">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-pulse-slow"
                  >
                    <path
                      d="M2 12C2 8.13 5.13 5 9 5H15C18.87 5 22 8.13 22 12C22 15.87 18.87 19 15 19H9C5.13 19 2 15.87 2 12Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M9 12C9 13.66 7.66 15 6 15C4.34 15 3 13.66 3 12C3 10.34 4.34 9 6 9C7.66 9 9 10.34 9 12Z"
                      fill="white"
                      className="animate-pulse"
                    />
                    <path
                      d="M15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12Z"
                      fill="white"
                      className="animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                    <path
                      d="M21 12C21 13.66 19.66 15 18 15C16.34 15 15 13.66 15 12C15 10.34 16.34 9 18 9C19.66 9 21 10.34 21 12Z"
                      fill="white"
                      className="animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
