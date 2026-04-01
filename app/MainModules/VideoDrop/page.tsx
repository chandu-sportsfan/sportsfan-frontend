import VideoDropComponent from "@/src/components/VideoDropComponent/VideoDropComponent";


export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-x-hidden">
       <div className="w-full overflow-x-hidden">
                 <VideoDropComponent />
               </div>
               
        </div>
    )
}