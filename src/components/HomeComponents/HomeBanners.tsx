"use client";

const banners = [
  {
    id: 1,
    title: "TATA IPL T20 2026",
    subtitle: "Experience cricket's biggest league",
    image: "https://images.unsplash.com/photo-1505842465776-3a8c9c90b0f1",
  },
  {
    id: 2,
    title: "Watch Along",
    subtitle: "With Ravi Chandra Ashwin",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
  },
  {
    id: 3,
    title: "Dream Panel",
    subtitle: "Special Interview Virat Kohli",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
  },
];

export default function HomeBanners() {
  return (
    <div className="px-4 mt-4">
      {/* MOBILE → horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar lg:hidden">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-[280px] h-40 rounded-xl overflow-hidden relative flex-shrink-0"
          >
            <img
              src={banner.image}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
              <h2 className="font-semibold text-sm">{banner.title}</h2>
              <p className="text-xs text-gray-300">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP → grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="h-48 rounded-xl overflow-hidden relative"
          >
            <img
              src={banner.image}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
              <h2 className="font-semibold text-lg">{banner.title}</h2>
              <p className="text-sm text-gray-300">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}