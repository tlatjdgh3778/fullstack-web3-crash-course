
import AirdropForm from "@/components/AirdropForm";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              TSender
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            가장 가스 효율적인 ERC20 토큰 에어드롭 플랫폼
          </p>
        </div>
        
        <HomeContent />
      </main>
    </div>
  );
}