"use client";

interface LiveChatProps {
    matchId: string;
    userRole: string;
}

export default function LiveChat({ matchId, userRole }: LiveChatProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 text-sm h-full min-h-0 bg-[#0e0e10]">
            <span>💬 Live Chat is temporarily disabled to optimize performance.</span>
        </div>
    );
}