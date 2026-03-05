import './App.css'
import { useEffect, useState, useRef } from 'react'
import AIAssistant from './AIAssistant'
import jsPDF from 'jspdf'

const API_BASE = 'http://localhost:8000'

// Mappar Biluppgifters märkesnamn till våra select-värden
const BRAND_MAP = {
  'volvo':         'volvo',
  'volkswagen':    'volkswagen',
  'vw':            'volkswagen',
  'toyota':        'toyota',
  'bmw':           'bmw',
  'mercedes':      'mercedes',
  'mercedes-benz': 'mercedes',
  'audi':          'audi',
}

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
  const [result, setResult] = useState(null)
  const [fetchingVehicle, setFetchingVehicle] = useState(false)
  const [apiError, setApiError] = useState('')
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

  // Autofyll formulär från reg.nr via Biluppgifter-endpointen
  const handleRegNrChange = async (e) => {
    const value = e.target.value.toUpperCase()
    setFormData(prev => ({ ...prev, regNr: value }))

    if (value.length !== 6) return

    setFetchingVehicle(true)
    try {
      const res = await fetch(`${API_BASE}/api/vehicle/${value}`)
      if (!res.ok) return
      const vehicle = await res.json()
      setFormData(prev => ({
        ...prev,
        regNr: value,
        brand:   BRAND_MAP[vehicle.make?.toLowerCase()] ?? prev.brand,
        model:   vehicle.model                          || prev.model,
        year:    vehicle.year?.toString()               || prev.year,
        mileage: vehicle.mileage_mil?.toString()        || prev.mileage,
      }))
    } catch {
      // Tyst fel — användaren fyller i manuellt
    } finally {
      setFetchingVehicle(false)
    }
  }

  // Skickar formuläret till backend och hämtar riktigt pris
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setErrors({})
    setApiError('')
    setIsLoading(true)
    setLoadingProgress(30)
    setLoadingText('Analyserar biluppgifter...')

    try {
      // Starta fetch direkt, kör animation parallellt
      const fetchPromise = fetch(`${API_BASE}/api/valuations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reg_nr:    formData.regNr,
          brand:     formData.brand,
          model:     formData.model,
          year:      parseInt(formData.year),
          mileage:   parseInt(formData.mileage),
          condition: formData.condition,
        }),
      })

      await new Promise(r => setTimeout(r, 700))
      setLoadingText('Jämför mot tusentals annonser...')
      setLoadingProgress(60)

      const res = await fetchPromise
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      setLoadingText('Beräknar slutligt marknadsvärde...')
      setLoadingProgress(100)
      await new Promise(r => setTimeout(r, 600))

      setResult(data)
      setIsLoading(false)
      setShowResult(true)
    } catch {
      setIsLoading(false)
      setApiError('Kunde inte ansluta till servern. Kontrollera att backend körs.')
    }
  }

  // Funktion för att börja om
  const handleNewValuation = () => {
    setShowResult(false)
    setIsLoading(false)
    setLoadingProgress(0)
    setLoadingText('')
    setErrors({})
    setResult(null)
    setApiError('')
    setFormData({
      regNr: '',
      brand: '',
      model: '',
      year: '',
      mileage: '',
      condition: ''
    })
  }

  // Genererar och laddar ner en PDF-värderingsrapport
  const generatePDF = () => {
    const doc = new jsPDF()
    const conditionLabels = { excellent: 'Utmärkt', good: 'Bra', fair: 'Acceptabelt', poor: 'Dåligt' }
    const date = new Date().toLocaleDateString('sv-SE')
    const price = result.estimated_price.toLocaleString('sv-SE') + ' kr'

    // Rubrik
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('VärderaBil — Värderingsrapport', 20, 25)

    // Datum
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Datum: ${date}`, 20, 34)

    // Separator
    doc.setDrawColor(180, 180, 180)
    doc.line(20, 39, 190, 39)

    // Biluppgifter
    doc.setFontSize(11)
    const fields = [
      ['Reg.nr', formData.regNr.toUpperCase()],
      ['Märke', formData.brand],
      ['Modell', formData.model],
      ['Årsmodell', formData.year],
      ['Miltal', formData.mileage ? `${Number(formData.mileage).toLocaleString('sv-SE')} mil` : '—'],
      ['Skick', conditionLabels[formData.condition] || formData.condition],
    ]
    fields.forEach(([label, value], i) => {
      const y = 50 + i * 9
      doc.setFont('helvetica', 'bold')
      doc.text(label + ':', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(value || '—', 65, y)
    })

    // Separator
    doc.line(20, 108, 190, 108)

    // Pris
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('Uppskattat marknadsvärde:', 20, 120)
    doc.setFontSize(26)
    doc.text(price, 20, 134)

    // Fotnot
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text('Genererad av VärderaBil · varderabil.se', 20, 280)

    doc.save(`vardering-${formData.regNr || 'bil'}.pdf`)
  }

  // Hamburgermeny funktioner
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Ref för reg.nr-fältet — används av "Börja värdera"-knappen
  const regNrRef = useRef(null)

  const handleStartValuation = (e) => {
    e.preventDefault()
    closeMobileMenu()
    document.getElementById('vardera')?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => regNrRef.current?.focus(), 500)
  }

  const stepsConfig = [
    { number: '01', icon: '⊕', title: 'Fyll i biluppgifter', desc: 'Ange registreringsnummer eller fyll i manuellt. Hela processen tar under 60 sekunder.' },
    { number: '02', icon: '◈', title: 'AI analyserar marknaden', desc: 'Vår AI skannar tusentals annonser från Blocket, Wayke och Kvdbil i realtid.' },
    { number: '03', icon: '✦', title: 'Få värdering & PDF', desc: 'Se exakt marknadspris direkt och ladda ner en professionell värderingsrapport.' },
  ]

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">VärderaBil</a>
          
          {/* Desktop navigation */}
          <div className="nav-links">
            <a href="#vardera" className="nav-button" onClick={handleStartValuation}>Börja värdera</a>
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
          <a href="#vardera" onClick={handleStartValuation}>Börja värdera</a>
          <a href="#hur" onClick={closeMobileMenu}>Hur det fungerar</a>
          <a href="#om" onClick={closeMobileMenu}>Om oss</a>
          <a href="#login" onClick={closeMobileMenu}>Logga in</a>
        </div>
      </div>

      {/* Värderingsformulär */}
      <section className="valuation-section" id="vardera">
        <div className="valuation-container">
          {/* Vänster sida - Text */}
          <div className="hero-content">
            <div className="hero-badge">AI-driven bilvärdering</div>
            <h1>Få det rättvisa marknadspriset på din bil</h1>
            <p>Vi jämför tusentals annonser från Blocket, Wayke och Kvdbil i realtid — helt gratis.</p>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">250+</div>
                <div className="hero-stat-label">Värderingar gjorda</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">3 källor</div>
                <div className="hero-stat-label">Blocket, Wayke, Kvdbil</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">60 sek</div>
                <div className="hero-stat-label">Genomsnittlig tid</div>
              </div>
            </div>
          </div>

          {/* Höger sida - Formulär, Laddning eller Resultat */}
          {isLoading ? (
            // Visa laddning med progress bar
            <div className="loading-card">
              <h3>AI analyserar din bil</h3>
              <p className="loading-subtitle">scanning market data...</p>

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

                  {/* Reg.nr — full bredd, primär identifierare */}
                  <div className={`form-group full-width ${errors.regNr ? 'error' : ''}`}>
                    <label>
                      Registreringsnummer *
                      {fetchingVehicle && <span style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '0.68rem', fontWeight: 600 }}>hämtar uppgifter...</span>}
                    </label>
                    <input
                      ref={regNrRef}
                      type="text"
                      placeholder="ABC123"
                      maxLength="6"
                      style={{ textTransform: 'uppercase' }}
                      value={formData.regNr}
                      onChange={handleRegNrChange}
                      onBlur={(e) => validateField('regNr', e.target.value)}
                    />
                    {errors.regNr && <span className="error-message">{errors.regNr}</span>}
                  </div>

                  {/* Märke + Modell — logiskt sammanhörande */}
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

                  {/* Årsmodell + Miltal — numeriska specs */}
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
                      placeholder="15 000"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      onBlur={(e) => validateField('mileage', e.target.value)}
                    />
                    {errors.mileage && <span className="error-message">{errors.mileage}</span>}
                  </div>

                  {/* Skick — full bredd, viktigt kategorival */}
                  <div className={`form-group full-width ${errors.condition ? 'error' : ''}`}>
                    <label>Skick *</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      onBlur={(e) => validateField('condition', e.target.value)}
                    >
                      <option value="">Välj skick</option>
                      <option value="excellent">Utmärkt — inga anmärkningar</option>
                      <option value="good">Bra — normalt slitage</option>
                      <option value="fair">Acceptabelt — mindre skador</option>
                      <option value="poor">Dåligt — behöver renovering</option>
                    </select>
                    {errors.condition && <span className="error-message">{errors.condition}</span>}
                  </div>

                </div>

                {apiError && (
                  <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    ⚠ {apiError}
                  </p>
                )}
                <button type="submit" className="submit-button">Få AI-värdering →</button>
                <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>
                  100% gratis • Svar direkt
                </p>
              </form>
            </div>
          ) : (
            // Visa resultat
            <div className="result-card">
              <div className="result-header">
                <h2>Uppskattat marknadsvärde</h2>
                <div className="result-price">
                  {result?.estimated_price?.toLocaleString('sv-SE')} kr
                </div>
                <p className="result-subtitle">Baserat på bilens årsmodell, miltal och skick</p>
              </div>

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
                <button className="btn-primary" onClick={generatePDF}>Ladda ner PDF →</button>
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
          <div className="section-label"><span>Hur det fungerar</span></div>
          <h2>Tre steg till ditt marknadspris</h2>

          <div className="steps">
            {stepsConfig.map((step) => (
              <div className="step" key={step.number}>
                <div className="step-number">{step.number}</div>
                <span className="step-icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Om oss */}
      <section className="about-section" id="om">
        <div className="about-container">
          <div className="section-label"><span>Om oss</span></div>
          <h2>Byggt för total transparens</h2>

          <p className="about-intro">
            VärderaBil grundades 2026 med en enkel vision — att ge svenska bilägare
            ett rättvist och datadrivet marknadspris. Vi aggregerar realtidsdata från
            alla stora bilsajter och låter AI räkna ut vad din bil faktiskt är värd.
          </p>

          <div className="about-stats">
            <div className="stat">
              <div className="stat-number">10 000+</div>
              <div className="stat-label">Värderingar</div>
            </div>
            <div className="stat">
              <div className="stat-number">3+</div>
              <div className="stat-label">Datakällor</div>
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
          <span className="footer-brand">VärderaBil</span>
          <div className="footer-links">
            <a href="#om">Om oss</a>
            <a href="#hur">Hur det fungerar</a>
            <a href="#integritet">Integritetspolicy</a>
          </div>
          <p>&copy; 2026 VärderaBil</p>
        </div>
      </footer>

      {/* AI Assistant — fixed, site-wide */}
      <AIAssistant />
    </div>
  )
}

export default App