function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Värdera din bil — snabbt och enkelt
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Få en professionell värdering på 60 sekunder. Gratis och transparent.
          </p>
          <button className="bg-accent hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300">
            Börja värdera →
          </button>
        </div>
      </section>
    </div>
  )
}

export default App