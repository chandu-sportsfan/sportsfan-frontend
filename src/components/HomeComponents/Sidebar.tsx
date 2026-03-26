export default function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-pink-500/20 p-4">
      <h1 className="text-xl font-bold mb-6">SportsFan360</h1>

      {["Feed", "Live", "Fantasy", "Store", "Fan Zone"].map((item) => (
        <div key={item} className="mb-4 text-gray-400 hover:text-pink-500 cursor-pointer">
          {item}
        </div>
      ))}
    </div>
  );
}

