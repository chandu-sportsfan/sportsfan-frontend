"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface ConfettiWrapperProps {
    trigger: number;
    duration?: number;
    text?: string;
}

export default function ConfettiWrapper({ trigger, duration = 4000, text }: ConfettiWrapperProps) {
    const { width, height } = useWindowSize();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (trigger > 0) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [trigger, duration]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
            <Confetti 
                width={width} 
                height={height} 
                recycle={false} 
                numberOfPieces={500} 
                gravity={0.15}
            />
            {text && (
                <div className="absolute animate-bounce">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 uppercase tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                        {text}!
                    </h1>
                </div>
            )}
        </div>
    );
}
