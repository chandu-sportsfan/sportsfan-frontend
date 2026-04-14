// import LiveRoomsCard from "@/src/components/HostDashboardComponents/Live&UpcomingRoms";
// import PerformanceOverview from "@/src/components/HostDashboardComponents/PerformanceOverview";
// import RecentActivity from "@/src/components/HostDashboardComponents/Recentactivity";



// export default function HostDashboard() {
//   return (
//    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
//   <PerformanceOverview />
//   <LiveRoomsCard />
//   <RecentActivity />
// </div>
//   );
// }


import LiveRoomsCard from "@/src/components/HostDashboardComponents/Live&UpcomingRoms";
import PerformanceOverview from "@/src/components/HostDashboardComponents/PerformanceOverview";
import RecentActivity from "@/src/components/HostDashboardComponents/Recentactivity";

export default function HostDashboard() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Top stats section */}
      <PerformanceOverview />

      {/* Side-by-side section */}
      <div className="px-4 sm:px-6 lg:px-8 lg:-mt-10 pb-10 flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Live & Upcoming Rooms — takes more space */}
        <div className="w-full lg:flex-[1.4]">
          <LiveRoomsCard />
        </div>

        {/* Recent Activity — narrower */}
        <div className="w-full lg:flex-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}