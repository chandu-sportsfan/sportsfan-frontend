"use client";



import ClubGamePlan from "@/src/components/ClubProfile-Component/ClubGamePlan";
import ClubProfileActions from "@/src/components/ClubProfile-Component/ClubProfileActions";
import ClubProfileHeader from "@/src/components/ClubProfile-Component/ClubProfileHeader";
import ClubSeasonStats from "@/src/components/ClubProfile-Component/ClubSeasonStats";
import { ClubProfile } from "@/types/ClubProfile";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockPlayer: ClubProfile = {
    name: "Royal Challengers Bengaluru",
    team: "RCB",
    battingStyle: "IPL Franchise",
    bowlingStyle: "Est.2008",
    avatar:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Virat_Kohli_in_2016.jpg/800px-Virat_Kohli_in_2016.jpg",
    about:
        "Royal Challengers Bengaluru, also known as RCB, are a professional Twenty20 cricket team based in Bengaluru, Karnataka, that competes in the Indian Premier League. Founded in 2008 by United Spirits, the team's home ground is M. Chinnaswamy Stadium.",
    stats: { runs: "6211", sr: "130.4", avg: "31.3" },
    overview: { captain: "Virat Kohli", coach: "Hershey", owner: "United Spirits", venue: "M. Chinnaswamy Stadium" },
    season: {
        year: "2025",
        wins: "12",
        losses: "6",
        points: "24",
        position: "2nd",
        matchesPlayed: "18",
        netRunRate: "+0.85",
        highestTotal: "200/3",
        lowestTotal: "120/10",       
        runs: "741",
        strikeRate: "154.70",
        average: "38.99",
        fifties: 4,
        hundreds: 1,
        highestScore: "113*",
        fours: 64,
        sixes: 38,
        award: "Orange Cap Winner",
        awardSub: "Most runs in IPL 2024",
    },
    insights: [
        {
            title: "IPL Legend",
            description:
                "Only player to cross 8000 runs in IPL history. Holds the record for most runs in a single season (973 in 2016) and has won the Orange Cap twice.",
        },
    ],
    strengths: [
        "Exceptional consistency in run-scoring",
        "Outstanding under pressure situations",
        "Strong against pace and spin bowling",
        "Fitness and athleticism on the field",
    ],
    media: [
        {
            title: "Virat Kohli's Century Highlights",
            views: "2.4M",
            time: "2h ago",
            thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80",
        },
        {
            title: "Best Moments from RCB",
            views: "1.8M",
            time: "5h ago",
            thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80",
        },
        {
            title: "Top 10 Sixes – IPL 2025",
            views: "980K",
            time: "1d ago",
            thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80",
        },
        {
            title: "RCB vs MI – Match Recap",
            views: "3.1M",
            time: "2d ago",
            thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        },
    ],
};

//  Page 
export default function PlayerProfilePage() {
    return (
        <div className="min-h-screen bg-[#111111] font-sans">

            {/* ── Sticky Top Nav ── */}
            <div className="sticky top-0 z-50 flex items-center px-4 md:px-8 lg:px-12 py-3.5 bg-[#111111]/90 backdrop-blur-md border-b border-[#1f1f1f]">
                <button className="bg-transparent border-0 p-0 cursor-pointer text-[#e0e0e0] flex items-center hover:text-white transition-colors"
                    onClick={() => window.history.back()}>
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
                    </svg>
                </button>
                <span className="flex-1 text-center text-[17px] md:text-xl font-bold text-white tracking-tight">
                    Player Profile
                </span>
                <div className="w-[22px]" />
            </div>

            {/*  Content wrapper  */}
            <div className="w-full max-w-[1280px] mx-auto">


                {/* ── Mobile + Tablet: single column ── */}
                <div className="block lg:hidden">
                    <div className="max-w-[640px] mx-auto">
                        <ClubProfileHeader club={mockPlayer} />
                        <ClubProfileActions club={mockPlayer} />
                        <ClubSeasonStats club={mockPlayer} />
                        <ClubGamePlan club={mockPlayer} />
                    </div>
                </div>

                {/* ── Desktop: two-column layout ── */}
                <div className="hidden lg:flex lg:items-start lg:gap-6 xl:gap-8 px-8 xl:px-12 py-6">

                    {/* Left column — sticky sidebar */}
                    <div className="sticky top-[65px] w-[360px] xl:w-[400px] shrink-0 flex flex-col overflow-y-auto max-h-[calc(100vh-65px)] [scrollbar-width:none]">
                        <ClubProfileHeader club={mockPlayer} />
                        <ClubProfileActions club={mockPlayer} />
                    </div>

                    {/* Right column — scrollable content */}
                    <div className="flex-1 min-w-0 flex flex-col pb-10">
                        <ClubSeasonStats club={mockPlayer} />
                        <ClubGamePlan club={mockPlayer} />
                    </div>

                </div>
            </div>
        </div>
    );
}