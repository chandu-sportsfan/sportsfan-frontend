import FullPlaylist from "@/src/components/MatchesDropComponent/DropScreen";
import { Suspense } from "react";


export default function MatchesDropContent() {


    return (
        <>
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d10]" />}>
                <FullPlaylist />
            </Suspense>
        </>
    )
}