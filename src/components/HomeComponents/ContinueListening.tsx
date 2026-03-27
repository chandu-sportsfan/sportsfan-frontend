"use client";

type Item = {
    id: number;
    title: string;
    subtitle: string;
    image: string;
};

const mockData: Item[] = [
    {
        id: 1,
        title: "Rohit Sharma",
        subtitle: "Captaincy Masterclass",
        image: "https://images.unsplash.com/photo-1505842465776-3a8c9c90b0f1",
    },
    {
        id: 2,
        title: "Virat Kohli",
        subtitle: "Chasing Legends",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },
    {
        id: 3,
        title: "MS Dhoni",
        subtitle: "Finisher Stories",
        image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
    },
];

export default function ContinueListening() {
    return (
        <div className="px-4 py-2 mt-2">
            {/* Title */}
            <h2 className="text-pink-500 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                Continue Listening
            </h2>

            {/* Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {mockData.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[260px] sm:min-w-[300px] md:min-w-[300px] lg:min-w-[300px] h-[72px] sm:h-[72px] md:h-[92px] bg-[background:#1A2B3A] relative rounded-lg overflow-hidden flex-shrink-0"
                    >

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center justify-center gap-8 px-5">
                            {/* Play Button */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center">
                                ▶
                            </div>
                            {/* Text */}
                            <div>
                                <h3 className="text-[#C9115F] font-semibold text-sm sm:text-base md:text-lg">
                                    {item.title}
                                </h3>
                                <p className="text-gray-300 text-xs sm:text-sm">
                                    {item.subtitle}
                                </p>
                            </div>


                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}