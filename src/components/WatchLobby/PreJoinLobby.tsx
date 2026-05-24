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

    const [selectedRole, setSelectedRole] = useState<'Host' | 'Viewer'>('Viewer');

    useEffect(() => {
        setIsMounted(true);
        const name = authUser?.name || session?.user?.name;
        if (name) {
            setUserName(name);
        }
    }, [authUser, session]);

    useEffect(() => {
        if (!userName) return;
        let defaultRole: 'Host' | 'Viewer' = 'Viewer';
        const currentUserId = authUser?.userId || (session?.user as { userId?: string })?.userId || session?.user?.id;
        if (room?.hostUserId && currentUserId) {
            if (currentUserId === room.hostUserId) {
                defaultRole = 'Host';
            } else if (room?.coHostUserId && currentUserId === room.coHostUserId) {
                defaultRole = 'Host';
            }
        } else if (room?.id === 'abhinav-bindra' || room?.id === 'daily-standup') {
            defaultRole = 'Host';
        } else {
            defaultRole = (userName.toLowerCase() === room?.name?.split(" ")[0].toLowerCase()) ? 'Host' : 'Viewer';
        }
        setSelectedRole(defaultRole);
    }, [userName, room, authUser, session]);

    const userRole = selectedRole;
    const isUserLoggedIn = isAuthenticated || status === "authenticated";

    if (!isMounted) return null;

    // Show a loading screen while auth resolves instead of blank page
    if (status === "loading" || authLoading) {
        return (
            <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                    <p className="text-gray-400 text-sm animate-pulse">Loading watch room...</p>
                </div>
            </div>
        );
    }

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

                {/* User Role Box with Visual Selector Tab */}
                <div className="w-full bg-[#222] border border-[#444] rounded-xl p-4 mb-8 relative overflow-hidden">
                    {userRole === 'Host' && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/10 rounded-bl-full pointer-events-none"></div>
                    )}
                    <p className="text-gray-400 text-sm mb-1 text-center font-medium">Select Perspective</p>
                    
                    {/* Visual Role Tabs */}
                    <div className="flex gap-2.5 bg-black/45 p-1 rounded-xl border border-white/5 mb-4 mt-2">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('Viewer')}
                            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                                selectedRole === 'Viewer' 
                                    ? 'bg-[#2a2a2e] text-blue-400 border border-blue-500/30 shadow-[0_2px_8px_rgba(59,130,246,0.15)]' 
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            👥 Viewer
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('Host')}
                            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                                selectedRole === 'Host' 
                                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_2px_8px_rgba(219,39,119,0.3)]' 
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            🎙️ Host / Expert
                        </button>
                    </div>

                    <p className="text-gray-500 text-[11px] mb-1 text-center uppercase tracking-widest font-black">Joining As</p>
                    <p className="text-white font-black text-lg text-center mb-4">{userName}</p>
                    
                    <div className="flex items-center justify-between border-t border-[#333] pt-4 mt-2">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Assigned Role:</span>
                        <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${userRole === 'Host' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'}`}>
                            {userRole}
                        </span>
                    </div>
                    
                    {userRole === 'Viewer' ? (
                        <p className="text-xs text-gray-500 text-center mt-3 font-semibold">Spectator Mode Enabled (Mic/Camera off)</p>
                    ) : (
                        <p className="text-xs text-pink-400/80 text-center mt-3 font-semibold animate-pulse">Full Sportscaster Panel Enabled.</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-[#333] flex justify-center">
                        <button 
                            onClick={() => signOut()}
                            className="text-xs text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-white transition-all font-semibold"
                        >
                            Not {userName}? Log out
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        sessionStorage.setItem("demo_user_role", selectedRole);
                        onJoin();
                    }}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black py-4 rounded-xl shadow-[0_4px_15px_rgba(219,39,119,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 mb-4 uppercase tracking-widest text-sm"
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
