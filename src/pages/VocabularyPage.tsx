import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Mic, MicOff, RotateCcw, ChevronRight, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getDailyWords } from '../data/vocabulary'
import { useGame } from '../contexts/GameContext'
import Layout from '../components/Layout'

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

export default function VocabularyPage() {
  const { state, dispatch, saveProfile } = useGame()
  const navigate = useNavigate()
  const profile = state.profile
  const words = getDailyWords(5, profile?.level)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [pronouncing, setPronouncing] = useState(false)
  const [pronounceFeedback, setPronounceFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [completed, setCompleted] = useState<string[]>([])

  if (!profile) return null
  const word = words[currentIdx]

  const handleKnown = async () => {
    if (!completed.includes(word.id)) {
      setCompleted(prev => [...prev, word.id])
      dispatch({ type: 'ADD_COINS', payload: 3 })
      dispatch({ type: 'ADD_XP', payload: 5 })
      await saveProfile()
    }
    nextWord()
  }

  const handleStudy = () => nextWord()

  const nextWord = () => {
    if (currentIdx + 1 >= words.length) {
      navigate('/dashboard')
    } else {
      setCurrentIdx(i => i + 1)
      setFlipped(false)
      setPronounceFeedback(null)
    }
  }

  const handlePronounce = () => {
    if (pronouncing) return
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 3
    setPronouncing(true)
    setPronounceFeedback(null)
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const said = e.results[0][0].transcript.toLowerCase().trim()
      const target = word.word.toLowerCase().trim()
      const isCorrect =
        said === target ||
        said.includes(target) ||
        target.includes(said)
      setPronounceFeedback(isCorrect ? 'correct' : 'incorrect')
      setPronouncing(false)
      if (isCorrect) {
        dispatch({ type: 'ADD_COINS', payload: 2 })
      }
    }
    recognition.onerror = () => { setPronouncing(false); setPronounceFeedback('incorrect') }
    recognition.onend = () => setPronouncing(false)
    recognition.start()
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-6 md:pl-64">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Vocabulario del día</span>
            <span className="text-xs text-primary-light font-medium">{currentIdx + 1} / {words.length}</span>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" animate={{ width: `${((currentIdx + 1) / words.length) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={word.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6"
          >
            {/* Flashcard */}
            <div
              className="glass rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer card-hover"
              onClick={() => setFlipped(f => !f)}
            >
              {!flipped ? (
                <>
                  <p className="text-xs text-muted uppercase tracking-wider mb-3">Palabra en inglés</p>
                  <h2 className="text-4xl font-bold text-textbase mb-3">{word.word}</h2>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(word.word) }}
                    className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center hover:opacity-90 transition-opacity mb-4"
                  >
                    <Volume2 size={18} className="text-white" />
                  </button>
                  <p className="text-xs text-muted">👆 Toca la tarjeta para ver la traducción</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted uppercase tracking-wider mb-3">Traducción</p>
                  <h2 className="text-3xl font-bold gradient-text mb-4">{word.translation}</h2>
                  <div className="bg-surface border border-border rounded-xl p-4 w-full text-left">
                    <p className="text-sm text-textbase italic">"{word.example}"</p>
                    <p className="text-xs text-muted mt-1">"{word.exampleTranslation}"</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(word.example) }}
                    className="mt-3 text-xs text-primary-light hover:underline flex items-center gap-1"
                  >
                    <Volume2 size={12} /> Escuchar el ejemplo
                  </button>
                </>
              )}
            </div>

            {/* Pronunciation practice */}
            {flipped && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="glass rounded-2xl p-5">
                  <p className="text-sm font-semibold text-textbase mb-3 text-center">🎤 Practica la pronunciación</p>
                  <div className="flex flex-col items-center gap-3">
                    <button
                      onClick={handlePronounce}
                      disabled={pronouncing}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        pronouncing
                          ? 'bg-danger/20 border-2 border-danger animate-pulse'
                          : pronounceFeedback === 'correct'
                          ? 'bg-success'
                          : pronounceFeedback === 'incorrect'
                          ? 'bg-danger/30'
                          : 'gradient-bg glow-primary hover:opacity-90'
                      }`}
                    >
                      {pronouncing ? <MicOff size={24} className="text-danger" /> : <Mic size={24} className="text-white" />}
                    </button>
                    {pronounceFeedback === 'correct' && (
                      <p className="text-success text-sm font-semibold flex items-center gap-1">
                        <Check size={14} /> ¡Excelente! +2 coins
                      </p>
                    )}
                    {pronounceFeedback === 'incorrect' && (
                      <p className="text-danger text-sm flex items-center gap-1">
                        <X size={14} /> Intenta de nuevo
                      </p>
                    )}
                    {!pronouncing && !pronounceFeedback && (
                      <p className="text-xs text-muted">Toca el mic y di la palabra</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleStudy}
            className="flex-1 bg-surface border border-border text-textbase font-medium py-3 rounded-2xl hover:border-primary/40 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Estudiar más
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 gradient-bg text-white font-semibold py-3 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            La sé <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Layout>
  )
}
