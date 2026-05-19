import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Bot, RefreshCw, Lightbulb, Volume2, VolumeX } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import Layout from '../components/Layout'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const scenarios = [
  { id: 'intro', label: 'Presentación', emoji: '👋', prompt: 'Practice introducing yourself in English. Start the conversation by greeting the student and asking their name.' },
  { id: 'class', label: 'En clase', emoji: '🎓', prompt: 'Simulate an English-language university class. You are the professor. Ask questions about technology or science.' },
  { id: 'store', label: 'De compras', emoji: '🛒', prompt: 'Simulate a shopping scenario in English. You are the store clerk. Be helpful and friendly.' },
  { id: 'restaurant', label: 'Restaurante', emoji: '🍽️', prompt: 'Simulate ordering food at a restaurant in English. You are the waiter. Describe specials and take the order.' },
  { id: 'job', label: 'Entrevista', emoji: '💼', prompt: 'Simulate a job interview in English. You are the interviewer at a tech company. Ask professional questions.' },
  { id: 'free', label: 'Libre', emoji: '💬', prompt: 'Have a free conversation in English. Be friendly, ask about interests, and gently correct grammar mistakes.' },
]

function speakText(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

let msgCounter = 0

export default function TutorPage() {
  const { state, dispatch, saveProfile } = useGame()
  const profile = state.profile
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(scenarios[5])
  const [isListening, setIsListening] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildSystemPrompt = useCallback((level: string) => {
    const languageRules: Record<string, string> = {
      A1: `- IMPORTANTE: Habla principalmente en ESPAÑOL para que el estudiante entienda.
- Enseña frases simples en inglés con su traducción al español.
- Ejemplo: "¿Cómo te llamas? In English: 'What is your name?' Try: 'My name is...'"
- Si el estudiante responde mal, corrige con cariño y muestra la forma correcta.`,
      A2: `- Mezcla español e inglés (60% español, 40% inglés).
- Pregunta en inglés pero explica en español si es necesario.
- Anima a responder en inglés, pero acepta español también.`,
      B1: `- Habla principalmente en inglés (70% inglés, 30% español).
- Usa español solo para aclarar conceptos difíciles o vocabulario nuevo.
- Espera que el estudiante responda en inglés.`,
      B2: `- Habla 90% en inglés, solo aclara con español cuando sea necesario.
- Exige que el estudiante responda en inglés.
- Corrige errores de manera natural integrando la forma correcta en tu respuesta.`,
      C1: `- Habla 100% en inglés con vocabulario avanzado.
- Discute temas complejos, modismos, cultura anglosajona.
- Tu rol es desafiar al estudiante con conversación nativa.`,
      C2: `- Habla solo en inglés con todo el vocabulario y matices de un hablante nativo.
- Reta al estudiante con temas filosóficos, técnicos, literarios.`,
    }

    return `You are LinguaAI, a warm and encouraging English tutor for a Spanish-speaking student at ${level} level.
Your current scenario: ${selectedScenario.prompt}

LANGUAGE RULES for ${level} level:
${languageRules[level] ?? languageRules.A1}

TEACHING RULES:
- Keep responses short (2-4 sentences max) so the student isn't overwhelmed.
- After a mistake, gently show the correct form: "Great try! We say: '___'"
- After every 5 exchanges, add a quick tip or encouragement.
- Use emojis sparingly to make it friendly.
- Never break character from the scenario.`
  }, [selectedScenario.prompt])

  const sendToAI = useCallback(async (userMsg: string, history: Message[], isSystem = false) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_key_here') {
      const fallback = getFallbackResponse(userMsg, selectedScenario.id, profile?.level ?? 'A1')
      const msg: Message = { id: ++msgCounter, role: 'assistant', content: fallback, timestamp: new Date() }
      setMessages(prev => [...prev, msg])
      if (autoSpeak) speakText(fallback)
      return
    }

    const level = profile?.level ?? 'A1'
    const systemPrompt = buildSystemPrompt(level)
    const msgs = history.map(m => ({ role: m.role, content: m.content }))
    if (!isSystem) msgs.push({ role: 'user', content: userMsg })
    const finalMsgs = msgs.length > 0 ? msgs : [{ role: 'user', content: 'Start the conversation now.' }]

    // Create streaming assistant message placeholder
    const newMsgId = ++msgCounter
    setMessages(prev => [...prev, { id: newMsgId, role: 'assistant', content: '', timestamp: new Date() }])
    setStreaming(true)
    setLoading(true)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'prompt-caching-2024-07-31',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          stream: true,
          system: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: finalMsgs,
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`API error ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.trim())

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              fullContent += parsed.delta.text
              setMessages(prev =>
                prev.map(m => m.id === newMsgId ? { ...m, content: fullContent } : m)
              )
            }
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }

      if (autoSpeak && fullContent) speakText(fullContent)

    } catch (err) {
      const isAbort = err instanceof Error && err.name === 'AbortError'
      if (!isAbort) {
        const fallback = getFallbackResponse(userMsg, selectedScenario.id, level)
        setMessages(prev =>
          prev.map(m => m.id === newMsgId ? { ...m, content: fallback } : m)
        )
        if (autoSpeak) speakText(fallback)
      }
    } finally {
      setStreaming(false)
      setLoading(false)
    }
  }, [profile?.level, selectedScenario, autoSpeak, buildSystemPrompt])

  const startSession = async () => {
    window.speechSynthesis.cancel()
    setSessionStarted(true)
    setMessages([])
    setMessageCount(0)
    await sendToAI(selectedScenario.prompt, [], true)
  }

  const handleSend = async () => {
    if (!input.trim() || loading || streaming) return
    const userMsg: Message = { id: ++msgCounter, role: 'user', content: input.trim(), timestamp: new Date() }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')

    const newCount = messageCount + 1
    setMessageCount(newCount)

    if (newCount % 10 === 0) {
      dispatch({ type: 'ADD_COINS', payload: 5 })
      dispatch({ type: 'ADD_XP', payload: 10 })
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

  const handleReset = () => {
    abortRef.current?.abort()
    window.speechSynthesis.cancel()
    setSessionStarted(false)
    setMessages([])
    setMessageCount(0)
    setStreaming(false)
    setLoading(false)
  }

  const toggleAutoSpeak = () => {
    if (autoSpeak) window.speechSynthesis.cancel()
    setAutoSpeak(v => !v)
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
            <div className="flex items-center gap-2">
              {/* Auto-speak toggle */}
              <button
                onClick={toggleAutoSpeak}
                title={autoSpeak ? 'Silenciar tutor' : 'Escuchar tutor en voz alta'}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  autoSpeak
                    ? 'bg-primary/20 border-primary/40 text-primary-light'
                    : 'bg-surface border-border text-muted hover:text-textbase'
                }`}
              >
                {autoSpeak ? <Volume2 size={12} /> : <VolumeX size={12} />}
                <span className="hidden sm:inline">{autoSpeak ? 'Audio on' : 'Audio off'}</span>
              </button>
              {sessionStarted && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-textbase bg-surface border border-border px-3 py-1.5 rounded-xl transition-all"
                >
                  <RefreshCw size={12} /> Reiniciar
                </button>
              )}
            </div>
          </div>

          {!sessionStarted ? (
            /* Scenario selector */
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-center text-muted text-sm mb-4">Elige un escenario para practicar</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
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

              <div className="glass rounded-xl p-4 mb-5">
                <div className="flex items-start gap-2">
                  <Lightbulb size={16} className="text-gold mt-0.5 shrink-0" />
                  <div className="text-xs text-muted space-y-1">
                    <p><strong className="text-textbase">💬 Escribe o habla</strong> — usa el micrófono para practicar también el speaking.</p>
                    <p><strong className="text-textbase">🔊 Audio on</strong> — activa el audio para escuchar al tutor y entrenar tu listening.</p>
                    <p><strong className="text-textbase">🏆 Recompensas</strong> — cada 10 mensajes ganas <strong className="text-gold">+5 coins y +10 XP</strong>.</p>
                  </div>
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
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center mr-2 mt-1 shrink-0">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'gradient-bg text-white rounded-tr-sm'
                              : 'glass text-textbase rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                          {/* Streaming cursor */}
                          {streaming && msg.role === 'assistant' && msg === messages[messages.length - 1] && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6 }}
                              className="inline-block w-0.5 h-4 bg-primary-light ml-0.5 align-middle"
                            />
                          )}
                        </div>
                        {/* Speak button for assistant */}
                        {msg.role === 'assistant' && msg.content && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="self-start ml-1 text-muted hover:text-primary-light transition-colors"
                            title="Escuchar"
                          >
                            <Volume2 size={12} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && !streaming && (
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

                {/* XP progress hint */}
                {messageCount > 0 && messageCount % 10 !== 0 && (
                  <div className="text-center">
                    <span className="text-xs text-muted bg-surface border border-border rounded-full px-3 py-1">
                      {10 - (messageCount % 10)} mensajes más para ganar +5 coins 🎉
                    </span>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? '🎤 Escuchando...' : 'Escribe en inglés... (Enter para enviar)'}
                    className="w-full bg-surface border border-border rounded-2xl py-3 px-4 text-sm text-textbase placeholder-muted focus:outline-none focus:border-primary/60 transition-colors"
                    disabled={streaming}
                  />
                </div>
                <button
                  onClick={handleVoice}
                  className={`p-3 rounded-2xl border transition-all ${isListening ? 'bg-danger/20 border-danger text-danger animate-pulse' : 'bg-surface border-border text-muted hover:text-textbase hover:border-primary/40'}`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading || streaming}
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

function getFallbackResponse(msg: string, scenario: string, level: string): string {
  const isBeginner = level === 'A1' || level === 'A2'

  const beginnerResponses: Record<string, string[]> = {
    intro: [
      "¡Hola! Soy tu tutor de inglés. Vamos a practicar. ¿Cómo te llamas? Responde: 'My name is...' (Mi nombre es...)",
      "¡Excelente! Nice to meet you (Mucho gusto). ¿De dónde eres? Responde: 'I am from...' (Soy de...)",
      "Muy bien. ¿Cuántos años tienes? Di: 'I am ___ years old.' (Tengo ___ años)",
    ],
    class: [
      "Imagina que estamos en clase. El profesor dice: 'Open your books' (Abran sus libros). ¿Qué harías?",
      "Bien. ¿Cómo dirías 'No entiendo' en inglés? Es: 'I don't understand'. Inténtalo.",
      "Para preguntar algo en clase di: 'Can you repeat, please?' (¿Puede repetir?). Practícalo.",
    ],
    job: [
      "Good morning! Please, tell me about yourself. ¿Puedes decir tu nombre y qué haces?",
      "¿Cuál es tu experiencia? Di: 'I have experience in...' (Tengo experiencia en...)",
      "¿Por qué quieres este trabajo? Di: 'I want this job because...' (Quiero este trabajo porque...)",
    ],
    restaurant: [
      "Good evening! Welcome. ¿Qué responderías? Di: 'Thank you' o 'Hello'.",
      "¿Quieres ver la carta? Di: 'Can I see the menu, please?' (¿Puedo ver el menú?)",
      "Para ordenar: 'I would like ___, please.' (Me gustaría ___, por favor)",
    ],
    store: [
      "Estás en una tienda. La empleada dice: 'How can I help you?' Responde: 'I'm looking for ___'",
      "Para preguntar el precio: 'How much is this?' (¿Cuánto cuesta?). Practícalo.",
      "Para pagar: 'I'll pay with card' (Pagaré con tarjeta).",
    ],
    free: [
      "¡Hola! ¿Cómo te sientes hoy? Responde: 'I feel good' o 'I feel tired'.",
      "¿Qué te gusta hacer? Practica: 'I like to ___' (Me gusta ___)",
      "Cuéntame más en inglés. Si no sabes una palabra, escríbela en español.",
    ],
  }

  const advancedResponses: Record<string, string[]> = {
    intro: [
      "Hi there! I'm your English tutor. Tell me your name and a bit about yourself.",
      "Great! Where are you from and what do you do?",
      "Interesting! What are your hobbies and what brought you to learn English?",
    ],
    class: [
      "Good morning! Today's topic is AI in education. What's your opinion?",
      "Interesting point. Can you elaborate on that idea?",
      "Now write a short paragraph defending your opinion.",
    ],
    job: [
      "Good morning! Thank you for coming. Please tell me a bit about your background.",
      "What are your main strengths? Can you give me an example?",
      "Where do you see yourself in five years?",
    ],
    restaurant: [
      "Good evening! Welcome. Do you have a reservation?",
      "Perfect. Here's your menu. Today's special is grilled salmon. What would you like?",
      "Excellent choice! And to drink?",
    ],
    store: [
      "Hello! Welcome. Looking for something specific today?",
      "Of course. What size and color would you prefer?",
      "Great choice! Will you be paying by cash or card?",
    ],
    free: [
      "Hello! How has your week been going?",
      "That sounds interesting! Tell me more about it.",
      "What are your plans for the weekend?",
    ],
  }

  const responses = isBeginner ? beginnerResponses : advancedResponses
  const list = responses[scenario] ?? responses.free
  // avoid unused var warning
  void msg
  return list[Math.floor(Math.random() * list.length)]
}
