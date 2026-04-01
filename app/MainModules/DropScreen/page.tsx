import DropScreenComponent from "@/src/components/DropScreenComponent/DropScreenComponent";


export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-x-hidden">
       <div className="w-full overflow-x-hidden">
                 <DropScreenComponent />
               </div>
               
        </div>
    )
}