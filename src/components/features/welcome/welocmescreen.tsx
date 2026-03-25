"use client";

import Image from "next/image";
import Link from "next/link";

export default function WelcomeCard() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center 
      bg-gradient-to-b from-[#3a0000] via-black to-[#120000] relative">

      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-orange-600/20 pointer-events-none" />

      <div className="flex flex-col items-center justify-between h-full w-full max-w-md px-6 py-1 lg:-mt-25 text-center z-10">

        {/* Top Content */}
        <div className="flex flex-col items-center">

          {/* Logo */}
          <div className="mb-18 lg:mb-6">
            <Image
              src="/images/Logo.png"
              alt="logo"
              width={70}
              height={70}
              className="w-[80.63pxpx] h-[96px] lg:w-[100px] lg:h-[120px] object-fit"
            />
          </div>

          {/* Text */}
          <p className="text-gray-300 text-[25px] lg:text-[32px] mb-6">Welcome to</p>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-14">
            SPORTSFAN360
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-xs mb-6">
            Watch, play, and chat with your tribe.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="w-full">

          {/* Button */}
          <Link href="/auth/login">
         
          <button className="w-full bg-gray-200 text-black py-3 rounded-full font-bold hover:bg-white transition cursor-pointer">
            Start
          </button>
          <button className="w-full text-white mt-4 py-3 border rounded-full font-medium hover:bg-black transition cursor-pointer">
            Use as Guest
          </button>

           </Link>

          {/* Footer */}
          <div className="text-xs text-gray-400 mt-6">
            <span className="cursor-pointer hover:text-white">
              Privacy Policy
            </span>
            <span className="mx-2">|</span>
            <span className="cursor-pointer hover:text-white">
              Terms & Conditions
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}