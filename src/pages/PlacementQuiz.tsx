import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, Volume2, BookOpen, Headphones } from 'lucide-react'
import { questionsByLevel, passThreshold } from '../data/quizQuestions'
import { useAuth } from '../contexts/AuthContext'
import type { CEFRLevel } from '../types'

type QuizPhase = 'intro' | 'question' | 'feedback' | 'level-complete' | 'result'

const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2']

const levelEmoji: Record<string, string> = { A1: '🌱', A2: '🌿', B1: '🌳', B2: '⭐', C1: '🔥', C2: '👑' }
const levelMsg: Record<string, string> = {
  A1: '¡Comienzas desde el principio! Es perfecto — aprenderás todo desde bases sólidas.',
  A2: '¡Tienes algo de base! Saltamos las cosas básicas y vamos al siguiente nivel.',
  B1: '¡Bien! Tienes un nivel intermedio. La ruta hacia B2 es tu próxima meta.',
  B2: '¡Impresionante! Ya cumples el nivel de graduación. Sigue rumbo a C1.',
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.85
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export default function PlacementQuiz() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [phase, setPhase] = useState<QuizPhase>('intro')
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>('A1')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [scoreByLevel, setScoreByLevel] = useState<Record<CEFRLevel, number>>({ A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 })
  const [finalLevel, setFinalLevel] = useState<CEFRLevel>('A1')
  const [autoPlayed, setAutoPlayed] = useState(false)
  const totalAnswered = useRef(0)

  const levelQuestions = questionsByLevel[currentLevel]
  const question = levelQuestions[questionIndex]
  const totalForLevel = levelQuestions.length

  // Si el usuario ya está logueado al ver resultado, mandarlo al dashboard
  useEffect(() => {
    if (user && phase === 'result') navigate('/dashboard')
  }, [user, phase, navigate])

  // Auto-reproducir audio al entrar a pregunta de listening
  useEffect(() => {
    if (phase === 'question' && question?.type === 'listening' && !autoPlayed && question.audioText) {
      setTimeout(() => speak(question.audioText!), 500)
      setAutoPlayed(true)
    }
  }, [phase, question, autoPlayed])

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    window.speechSynthesis?.cancel()
    setSelected(idx)
    if (idx === question.correct) {
      setScoreByLevel(prev => ({ ...prev, [currentLevel]: prev[currentLevel] + 1 }))
    }
    totalAnswered.current += 1
    setPhase('feedback')
  }

  const handleNext = () => {
    setSelected(null)
    setAutoPlayed(false)

    // ¿Quedan más preguntas en este nivel?
    if (questionIndex + 1 < totalForLevel) {
      setQuestionIndex(i => i + 1)
      setPhase('question')
      return
    }

    // Terminamos el nivel — evaluar
    const passed = scoreByLevel[currentLevel] >= passThreshold[currentLevel]
    const isLastLevel = currentLevel === 'B2'

    if (!passed) {
      // No pasó este nivel — el nivel final es el anterior (o A1 si falló A1)
      const idx = levelOrder.indexOf(currentLevel)
      setFinalLevel(idx > 0 ? levelOrder[idx - 1] : 'A1')
      localStorage.setItem('linguaai_quiz_level', idx > 0 ? levelOrder[idx - 1] : 'A1')
      setPhase('result')
      return
    }

    if (isLastLevel) {
      // Pasó B2, ese es su nivel
      setFinalLevel('B2')
      localStorage.setItem('linguaai_quiz_level', 'B2')
      setPhase('result')
      return
    }

    // Pasó este nivel, mostrar transición y avanzar al siguiente
    setPhase('level-complete')
  }

  const handleNextLevel = () => {
    const idx = levelOrder.indexOf(currentLevel)
    const next = levelOrder[idx + 1]
    setCurrentLevel(next)
    setQuestionIndex(0)
    setPhase('question')
  }

  const totalQuestionsExpected = levelOrder
    .slice(0, levelOrder.indexOf(currentLevel) + 1)
    .reduce((sum, l) => sum + questionsByLevel[l].length, 0)
  const overallProgress = (totalAnswered.current / totalQuestionsExpected) * 100

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
              <p className="text-muted mb-6">Quiz adaptativo · 7-30 preguntas según tu nivel</p>
              <div className="glass rounded-2xl p-5 mb-8 text-left space-y-3">
                {[
                  { i: '🎯', t: 'Es adaptativo: si fallas mucho en un nivel, paramos ahí.' },
                  { i: '🎧', t: 'Hay preguntas de listening — necesitas audio activo.' },
                  { i: '📖', t: 'También hay comprensión de lectura corta.' },
                  { i: '✏️', t: 'Si no sabes algo, adivina. Tu nivel se calcula al final.' },
                ].map(({ i, t }, k) => (
                  <div key={k} className="flex items-start gap-3">
                    <span>{i}</span>
                    <p className="text-sm text-muted">{t}</p>
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

          {/* QUESTION / FEEDBACK */}
          {(phase === 'question' || phase === 'feedback') && question && (
            <motion.div key={`q-${question.id}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted">Pregunta {questionIndex + 1} de {totalForLevel}</span>
                  <span className="text-xs text-primary-light font-medium bg-primary/20 px-2 py-0.5 rounded-full">{currentLevel}</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" animate={{ width: `${overallProgress}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              {/* Type badge */}
              {question.type !== 'multiple-choice' && (
                <div className="mb-3 flex items-center gap-2">
                  {question.type === 'listening' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-medium">
                      <Headphones size={12} /> Escucha
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium">
                      <BookOpen size={12} /> Lectura
                    </span>
                  )}
                </div>
              )}

              {/* Question card */}
              <div className="glass rounded-2xl p-6 mb-4">
                {/* Reading passage */}
                {question.type === 'reading' && question.passage && (
                  <div className="bg-surface border border-border rounded-xl p-4 mb-4 text-sm text-textbase leading-relaxed italic">
                    {question.passage}
                  </div>
                )}

                {/* Listening replay button */}
                {question.type === 'listening' && question.audioText && (
                  <button
                    onClick={() => speak(question.audioText!)}
                    className="w-full mb-4 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-medium py-4 rounded-xl transition-all"
                  >
                    <Volume2 size={18} /> Reproducir audio
                  </button>
                )}

                <p className="text-lg font-semibold text-textbase leading-relaxed">{question.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((opt: string, i: number) => {
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
                      {selected !== null && i === question.correct && <CheckCircle size={18} className="text-success shrink-0" />}
                      {selected !== null && i === selected && i !== question.correct && <XCircle size={18} className="text-danger shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>

              {/* Feedback */}
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
                      Siguiente <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* LEVEL COMPLETE */}
          {phase === 'level-complete' && (
            <motion.div key="level-complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="text-6xl mb-4 block">
                🎉
              </motion.span>
              <h2 className="text-2xl font-bold text-textbase mb-2">¡Pasaste {currentLevel}!</h2>
              <p className="text-muted text-sm mb-6">
                {scoreByLevel[currentLevel]} de {totalForLevel} correctas. Ahora vamos al nivel {levelOrder[levelOrder.indexOf(currentLevel) + 1]}.
              </p>
              <div className="glass rounded-2xl p-5 mb-6 text-left">
                <p className="text-xs text-muted mb-3 uppercase tracking-wider">Próximo nivel</p>
                <div className="flex items-center gap-2">
                  {levelOrder.map((l) => (
                    <div key={l} className={`flex-1 text-center py-2 rounded-lg text-xs font-bold ${
                      l === levelOrder[levelOrder.indexOf(currentLevel) + 1] ? 'gradient-bg text-white' :
                      levelOrder.indexOf(l) <= levelOrder.indexOf(currentLevel) ? 'bg-success/20 text-success' : 'bg-surface text-muted'
                    }`}>{l}</div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleNextLevel}
                className="w-full gradient-bg text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continuar al nivel {levelOrder[levelOrder.indexOf(currentLevel) + 1]} <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* RESULT */}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="text-7xl mb-4 block">
                {levelEmoji[finalLevel]}
              </motion.span>

              <h2 className="text-2xl font-bold text-textbase mb-1">Tu nivel es</h2>
              <div className="text-6xl font-bold gradient-text mb-4">{finalLevel}</div>
              <p className="text-muted text-sm mb-6 max-w-sm mx-auto">{levelMsg[finalLevel]}</p>

              {/* Score por nivel */}
              <div className="glass rounded-2xl p-5 mb-5">
                <p className="text-xs text-muted mb-3 uppercase tracking-wider">Tu desempeño</p>
                <div className="space-y-2">
                  {levelOrder.map(l => {
                    const score = scoreByLevel[l]
                    const total = questionsByLevel[l].length
                    const passed = score >= passThreshold[l]
                    const attempted = score > 0 || levelOrder.indexOf(l) <= levelOrder.indexOf(currentLevel)
                    if (!attempted) return null
                    return (
                      <div key={l} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted w-6">{l}</span>
                        <div className="flex-1 progress-bar h-2">
                          <div className="progress-fill h-full" style={{ width: `${(score / total) * 100}%` }} />
                        </div>
                        <span className={`text-xs font-medium w-16 text-right ${passed ? 'text-success' : 'text-muted'}`}>
                          {score}/{total} {passed ? '✓' : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Camino */}
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

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-lg glow-primary hover:opacity-90 transition-opacity"
                >
                  🚀 Crear cuenta gratis y empezar
                </button>
                <p className="text-xs text-muted">Tu nivel <strong className="text-primary-light">{finalLevel}</strong> se guarda automáticamente</p>
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
