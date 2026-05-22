// components/watch-along/WatchRoom.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { useWatchAlong, Room, Match } from "@/context/WatchAlongContext";
import Prediction from "@/src/components/WatchLobby/Prediction";
import FlashQuiz from "@/src/components/WatchLobby/Flashquiz";
import LiveChat from "@/src/components/WatchLobby/LiveChat";
import EmojiStorm from "@/src/components/WatchLobby/Emojistorm";
import VideoPlayer from "./VideoPlayer";
import ConfettiWrapper from "./ConfettiWrapper";
// Live camera feed via native getUserMedia API
import Link from "next/link";
import { Mic, MicOff, Video, VideoOff, MonitorUp, Maximize2, Minimize2, CircleDot } from "lucide-react";


const JitsiMeeting = dynamic(
    () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
    { ssr: false }
);

/* ── Jitsi PiP — Jitsi Meet External API SDK ── */
function LiveCameraFeed({ hostName, roomName, userRole, userName }: { hostName: string; roomName: string; userRole: string; userName: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiRef = useRef<any>(null);
    const [micOn, setMicOn] = useState(true);
    const [vidOn, setVidOn] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const isModerator = userRole === 'Host' || userRole === 'Co-Host' || userRole === 'Moderator';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleApiReady = (api: any) => {
        apiRef.current = api;
        
        // Listen to Jitsi's internal mute status changes and synchronize state
        api.addListener("audioMuteStatusChanged", (data: { muted: boolean }) => {
            setMicOn(!data.muted);
        });
        api.addListener("videoMuteStatusChanged", (data: { muted: boolean }) => {
            setVidOn(!data.muted);
        });
        api.addListener("recordingStatusChanged", (data: { on: boolean; mode: string }) => {
            setIsRecording(data.on);
        });
    };

    const toggleMic = useCallback(() => {
        if (apiRef.current) {
            apiRef.current.executeCommand('toggleAudio');
        }
    }, []);

    const toggleVid = useCallback(() => {
        if (apiRef.current) {
            apiRef.current.executeCommand('toggleVideo');
        }
    }, []);

    const toggleScreenShare = useCallback(() => {
        if (apiRef.current) {
            apiRef.current.executeCommand('toggleShareScreen');
        }
    }, []);

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <div className={`absolute transition-all overflow-hidden bg-[#000] shadow-2xl z-20 
            ${isExpanded 
                ? 'inset-0 w-full h-full rounded-none z-40' 
                : 'bottom-2.5 right-3 w-[140px] h-[95px] lg:w-[240px] lg:h-[160px] rounded-xl border border-white/20 hover:scale-105'
            }`}>
            {/* Jitsi SDK React component */}
            <JitsiMeeting
                domain="meet.uxexpert.in"
                roomName={roomName}
                configOverwrite={{
                    prejoinPageEnabled: false,
                    prejoinConfig: {
                        enabled: false,
                    },
                    welcomePage: {
                        disabled: true,
                    },
                    startWithAudioMuted: !isModerator,
                    startWithVideoMuted: !isModerator,
                    startSilent: !isModerator, // Crucial: puts viewers in spectator mode instantly
                    disableDeepLinking: true,
                    enableWelcomePage: false,
                    hideConferenceSubject: true,
                    hideConferenceTimer: true,
                    disableThirdPartyRequests: true,
                    p2p: { enabled: false },
                }}
                interfaceConfigOverwrite={{
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_POWERED_BY: false,
                    TOOLBAR_BUTTONS: isModerator 
                        ? ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'chat', 'settings', 'raisehand', 'videoquality', 'participants-pane', 'recording', 'select-background'] 
                        : [],
                    FILM_STRIP_MAX_HEIGHT: isModerator ? undefined : 0,
                    DISABLE_VIDEO_BACKGROUND: true,
                }}
                userInfo={{
                    displayName: userName || "Anonymous Viewer",
                    email: `${(userName || "viewer").toLowerCase().replace(/\s+/g, '')}@sportsfan360.com`,
                }}
                onApiReady={handleApiReady}
                getIFrameRef={(wrapperDiv: HTMLDivElement) => {
                    // Style the wrapper container to take full width and height
                    wrapperDiv.style.width = '100%';
                    wrapperDiv.style.height = '100%';
                    wrapperDiv.style.border = 'none';

                    // Style the dynamic Jitsi iframe inside the wrapper
                    const iframe = wrapperDiv.querySelector('iframe');
                    if (iframe) {
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.border = 'none';
                    }
                }}
            />

            {/* LIVE badge */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-30">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-green-400 font-bold">LIVE</span>
            </div>

            {/* Expand / Minimize toggle button (Available to everyone) */}
            <button
                onClick={toggleExpand}
                className="absolute top-1.5 left-1.5 w-6 h-6 lg:w-7 lg:h-7 rounded-md flex items-center justify-center bg-[#111]/80 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-all z-30"
                title={isExpanded ? "Minimize" : "Expand"}
            >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* Mic, Video, Screen Share & Record buttons (Host/Mods ONLY) */}
            {isModerator && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5 z-30 bg-[#111]/80 backdrop-blur-md px-1.5 py-1 rounded-lg border border-white/10">
                    <button
                        onClick={toggleMic}
                        className={`w-6 h-6 lg:w-7 lg:h-7 rounded-md flex items-center justify-center transition-all hover:scale-110 ${micOn ? "bg-white/20 text-white" : "bg-red-600 text-white"}`}
                        title="Toggle Microphone"
                    >
                        {micOn ? <Mic size={14} /> : <MicOff size={14} />}
                    </button>
                    <button
                        onClick={toggleVid}
                        className={`w-6 h-6 lg:w-7 lg:h-7 rounded-md flex items-center justify-center transition-all hover:scale-110 ${vidOn ? "bg-white/20 text-white" : "bg-red-600 text-white"}`}
                        title="Toggle Camera"
                    >
                        {vidOn ? <Video size={14} /> : <VideoOff size={14} />}
                    </button>
                    <button
                        onClick={toggleScreenShare}
                        className="w-6 h-6 lg:w-7 lg:h-7 rounded-md flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white transition-all hover:scale-110"
                        title="Share Screen"
                    >
                        <MonitorUp size={14} />
                    </button>
                </div>
            )}

            {/* Host name overlay */}
            <div className="absolute bottom-2 left-2 bg-[#111]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] lg:text-[11px] font-bold text-white border border-white/10 z-30">
                {hostName}
            </div>
        </div>
    );
}

const actionTabs: { id: 'prediction' | 'flashQuiz' | 'liveChat' | 'emojiStorm' | 'participants'; label: string }[] = [
    { id: 'prediction', label: 'Prediction' },
    { id: 'flashQuiz', label: 'Flash Quiz' },
    { id: 'liveChat', label: 'Live Chat' },
    { id: 'emojiStorm', label: 'Emoji Storm' },
    { id: 'participants', label: 'Participants' }
];

type Props = {
    room: Room;
    onBack: () => void;
};

function TabContent({
    activeTab,
    matchId,
    userName,
    userRole,
    room
}: {
    activeTab: string;
    matchId: string | undefined;
    userName: string | null;
    userRole: string;
    room: Room;
}) {
    const { updateRoom } = useWatchAlong();

    // Don't render if matchId is not available
    if (!matchId && activeTab !== 'participants') {
        return (
            <div className="w-full px-4 sm:px-6 py-3">
                <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500 text-sm">Waiting for match data...</p>
                </div>
            </div>
        );
    }

    switch (activeTab) {
        case 'prediction': return <Prediction matchId={matchId!} />;
        case 'flashQuiz': return <FlashQuiz matchId={matchId!} />;
        case 'liveChat': return <LiveChat matchId={matchId!} userRole={userRole} />;
        case 'emojiStorm': return <EmojiStorm matchId={matchId!} />;
        case 'participants': return (
            <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Participants
                </h2>
                <div className="flex flex-col gap-3">
                    {/* Current User */}
                    <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-xl border border-[#333]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
                                {userName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold">{userName} <span className="text-gray-500 font-normal">(You)</span></p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-pink-400 uppercase tracking-wide">{userRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Example Mock User for Host Demonstration */}
                    {userRole === 'Host' && (
                        <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-xl border border-[#333]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
                                    T
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">Test Viewer</p>
                                    <p className={`text-xs uppercase tracking-wide font-semibold ${room?.coHostUserId === "mock-cohost-id" ? "text-pink-400 font-extrabold animate-pulse" : "text-blue-400"}`}>
                                        {room?.coHostUserId === "mock-cohost-id" ? "Co-Host" : "Viewer"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                    {room?.coHostUserId === "mock-cohost-id" ? (
                                        <button 
                                            onClick={async () => {
                                                const formData = new FormData();
                                                formData.append("coHostUserId", "null");
                                                await updateRoom(room.id, formData);
                                            }}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-full transition-all"
                                        >
                                            Revoke Co-Host
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={async () => {
                                                const formData = new FormData();
                                                formData.append("coHostUserId", "mock-cohost-id");
                                                await updateRoom(room.id, formData);
                                            }}
                                            className="px-3 py-1 bg-[#222] hover:bg-[#333] text-white text-xs font-semibold rounded-full border border-[#444] transition-all"
                                        >
                                            Make Co-Host
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => alert("Simulation: User Test Viewer has been permanently banned from this Watchroom. Their WebSocket connection has been terminated.")}
                                        className="px-3 py-1 bg-[#222] hover:bg-red-600 hover:border-red-500 text-white text-xs font-semibold rounded-full border border-[#444] transition-all"
                                    >
                                        Kick
                                    </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
        default: return null;
    }
}

export default function WatchRoom({ room, onBack }: Props) {
    const { fetchMatchById, currentMatch } = useWatchAlong();
    const [liveMatch, setLiveMatch] = useState<Match | null>(null);
    const [isLoadingMatch, setIsLoadingMatch] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'prediction' | 'flashQuiz' | 'liveChat' | 'emojiStorm' | 'participants'>('liveChat');
    const { data: session, status } = useSession();
    const { user: authUser } = useAuth();
    
    // Auth and Roles
    const [userName, setUserName] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>("Viewer");

    // Confetti State
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const [confettiText, setConfettiText] = useState("");

    const triggerMoment = (momentType: string) => {
        setConfettiText(momentType);
        setConfettiTrigger(prev => prev + 1);
    };

    useEffect(() => {
        setIsMounted(true);
        
        const isUserLoggedIn = status === "authenticated" || !!authUser;
        const actualName = authUser?.name || session?.user?.name || "Anonymous";

        if (isUserLoggedIn) {
            setUserName(actualName);
            
            // ROLE LOGIC — Priority order:
            // 1. Real backend: check if session user ID matches room.hostUserId or coHostUserId
            // 2. Fallback: static demo room IDs
            const currentUserId = authUser?.userId || (session?.user as { userId?: string })?.userId || session?.user?.id;
            if (room.hostUserId && currentUserId) {
                if (currentUserId === room.hostUserId) {
                    setUserRole("Host");
                } else if (room.coHostUserId && currentUserId === room.coHostUserId) {
                    setUserRole("Co-Host");
                } else {
                    setUserRole("Viewer");
                }
            } else if (room.id === "abhinav-bindra" || room.id === "daily-standup") {
                setUserRole("Host");
            } else {
                setUserRole((actualName.toLowerCase() === room.name?.split(" ")[0].toLowerCase()) ? "Host" : "Viewer");
            }

            // TODO: TEMPORARY DEMO OVERRIDE FOR MORNING PRESENTATION (Everyone gets Host/Moderator permissions)
            setUserRole("Host");

            // Global Points System: Award points on join
            console.log(`[Global Points System] 🏆 50 points awarded to ${actualName} for joining!`);
        }
    }, [status, session, authUser, room.id, room.hostUserId, room.coHostUserId, room.name]);

    // Evaluate Role based on Room Data
    useEffect(() => {
        if (!room.hostUserId && userName && room?.name) {
            // Placeholder Logic: If their name matches the room name, they are the Host
            // In a real DB, you'd check if `userId === room.hostId`
            const hostFirstName = room.name.split(" ")[0].toLowerCase();
            if (userName.toLowerCase().includes(hostFirstName)) {
                setUserRole("Host");
            }
        }
        // TODO: TEMPORARY DEMO OVERRIDE FOR MORNING PRESENTATION (Everyone gets Host/Moderator permissions)
        setUserRole("Host");
    }, [userName, room?.name, room.hostUserId]);


    // Fetch match details when room has liveMatchId
    useEffect(() => {
        const loadMatch = async () => {
            if (room?.liveMatchId && !liveMatch) {
                setIsLoadingMatch(true);
                try {
                    await fetchMatchById(room.liveMatchId);
                } catch (error) {
                    console.error("Failed to fetch match:", error);
                } finally {
                    setIsLoadingMatch(false);
                }
            }
        };

        loadMatch();
    }, [room?.liveMatchId, fetchMatchById, liveMatch]);

    // Update local match state when currentMatch changes
    useEffect(() => {
        if (currentMatch?.id === room?.liveMatchId) {
            setLiveMatch(currentMatch);
        }
    }, [currentMatch, room?.liveMatchId]);

    // Get user initials for avatar
    const getUserInitials = (name: string) => {
        if (!name) return "??";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    // Format overs display
    const formatOvers = (overs: string) => {
        if (!overs) return "0.0 ov";
        return overs;
    };

    // Access Denied logic has been moved to PreJoinLobby.tsx

    // Show loading state while room is being loaded
    if (!room) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">
            <ConfettiWrapper trigger={confettiTrigger} text={confettiText} />

            {/* ── Shared header ── */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#222]">
                <Link href="/MainModules/WatchAlong">
                    <button
                        className="text-white hover:text-pink-500 transition cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div className="flex items-center gap-2">
                    {room.isLive && (
                        <span className="bg-pink-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                            LIVE
                        </span>
                    )}
                    <span className="text-sm font-bold">{room.name || "Watch Room"}</span>
                </div>
                <button className="text-gray-400 hover:text-white text-lg transition-colors">⊕</button>
            </div>

            {/* ── Score bar ── */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 border-b border-[#222]">
                {isLoadingMatch ? (
                    <>
                        <span className="text-sm text-gray-400">Loading match...</span>
                        <span className="text-[11px] text-gray-500">-</span>
                        <span className="text-[11px] text-gray-500">-</span>
                        <span className="text-sm text-gray-400">...</span>
                    </>
                ) : liveMatch ? (
                    <>
                        <span className="text-sm font-bold text-pink-500">
                            {liveMatch.team1?.name || "TBD"}&nbsp;{liveMatch.team1?.score || "0/0"}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {formatOvers(liveMatch.team1?.overs)}
                        </span>
                        <span className="text-[11px] text-gray-500">
                            {formatOvers(liveMatch.team2?.overs)}
                        </span>
                        <span className="text-sm font-bold text-blue-500">
                            {liveMatch.team2?.score || "0/0"}&nbsp;{liveMatch.team2?.name || "TBD"}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-sm font-bold text-pink-500">Waiting for match data...</span>
                        <span className="text-[11px] text-gray-500">-</span>
                        <span className="text-[11px] text-gray-500">-</span>
                        <span className="text-sm font-bold text-blue-400">...</span>
                    </>
                )}
            </div>

            <div className="flex flex-col lg:flex-row flex-1 min-h-0">

                {/* ── LEFT: video + action tabs ── */}
                <div className="flex flex-col lg:flex-1 lg:min-w-0">

                    {/* Video player */}
                    <div className="relative w-full aspect-video bg-[#1a0a14] overflow-hidden">
                        {liveMatch?.videoUrl ? (
                            <VideoPlayer
                                key={liveMatch.videoUrl}
                                videoUrl={liveMatch.videoUrl}
                                isLive={liveMatch.isLive}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-sm">No video stream available</p>
                                </div>
                            </div>
                        )}

                        {/* Team 1 label */}
                        {liveMatch && (
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-700 rounded-lg px-3 py-1.5 text-xs font-bold opacity-90 z-20">
                                {liveMatch.team1?.name || "Team 1"}
                            </div>
                        )}

                        {/* Team 2 label */}
                        {liveMatch && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                                <div className={`rounded-lg border-2 ${room.borderColor || "border-pink-500"} bg-[#111] px-2 py-1.5 flex items-center justify-center text-xs font-bold text-blue-400`}>
                                    {liveMatch.team2?.name?.slice(0, 3) || "T2"}
                                </div>
                            </div>
                        )}

                        {/* Live prediction pill */}
                        {/* <div className="absolute bottom-2.5 left-3 bg-black/80 rounded-full px-3 py-1 text-[11px] flex items-center gap-1.5 z-20">
                            <span className="text-pink-500 text-[8px]">▲</span>
                            <span className="text-gray-300">Live Prediction •</span>
                            <span className="text-pink-500 font-bold">00:19</span>
                        </div> */}

                        {/* Live Camera Feed PiP */}
                        {userName && (
                            <LiveCameraFeed 
                                hostName={room.name?.split(" ")[0] || "Expert"} 
                                roomName={room.id ? `Watch-${room.id}` : 'Sportsfan-Watchalong'} 
                                userRole={userRole}
                                userName={userName}
                            />
                        )}
                    </div>

                    {/* Action tabs */}
                    <div className="relative z-20 flex flex-col gap-2 px-4 sm:px-6 py-3 border-b border-[#222]">
                        
                        {/* Moments Panel (Host Only) */}
                        {(userRole === 'Host' || userRole === 'Moderator') && (
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 border-b border-white/5 mb-1">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">Trigger Moment:</span>
                                <button onClick={() => triggerMoment("Wicket")} className="flex-shrink-0 px-3 py-1 bg-pink-600 hover:bg-pink-500 rounded-full font-black text-white text-xs hover:scale-105 transition-transform shadow-[0_0_10px_rgba(219,39,119,0.5)]">🏏 WICKET</button>
                                <button onClick={() => triggerMoment("Six")} className="flex-shrink-0 px-3 py-1 bg-pink-600 hover:bg-pink-500 rounded-full font-black text-white text-xs hover:scale-105 transition-transform shadow-[0_0_10px_rgba(219,39,119,0.5)]">🏏 SIX</button>
                                <button onClick={() => triggerMoment("Goal")} className="flex-shrink-0 px-3 py-1 bg-pink-600 hover:bg-pink-500 rounded-full font-black text-white text-xs hover:scale-105 transition-transform shadow-[0_0_10px_rgba(219,39,119,0.5)]">⚽ GOAL</button>
                            </div>
                        )}

                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {actionTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${activeTab === tab.id
                                            ? "bg-pink-600 text-white"
                                            : "bg-[#222] text-gray-400 hover:bg-[#2a2a2a]"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Mobile/tablet: tab content inline below tabs */}
                    <div className="flex flex-col flex-1 min-h-0 lg:hidden">
                        <TabContent activeTab={activeTab} matchId={room.liveMatchId} userName={userName} userRole={userRole} room={room} />
                    </div>
                </div>

                {/* ── RIGHT: tab content sidebar — desktop only ── */}
                <div className="hidden lg:flex lg:flex-col lg:w-[360px] xl:w-[400px] border-l border-[#222]">
                    <TabContent activeTab={activeTab} matchId={room.liveMatchId} userName={userName} userRole={userRole} room={room} />
                </div>

            </div>
        </div>
    );
}