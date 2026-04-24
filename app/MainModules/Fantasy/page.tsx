import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circle Cricket PRO - Play Cricket Game | SportsFan360",
  description: "Play Circle Cricket PRO - an interactive cricket game",
};

export default function CircleCricketPage() {
  return (
    <div className="min-h-screen bg-[#05080f]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl p-0.5">
          <div className="bg-[#05080f] rounded-xl overflow-hidden">
            <iframe
              src="/circle-cricket-game.html"
              title="Circle Cricket PRO"
              className="w-full h-[800px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}