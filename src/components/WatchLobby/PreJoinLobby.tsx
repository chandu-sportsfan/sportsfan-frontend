"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuth } from '@/context/AuthContext';

import { Room } from '@/context/WatchAlongContext';

interface PreJoinLobbyProps {
  room: Room;
  onJoin: () => void;
  onBack: () => void;
}

export default function PreJoinLobby({ room, onJoin, onBack }: PreJoinLobbyProps) {
    const { data: session, status } = useSession();
    const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const name = authUser?.name || session?.user?.name;
        if (name) {
            setUserName(name);
        }
    }, [authUser, session]);

    let userRole = 'Viewer';
    if (userName) {
        const currentUserId = authUser?.userId || (session?.user as { userId?: string })?.userId || session?.user?.id;
        if (room?.hostUserId && currentUserId) {
            // Real backend: match session user ID to room creator
            if (currentUserId === room.hostUserId) {
                userRole = 'Host';
            } else if (room?.coHostUserId && currentUserId === room.coHostUserId) {
                userRole = 'Co-Host';
            } else {
                userRole = 'Viewer';
            }
        } else if (room?.id === 'abhinav-bindra' || room?.id === 'daily-standup') {
            // Fallback: static demo rooms
            userRole = 'Host';
        } else {
            userRole = (userName.toLowerCase() === room?.name?.split(" ")[0].toLowerCase()) ? 'Host' : 'Viewer';
        }
    }

    // TODO: TEMPORARY DEMO OVERRIDE FOR MORNING PRESENTATION (Everyone gets Host/Moderator permissions)
    userRole = 'Host';

    const isUserLoggedIn = isAuthenticated || status === "authenticated";

    if (!isMounted || status === "loading" || authLoading) return null;

    if (!isUserLoggedIn) {
        return (
            <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white px-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                    <span className="text-2xl font-bold">!</span>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-center">Authentication Required</h1>
                <p className="text-gray-400 mb-6 text-center max-w-sm">Guest users are not allowed to join this broadcast. Please complete the onboarding process.</p>
                
                <div className="flex flex-col gap-3 w-full max-w-xs bg-[#1a1a1a] p-6 rounded-xl border border-[#333]">
                    <button 
                        onClick={() => signIn('google')}
                        className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                        Sign in with Google
                    </button>
                    <button onClick={onBack} className="w-full text-gray-400 hover:text-white font-medium py-2 transition-colors mt-2 text-sm">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white relative px-4 overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 w-full max-w-md shadow-2xl z-10 flex flex-col items-center">
                
                {/* Room Info */}
                <div className="w-24 h-24 rounded-full border-4 border-[#333] overflow-hidden mb-4 relative flex items-center justify-center bg-black shadow-[0_0_20px_rgba(219,39,119,0.2)]">
                    {room?.displayPicture ? (
                        <Image src={room.displayPicture} alt={room.name || "Host"} fill className="object-cover" />
                    ) : (
                        <span className="text-4xl font-bold text-gray-500">{room?.name?.charAt(0) || "R"}</span>
                    )}
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-2 text-center">{room?.name || "Live Room"}</h1>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${room?.badgeColor || 'bg-gray-600'} text-white mb-8 shadow-lg`}>
                    {room?.badge || 'Live Broadcast'}
                </div>

                {/* User Role Box */}
                <div className="w-full bg-[#222] border border-[#444] rounded-xl p-4 mb-8 relative overflow-hidden">
                    {userRole === 'Host' && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/10 rounded-bl-full pointer-events-none"></div>
                    )}
                    <p className="text-gray-400 text-sm mb-1 text-center">Joining As</p>
                    <p className="text-white font-bold text-lg text-center mb-4">{userName}</p>
                    
                    <div className="flex items-center justify-between border-t border-[#333] pt-4 mt-2">
                        <span className="text-gray-400 text-sm">Assigned Role:</span>
                        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${userRole === 'Host' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'}`}>
                            {userRole}
                        </span>
                    </div>
                    
                    {userRole === 'Viewer' ? (
                        <p className="text-xs text-gray-500 text-center mt-3">Spectator Mode Enabled (Mic/Camera off)</p>
                    ) : (
                        <p className="text-xs text-pink-400/80 text-center mt-3">You have full broadcasting controls.</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-[#333] flex justify-center">
                        <button 
                            onClick={() => signOut()}
                            className="text-xs text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white transition-all"
                        >
                            Not {userName}? Log out of Google
                        </button>
                    </div>
                </div>

                <button 
                    onClick={onJoin}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(219,39,119,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 mb-4"
                >
                    Join Broadcast
                </button>
                
                <button 
                    onClick={onBack}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
