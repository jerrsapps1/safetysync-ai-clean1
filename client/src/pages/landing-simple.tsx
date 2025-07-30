export default function LandingSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            SafetySync.AI
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8">
            AI-Powered Compliance Platform
          </p>
          <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl text-white mb-4">
              127+ companies joined the Lifer Plan
            </h2>
            <p className="text-lg text-white">
              Modern Safety Management, Made Simple
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white font-semibold px-8 py-4 text-base rounded-xl shadow-md hover:bg-blue-700 transition-colors">
              Get Started Free
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 text-base rounded-xl hover:bg-white hover:text-blue-600 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}