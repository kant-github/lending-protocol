import MarketList from "@/components/MarketList";
import Navbar from "@/components/Navbar";
import StatsComponent from "@/components/StatsComponent";
import YourPositions from "@/components/YourPositions";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <StatsComponent />
      <YourPositions />
      <MarketList />
    </main>
  );
}
