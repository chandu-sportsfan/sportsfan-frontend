import AudioDropComponent from "@/src/components/AudioDropComponent/AudioDropComponent";


export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-x-hidden">
       <div className="w-full overflow-x-hidden">
                 <AudioDropComponent />
               </div>
               
        </div>
    )
}