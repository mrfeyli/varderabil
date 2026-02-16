import './App.css'
import { useEffect } from 'react'

function App() {
  // Scroll-effekt för navbar
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar')
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled')
      } else {
        navbar.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    // Cleanup när komponenten avmonteras
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">VärderaBil</a>
          <div className="nav-links">
            <a href="#vardera" className="nav-button">Börja värdera</a>
            <a href="#hur">Hur det fungerar</a>
            <a href="#om">Om oss</a>
            <a href="#login">Logga in</a>
          </div>
        </div>
      </nav>

      {/* Värderingsformulär */}
      <section className="valuation-section">
        <div className="valuation-container">
          {/* Vänster sida - Text */}
          <div className="hero-content">
            <h1>AI-driven bilvärdering med jämförelse från hela marknaden</h1>
            <p>Vi analyserar tusentals annonser från samtliga bilsajter för att ge dig det mest rättvisa marknadspriset</p>
            <ul className="hero-features">
              <li>AI-baserad värdering som jämför priser från Blocket, Wayke, Kvdbil med flera</li>
              <li>Realtidsdata från hela den svenska bilmarknaden</li>
              <li>Transparent värdering — se exakt hur vi räknar</li>
              <li>Gratis PDF-rapport du kan använda vid försäljning</li>
            </ul>
          </div>

          {/* Höger sida - Formulär */}
          <div className="form-card">
            <h2>Få din AI-värdering på 60 sekunder</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Reg.nr *</label>
                <input 
                  type="text" 
                  placeholder="ABC123"
                  maxLength="6"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-group">
                <label>Bilmärke *</label>
                <select>
                  <option value="">Välj märke</option>
                  <option value="volvo">Volvo</option>
                  <option value="volkswagen">VW</option>
                  <option value="toyota">Toyota</option>
                  <option value="bmw">BMW</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select>
              </div>

              <div className="form-group">
                <label>Modell *</label>
                <input type="text" placeholder="V70, Golf..." />
              </div>

              <div className="form-group">
                <label>Årsmodell *</label>
                <input type="number" placeholder="2018" min="1990" max="2026" />
              </div>

              <div className="form-group">
                <label>Miltal (mil) *</label>
                <input type="number" placeholder="15000" />
              </div>

              <div className="form-group">
                <label>Skick *</label>
                <select>
                  <option value="">Välj skick</option>
                  <option value="excellent">Utmärkt</option>
                  <option value="good">Bra</option>
                  <option value="fair">Acceptabelt</option>
                  <option value="poor">Dåligt</option>
                </select>
              </div>
            </div>

            <button className="submit-button">Få AI-värdering →</button>
            <p style={{ 
              textAlign: 'center', 
              marginTop: '1rem', 
              fontSize: '0.875rem',
              color: '#6B7280'
            }}>
              100% gratis • Svar direkt
            </p>
          </div>
        </div>
      </section>

      {/* Hur det fungerar */}
      <section className="how-it-works">
        <div className="how-container">
          <h2>Så fungerar vår AI-värdering</h2>
          
          <div className="steps">
            {/* Steg 1 */}
            <div className="step">
              <div className="step-number">1</div>
              <h3>Fyll i biluppgifter</h3>
              <p>
                Ange registreringsnummer eller fyll i manuellt. Tar 60 sekunder.
              </p>
            </div>

            {/* Steg 2 */}
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI analyserar marknaden</h3>
              <p>
                Vår AI jämför din bil mot tusentals annonser från Blocket, Wayke, Kvdbil och fler.
              </p>
            </div>

            {/* Steg 3 */}
            <div className="step">
              <div className="step-number">3</div>
              <h3>Få värdering & PDF</h3>
              <p>
                Se ditt marknadspris direkt och ladda ner professionell värderingsrapport.
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