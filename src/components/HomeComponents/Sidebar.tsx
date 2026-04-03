// components/HomeComponents/Sidebar.tsx
export default function Sidebar() {
  return (
    <div className="absolute inset-0 w-full h-full border-r border-pink-500/20 p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-6">SportsFan360</h1>

      {["Feed", "Watch Along", "Fan Battle", "Store", "Fan Zone"].map((item) => (
        <div key={item} className="mb-4 text-gray-400 hover:text-pink-500 cursor-pointer">
          {item}
        </div>
      ))}
    </div>
  );
}