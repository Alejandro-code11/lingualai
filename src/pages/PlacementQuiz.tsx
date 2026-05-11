import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { quizQuestions } from '../data/quizQuestions'
import type { CEFRLevel } from '../types'

type QuizPhase = 'intro' | 'question' | 'feedback' | 'result'

function calculateLevel(answers: boolean[]): CEFRLevel {
  const byLevel: Record<string, number[]> = { A1: [], A2: [], B1: [], B2: [] }
  quizQuestions.forEach((q, i) => {
    byLevel[q.level].push(answers[i] ? 1 : 0)
  })
  const score = (level: string) =>
    byLevel[level].reduce((a, b) => a + b, 0) / byLevel[level].length
  if (score('B2') >= 0.6) return 'B2'
  if (score('B1') >= 0.6) return 'B1'
  if (score('A2') >= 0.6) return 'A2'
  return 'A1'
}

const levelEmoji: Record<string, string> = { A1: '🌱', A2: '🌿', B1: '🌳', B2: '⭐', C1: '🔥', C2: '👑' }
const levelMsg: Record<string, string> = {
  A1: '¡Comienzas desde el principio! Eso es perfecto — aprenderás todo desde bases sólidas.',
  A2: '¡Tienes algo de base! Saltamos las cosas básicas y vamos al siguiente nivel.',
  B1: '¡Bien! Tienes un nivel intermedio. La ruta hacia B2 es tu próxima meta.',
  B2: '¡Impresionante! Ya estás cerca de tu objetivo de graduación.',
}

export default function PlacementQuiz() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [phase, setPhase] = useState<QuizPhase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [finalLevel, setFinalLevel] = useState<CEFRLevel>('A1')

  // Si el usuario se acaba de registrar mientras estaba en resultado, mandarlo al dashboard
  useEffect(() => {
    if (user && phase === 'result') {
      navigate('/dashboard')
    }
  }, [user])

  const question = quizQuestions[currentIndex]
  const total = quizQuestions.length
  const progress = (currentIndex / total) * 100
  const correctCount = answers.filter(Boolean).length

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setAnswers(prev => [...prev, idx === question.correct])
    setPhase('feedback')
  }

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      const level = calculateLevel([...answers])
      setFinalLevel(level)
      // Guardar en localStorage para recuperar después del registro
      localStorage.setItem('linguaai_quiz_level', level)
      setPhase('result')
    } else {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setPhase('question')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <span className="text-6xl block mb-6 animate-float">🎯</span>
              <h1 className="text-3xl font-bold text-textbase mb-3">Quiz de Nivel</h1>
              <p className="text-muted mb-4">20 preguntas · menos de 5 minutos · detectamos tu nivel exacto</p>
              <div className="glass rounded-2xl p-5 mb-8 text-left space-y-3">
                {[
                  'No hay respuestas correctas o incorrectas — es solo para calibrar.',
                  'Si no sabes algo, adivina. Está bien.',
                  'Al final te decimos en qué nivel estás y cómo empezar.',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-primary-light mt-0.5">✓</span>
                    <p className="text-sm text-muted">{tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPhase('question')}
                className="gradient-bg text-white font-semibold px-8 py-4 rounded-2xl text-lg glow-primary hover:opacity-90 transition-opacity"
              >
                Empezar quiz →
              </button>
            </motion.div>
          )}

          {/* QUESTION */}
          {(phase === 'question' || phase === 'feedback') && (
            <motion.div key={`q-${currentIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted">Pregunta {currentIndex + 1} de {total}</span>
                  <span className="text-xs text-primary-light font-medium bg-primary/20 px-2 py-0.5 rounded-full">{question.level}</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-4">
                <p className="text-lg font-semibold text-textbase leading-relaxed">{question.question}</p>
              </div>

              <div className="space-y-3 mb-6">
                {question.options.map((opt, i) => {
                  let style = 'bg-surface border border-border text-textbase hover:border-primary/50'
                  if (selected !== null) {
                    if (i === question.correct) style = 'bg-success/20 border-success text-success'
                    else if (i === selected) style = 'bg-danger/20 border-danger text-danger'
                    else style = 'bg-surface border border-border text-muted opacity-50'
                  }
                  return (
                    <motion.button
                      key={i}
                      whileHover={selected === null ? { scale: 1.02 } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between ${style}`}
                    >
                      <span className="font-medium">{opt}</span>
                      {selected !== null && i === question.correct && <CheckCircle size={18} className="text-success" />}
                      {selected !== null && i === selected && i !== question.correct && <XCircle size={18} className="text-danger" />}
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {phase === 'feedback' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`rounded-xl p-4 mb-4 text-sm ${selected === question.correct ? 'bg-success/10 border border-success/30 text-success' : 'bg-danger/10 border border-danger/30 text-danger'}`}>
                      <p className="font-semibold mb-1">{selected === question.correct ? '¡Correcto! 🎉' : 'Incorrecto'}</p>
                      <p className="text-xs opacity-90">{question.explanation}</p>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full gradient-bg text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {currentIndex + 1 >= total ? 'Ver resultado' : 'Siguiente'} <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* RESULT */}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-7xl mb-4 block"
              >
                {levelEmoji[finalLevel]}
              </motion.span>

              <h2 className="text-2xl font-bold text-textbase mb-1">Tu nivel es</h2>
              <div className="text-6xl font-bold gradient-text mb-4">{finalLevel}</div>
              <p className="text-muted text-sm mb-6 max-w-sm mx-auto">{levelMsg[finalLevel]}</p>

              {/* Score */}
              <div className="glass rounded-2xl p-5 mb-5">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">{correctCount}</p>
                    <p className="text-xs text-muted">Correctas de {total}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold gradient-text">{Math.round((correctCount / total) * 100)}%</p>
                    <p className="text-xs text-muted">Puntuación</p>
                  </div>
                </div>
              </div>

              {/* Nivel path */}
              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-1">
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l, i, arr) => (
                    <div key={l} className="flex items-center gap-1 flex-1">
                      <div className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold ${
                        l === finalLevel ? 'gradient-bg text-white' :
                        ['A1','A2','B1','B2','C1','C2'].indexOf(l) < ['A1','A2','B1','B2','C1','C2'].indexOf(finalLevel)
                          ? 'bg-success/20 text-success' : 'bg-surface text-muted'
                      }`}>{l}</div>
                      {i < arr.length - 1 && <div className="w-1 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA — registro o login */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/login?mode=register')}
                  className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-lg glow-primary hover:opacity-90 transition-opacity"
                >
                  🚀 Crear cuenta gratis y empezar
                </button>
                <p className="text-xs text-muted">Tu nivel <strong className="text-primary-light">{finalLevel}</strong> se guarda automáticamente al registrarte</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-surface border border-border text-muted font-medium py-3 rounded-2xl hover:text-textbase transition-colors text-sm"
                >
                  Ya tengo cuenta — Iniciar sesión
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
