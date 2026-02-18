import './App.css'
import { useEffect, useState } from 'react'

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

  // State för att visa/dölja resultatvy
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    regNr: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    condition: ''
  })

  // Validera enskilt fält (när användaren lämnar det)
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors }
    
    switch(fieldName) {
      case 'regNr':
        if (!value || value.length !== 6) {
          newErrors.regNr = 'Registreringsnummer måste vara 6 tecken'
        } else {
          delete newErrors.regNr
        }
        break
        
      case 'brand':
        if (!value) {
          newErrors.brand = 'Välj ett bilmärke'
        } else {
          delete newErrors.brand
        }
        break
        
      case 'model':
        if (!value || value.trim().length < 2) {
          newErrors.model = 'Ange bilmodell (minst 2 tecken)'
        } else {
          delete newErrors.model
        }
        break
        
      case 'year':
        const year = parseInt(value)
        if (!value || year < 1990 || year > 2026) {
          newErrors.year = 'Årsmodell måste vara mellan 1990-2026'
        } else {
          delete newErrors.year
        }
        break
        
      case 'mileage':
        const mileage = parseInt(value)
        if (!value || mileage < 0 || mileage > 100000) {
          newErrors.mileage = 'Miltal måste vara mellan 0-100,000 mil'
        } else {
          delete newErrors.mileage
        }
        break
        
      case 'condition':
        if (!value) {
          newErrors.condition = 'Välj bilens skick'
        } else {
          delete newErrors.condition
        }
        break
    }
    
    setErrors(newErrors)
  }

  // Validera formulär
  const validateForm = () => {
    const newErrors = {}
    
    // Validera regnummer (exakt 6 tecken)
    if (!formData.regNr || formData.regNr.length !== 6) {
      newErrors.regNr = 'Registreringsnummer måste vara 6 tecken'
    }
    
    // Validera bilmärke
    if (!formData.brand) {
      newErrors.brand = 'Välj ett bilmärke'
    }
    
    // Validera modell
    if (!formData.model || formData.model.trim().length < 2) {
      newErrors.model = 'Ange bilmodell (minst 2 tecken)'
    }
    
    // Validera årsmodell
    const year = parseInt(formData.year)
    if (!formData.year || year < 1990 || year > 2026) {
      newErrors.year = 'Årsmodell måste vara mellan 1990-2026'
    }
    
    // Validera miltal
    const mileage = parseInt(formData.mileage)
    if (!formData.mileage || mileage < 0 || mileage > 100000) {
      newErrors.mileage = 'Miltal måste vara mellan 0-100,000 mil'
    }
    
    // Validera skick
    if (!formData.condition) {
      newErrors.condition = 'Välj bilens skick'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Funktion som körs när användaren klickar "Få AI-värdering"
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validera först
    if (!validateForm()) {
      return
    }
    
    // Rensa errors
    setErrors({})
    
    // Starta laddning
    setIsLoading(true)
    setLoadingProgress(0)
    
    // Steg 1: Analyserar biluppgifter (30%)
    setLoadingText('Analyserar biluppgifter...')
    setLoadingProgress(30)
    
    setTimeout(() => {
      // Steg 2: Jämför mot marknaden (60%)
      setLoadingText('Jämför mot tusentals annonser...')
      setLoadingProgress(60)
      
      setTimeout(() => {
        // Steg 3: Beräknar värde (100%)
        setLoadingText('Beräknar slutligt marknadsvärde...')
        setLoadingProgress(100)
        
        setTimeout(() => {
          // Visa resultat
          setIsLoading(false)
          setShowResult(true)
        }, 800)
      }, 1000)
    }, 1000)
  }

  // Funktion för att börja om
  const handleNewValuation = () => {
    setShowResult(false)
    setIsLoading(false)
    setLoadingProgress(0)
    setLoadingText('')
    setErrors({})
    setFormData({
      regNr: '',
      brand: '',
      model: '',
      year: '',
      mileage: '',
      condition: ''
    })
  }

  // Hamburgermeny funktioner
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">VärderaBil</a>
          
          {/* Desktop navigation */}
          <div className="nav-links">
            <a href="#vardera" className="nav-button">Börja värdera</a>
            <a href="#hur">Hur det fungerar</a>
            <a href="#om">Om oss</a>
            <a href="#login">Logga in</a>
          </div>
          
          {/* Hamburger icon */}
          <div className="hamburger" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div 
        className={`menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <a href="#" className="logo" onClick={closeMobileMenu}>VärderaBil</a>
          <button className="close-btn" onClick={closeMobileMenu}>×</button>
        </div>
        
        <div className="mobile-menu-links">
          <a href="#vardera" onClick={closeMobileMenu}>Börja värdera</a>
          <a href="#hur" onClick={closeMobileMenu}>Hur det fungerar</a>
          <a href="#om" onClick={closeMobileMenu}>Om oss</a>
          <a href="#login" onClick={closeMobileMenu}>Logga in</a>
        </div>
      </div>

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

          {/* Höger sida - Formulär, Laddning eller Resultat */}
          {isLoading ? (
            // Visa laddning med progress bar
            <div className="loading-card">
              <h3>AI analyserar din bil</h3>
              
              <div className="progress-container">
                <p className="progress-text">{loadingText}</p>
                
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                
                <div className="progress-percentage">{loadingProgress}%</div>
              </div>
            </div>
          ) : !showResult ? (
            // Visa formulär
            <div className="form-card">
              <h2>Få din AI-värdering på 60 sekunder</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className={`form-group ${errors.regNr ? 'error' : ''}`}>
                    <label>Reg.nr *</label>
                    <input 
                      type="text" 
                      placeholder="ABC123"
                      maxLength="6"
                      style={{ textTransform: 'uppercase' }}
                      value={formData.regNr}
                      onChange={(e) => setFormData({...formData, regNr: e.target.value})}
                      onBlur={(e) => validateField('regNr', e.target.value)}
                    />
                    {errors.regNr && <span className="error-message">{errors.regNr}</span>}
                  </div>

                  <div className={`form-group ${errors.brand ? 'error' : ''}`}>
                    <label>Bilmärke *</label>
                    <select 
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      onBlur={(e) => validateField('brand', e.target.value)}
                    >
                      <option value="">Välj märke</option>
                      <option value="volvo">Volvo</option>
                      <option value="volkswagen">VW</option>
                      <option value="toyota">Toyota</option>
                      <option value="bmw">BMW</option>
                      <option value="mercedes">Mercedes</option>
                      <option value="audi">Audi</option>
                    </select>
                    {errors.brand && <span className="error-message">{errors.brand}</span>}
                  </div>

                  <div className={`form-group ${errors.model ? 'error' : ''}`}>
                    <label>Modell *</label>
                    <input 
                      type="text" 
                      placeholder="V70, Golf..." 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      onBlur={(e) => validateField('model', e.target.value)}
                    />
                    {errors.model && <span className="error-message">{errors.model}</span>}
                  </div>

                  <div className={`form-group ${errors.year ? 'error' : ''}`}>
                    <label>Årsmodell *</label>
                    <input 
                      type="number" 
                      placeholder="2018" 
                      min="1990" 
                      max="2026"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      onBlur={(e) => validateField('year', e.target.value)}
                    />
                    {errors.year && <span className="error-message">{errors.year}</span>}
                  </div>

                  <div className={`form-group ${errors.mileage ? 'error' : ''}`}>
                    <label>Miltal (mil) *</label>
                    <input 
                      type="number" 
                      placeholder="15000"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      onBlur={(e) => validateField('mileage', e.target.value)}
                    />
                    {errors.mileage && <span className="error-message">{errors.mileage}</span>}
                  </div>

                  <div className={`form-group ${errors.condition ? 'error' : ''}`}>
                    <label>Skick *</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      onBlur={(e) => validateField('condition', e.target.value)}
                    >
                      <option value="">Välj skick</option>
                      <option value="excellent">Utmärkt</option>
                      <option value="good">Bra</option>
                      <option value="fair">Acceptabelt</option>
                      <option value="poor">Dåligt</option>
                    </select>
                    {errors.condition && <span className="error-message">{errors.condition}</span>}
                  </div>
                </div>

                <button type="submit" className="submit-button">Få AI-värdering →</button>
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '0.75rem', 
                  fontSize: '0.8rem',
                  color: '#6B7280'
                }}>
                  100% gratis • Svar direkt
                </p>
              </form>
            </div>
          ) : (
            // Visa resultat
            <div className="result-card">
              <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--gray-800)' }}>
                Din bils uppskattade värde
              </h2>
              
              <div className="result-price">245 000 kr</div>
              <p className="result-subtitle">Baserat på 1,247 liknande annonser</p>

              <div className="result-details">
                <h3>Biluppgifter</h3>
                <div className="detail-row">
                  <span className="detail-label">Registreringsnummer</span>
                  <span className="detail-value">{formData.regNr}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Märke & Modell</span>
                  <span className="detail-value">{formData.brand} {formData.model}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Årsmodell</span>
                  <span className="detail-value">{formData.year}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Miltal</span>
                  <span className="detail-value">{formData.mileage} mil</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Skick</span>
                  <span className="detail-value">
                    {formData.condition === 'excellent' && 'Utmärkt'}
                    {formData.condition === 'good' && 'Bra'}
                    {formData.condition === 'fair' && 'Acceptabelt'}
                    {formData.condition === 'poor' && 'Dåligt'}
                  </span>
                </div>
              </div>

              <div className="result-actions">
                <button className="btn-primary">Ladda ner PDF →</button>
                <button className="btn-secondary" onClick={handleNewValuation}>
                  Gör ny värdering
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hur det fungerar */}
      <section className="how-it-works" id="hur">
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

      {/* Om oss */}
      <section className="about-section" id="om">
        <div className="about-container">
          <h2>Om VärderaBil</h2>
          
          <div className="about-content">
            <p>
              VärderaBil grundades 2026 med en enkel vision: att skapa total 
              transparens på den svenska bilmarknaden. Vi använder avancerad 
              AI-teknologi för att analysera tusentals bilannonser i realtid 
              och ge dig det mest rättvisa marknadspriset.
            </p>
            
            <p>
              Till skillnad från traditionella värderingstjänster jämför vi 
              data från alla stora bilsajter – Blocket, Wayke, Kvdbil och fler. 
              Detta ger dig en värdering baserad på faktiska marknadspriser, 
              inte gissningar.
            </p>
            
            <p>
              Sedan lanseringen har vi hjälpt över 10,000 svenskar att få 
              rättvisa värderingar på sina bilar. Helt gratis, helt transparent.
            </p>
          </div>
          
          <div className="about-stats">
            <div className="stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Värderingar</div>
            </div>
            <div className="stat">
              <div className="stat-number">2026</div>
              <div className="stat-label">Grundat</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Gratis</div>
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