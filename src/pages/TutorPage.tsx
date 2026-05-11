import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Bot, RefreshCw, Lightbulb } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import Layout from '../components/Layout'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const scenarios = [
  { id: 'intro', label: 'Presentación', emoji: '👋', prompt: 'Practice introducing yourself in English. Start the conversation.' },
  { id: 'class', label: 'En clase', emoji: '🎓', prompt: 'Simulate an English-language university class. Ask me questions about the topic.' },
  { id: 'store', label: 'De compras', emoji: '🛒', prompt: 'Simulate a shopping scenario in English. You are the store clerk.' },
  { id: 'restaurant', label: 'Restaurante', emoji: '🍽️', prompt: 'Simulate ordering food at a restaurant in English. You are the waiter.' },
  { id: 'free', label: 'Libre', emoji: '💬', prompt: 'Have a free conversation in English with me. Correct my mistakes gently and encourage me.' },
]

export default function TutorPage() {
  const { state, dispatch, saveProfile } = useGame()
  const profile = state.profile
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(scenarios[4])
  const [isListening, setIsListening] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startSession = async () => {
    setSessionStarted(true)
    setMessages([])
    await sendToAI(selectedScenario.prompt, [], true)
  }

  const sendToAI = async (userMsg: string, history: Message[], isSystem = false) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_key_here') {
      const fallback = getFallbackResponse(userMsg, selectedScenario.id)
      const msg: Message = { role: 'assistant', content: fallback, timestamp: new Date() }
      setMessages(prev => [...prev, msg])
      return
    }

    setLoading(true)
    try {
      const level = profile?.level ?? 'A1'
      const systemPrompt = `You are LinguaAI, a friendly English tutor for a Spanish-speaking student at ${level} level.
Your job: ${selectedScenario.prompt}
Rules:
- Speak in English but adapt complexity to ${level} level
- Gently correct grammar mistakes by including the correct form in your response
- Be encouraging and patient
- Keep responses short (2-4 sentences max)
- If the student writes in Spanish, gently remind them to try in English and help them
- After every 5 messages, give a short tip or encouragement`

      const msgs = history.map(m => ({ role: m.role, content: m.content }))
      if (!isSystem) msgs.push({ role: 'user', content: userMsg })

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 256,
          system: systemPrompt,
          messages: msgs.length > 0 ? msgs : [{ role: 'user', content: 'Start the conversation.' }],
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text ?? 'Sorry, I could not respond. Try again!'
      const msg: Message = { role: 'assistant', content: reply, timestamp: new Date() }
      setMessages(prev => [...prev, msg])
    } catch {
      const msg: Message = { role: 'assistant', content: getFallbackResponse(userMsg, selectedScenario.id), timestamp: new Date() }
      setMessages(prev => [...prev, msg])
    } finally {
      setLoading(false)
    }
  }

  const getFallbackResponse = (_msg: string, scenario: string): string => {
    const responses: Record<string, string[]> = {
      intro: [
        "Hi! I'm your English tutor. Let's practice! Can you tell me your name? Say: 'My name is...'",
        "Great! Nice to meet you! Where are you from? Say: 'I am from...'",
        "Wonderful! How old are you? Say: 'I am ___ years old.'",
      ],
      class: [
        "Good morning, class! Today we're going to talk about technology. What do you know about the internet?",
        "Interesting! Can you tell me more? Use the phrase: 'I think that...'",
        "Very good! Now, can you write one sentence about technology?",
      ],
      free: [
        "Hello! I'm so happy to practice English with you! How are you feeling today?",
        "That's great! What do you like to do in your free time?",
        "Wonderful! Tell me more — I want to know everything about you!",
      ],
      restaurant: [
        "Good evening! Welcome to our restaurant. Can I see your reservation?",
        "Perfect! Here is your table. Can I get you something to drink?",
        "Excellent choice! Are you ready to order your food?",
      ],
      store: [
        "Hello! Welcome to the store. How can I help you today?",
        "Of course! What size are you looking for?",
        "That looks great on you! Will you be paying by cash or card?",
      ],
    }
    const list = responses[scenario] ?? responses.free
    return list[Math.floor(Math.random() * list.length)]
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')

    if (newHistory.length % 10 === 0) {
      dispatch({ type: 'ADD_COINS', payload: 5 })
      dispatch({ type: 'ADD_MINUTES', payload: 5 })
      await saveProfile()
    }

    await sendToAI(input.trim(), newHistory)
  }

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      setInput(e.results[0][0].transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 md:pl-64 flex flex-col h-[calc(100vh-8rem)]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot size={22} className="text-primary-light" />
              <div>
                <h1 className="text-lg font-bold text-textbase">Tutor IA</h1>
                <p className="text-xs text-muted">Practica conversación en inglés</p>
              </div>
            </div>
            {sessionStarted && (
              <button
                onClick={() => { setSessionStarted(false); setMessages([]) }}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-textbase bg-surface border border-border px-3 py-1.5 rounded-xl transition-all"
              >
                <RefreshCw size={12} /> Reiniciar
              </button>
            )}
          </div>

          {!sessionStarted ? (
            /* Scenario selector */
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-center text-muted text-sm mb-6">Elige un escenario para practicar</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {scenarios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenario(s)}
                    className={`glass rounded-xl p-4 text-center transition-all card-hover ${selectedScenario.id === s.id ? 'border-primary/40 bg-primary/10' : ''}`}
                  >
                    <span className="text-2xl block mb-1">{s.emoji}</span>
                    <span className="text-sm font-medium text-textbase">{s.label}</span>
                  </button>
                ))}
              </div>

              <div className="glass rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Lightbulb size={16} className="text-gold mt-0.5 shrink-0" />
                  <p className="text-xs text-muted">
                    <strong className="text-textbase">Tip:</strong> Puedes escribir o usar el micrófono para hablar. La IA te corrige gentilmente y te ayuda a mejorar.
                    Cada 10 mensajes ganas <strong className="text-gold">+5 coins</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={startSession}
                className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-lg glow-primary hover:opacity-90 transition-opacity"
              >
                Empezar — {selectedScenario.emoji} {selectedScenario.label}
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center mr-2 mt-1 shrink-0">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'gradient-bg text-white rounded-tr-sm'
                            : 'glass text-textbase rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-muted rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe en inglés... (Enter para enviar)"
                    className="w-full bg-surface border border-border rounded-2xl py-3 px-4 text-sm text-textbase placeholder-muted focus:outline-none focus:border-primary/60 pr-12 transition-colors"
                  />
                </div>
                <button
                  onClick={handleVoice}
                  className={`p-3 rounded-2xl border transition-all ${isListening ? 'bg-danger/20 border-danger text-danger' : 'bg-surface border-border text-muted hover:text-textbase hover:border-primary/40'}`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="gradient-bg text-white p-3 rounded-2xl disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
