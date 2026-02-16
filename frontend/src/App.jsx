import './App.css'

function App() {
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">VärderaBil</a>
          <div className="nav-links">
            <a href="#hem">Hem</a>
            <a href="#hur">Hur det fungerar</a>
            <a href="#om">Om oss</a>
            <a href="#vardera" className="nav-button">Börja värdera</a>
          </div>
        </div>
      </nav>

      {/* Värderingsformulär */}
      <section className="valuation-section">
        <div className="valuation-container">
          <h1>Värdera din bil gratis</h1>
          <p>Ange ditt registreringsnummer så hämtar vi biluppgifterna automatiskt</p>
          
          <div className="regnummer-input-wrapper">
            <div className="regnummer-plate">
              <div className="eu-stars">
                <span>★★★★★★</span>
                <span>★★★★★★</span>
              </div>
              <div className="country-code">S</div>
            </div>
            <input 
              type="text" 
              className="regnummer-input" 
              placeholder="ABC123"
              maxLength="6"
            />
            <button className="valuation-button">Värdera →</button>
          </div>
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <a href="#om">Om oss</a>
            <a href="#hur">Hur det fungerar</a>
            <a href="#faq">FAQ</a>
            <a href="#integritet">Integritetspolicy</a>
          </div>
          <p>&copy; 2026 VärderaBil. Alla rättigheter förbehållna.</p>
        </div>
      </footer>
    </div>
  )
}

export default App