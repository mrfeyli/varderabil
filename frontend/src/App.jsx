import './App.css'

function App() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1>Värdera din bil — snabbt och enkelt</h1>
          <p>
            Få en professionell värdering på 60 sekunder. Gratis och transparent.
          </p>
          <button>Börja värdera →</button>
        </div>
      </section>

      {/* Hur det fungerar */}
      <section className="how-it-works">
        <div className="how-container">
          <h2>Så här fungerar det</h2>
          
          <div className="steps">
            {/* Steg 1 */}
            <div className="step">
              <div className="step-number">1</div>
              <h3>Fyll i uppgifter</h3>
              <p>
                Ange märke, modell, årsmodell, miltal och skick på din bil.
              </p>
            </div>

            {/* Steg 2 */}
            <div className="step">
              <div className="step-number">2</div>
              <h3>Få värdering</h3>
              <p>
                Vårt system analyserar marknadsdata och ger dig en rättvis värdering direkt.
              </p>
            </div>

            {/* Steg 3 */}
            <div className="step">
              <div className="step-number">3</div>
              <h3>Ladda ner rapport</h3>
              <p>
                Få din värdering som PDF och använd den när du säljer eller köper bil.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App