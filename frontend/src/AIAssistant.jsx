import { useState, useRef, useEffect } from 'react'

const QUICK_ACTIONS = [
  'Hur fungerar värderingen?',
  'Vad behöver jag för information?',
  'Hur snabbt får jag ett svar?',
  'Är tjänsten helt gratis?',
]

// TODO(human): Implementera svar-logiken nedan.
// Funktionen tar emot användarens meddelande (sträng) och ska returnera
// ett relevant svar baserat på nyckelord.
// Tips: använd .toLowerCase() och .includes() för att matcha fraser.
// Returnera alltid en sträng — lägg till fler if-satser för fler ämnen.
const getAutoResponse = (message) => {
  return 'Tack för din fråga! Den här funktionen är under utveckling. Fyll i formuläret ovan för att komma igång med din kostnadsfria bilvärdering.'
}

export default function AIAssistant() {
  const [isOpen, setIsOpen]     = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput]       = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hej! Jag är din AI-assistent för bilvärdering. Ställ en fråga eller välj ett alternativ nedan.' },
  ])

  const messagesEndRef = useRef(null)

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const sendMessage = (text) => {
    const userText = (text ?? input).trim()
    if (!userText) return

    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'assistant', text: getAutoResponse(userText) }])
    }, 650)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showQuickActions = messages.length === 1

  return (
    <>
      {/* ── Chat Panel ─────────────────────────── */}
      <div className={`ai-panel ${isOpen ? 'ai-panel--open' : ''}`} role="dialog" aria-label="AI-assistent">

        {/* Header */}
        <div className="ai-panel-header">
          <div className="ai-panel-header-info">
            <span className="ai-status-dot" />
            <div>
              <div className="ai-panel-title">AI-assistent</div>
              <div className="ai-panel-subtitle">Online — svarar direkt</div>
            </div>
          </div>
          <button className="ai-close-btn" onClick={() => setIsOpen(false)} aria-label="Stäng">✕</button>
        </div>

        {/* Messages */}
        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ai-message--${msg.role}`}>
              {msg.text}
            </div>
          ))}

          {/* Quick actions — only on first load */}
          {showQuickActions && (
            <div className="ai-quick-actions">
              {QUICK_ACTIONS.map((action, i) => (
                <button key={i} className="ai-quick-btn" onClick={() => sendMessage(action)}>
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="ai-message ai-message--assistant ai-typing">
              <span /><span /><span />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="ai-input-area">
          <input
            className="ai-input"
            type="text"
            placeholder="Skriv din fråga..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Skriv ett meddelande"
          />
          <button
            className="ai-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            aria-label="Skicka"
          >
            ↑
          </button>
        </div>
      </div>

      {/* ── Floating Trigger ───────────────────── */}
      <button
        className={`ai-trigger ${isOpen ? 'ai-trigger--active' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Stäng AI-assistent' : 'Öppna AI-assistent'}
      >
        <span className="ai-trigger-icon">◈</span>
        <span className="ai-trigger-label">{isOpen ? 'Stäng' : 'AI-assistent'}</span>
        {!isOpen && <span className="ai-trigger-pulse" />}
      </button>
    </>
  )
}
