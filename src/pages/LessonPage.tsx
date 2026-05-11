import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, ChevronRight, Trophy, Lightbulb } from 'lucide-react'
import { getLessonById } from '../data/lessons'
import { useGame } from '../contexts/GameContext'
import Layout from '../components/Layout'

type Phase = 'question' | 'feedback' | 'complete'

export default function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { completeLesson, state } = useGame()
  const navigate = useNavigate()

  const lesson = getLessonById(id ?? '')
  const [phase, setPhase] = useState<Phase>('question')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showHint, setShowHint] = useState(false)

  if (!lesson) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted mb-4">Lección no encontrada</p>
          <button onClick={() => navigate('/lessons')} className="gradient-bg text-white px-4 py-2 rounded-xl text-sm">Volver</button>
        </div>
      </div>
    </Layout>
  )

  const exercise = lesson.exercises[currentIndex]
  const total = lesson.exercises.length
  const progress = ((currentIndex) / total) * 100
  const alreadyDone = state.profile?.completedLessons.includes(lesson.id)

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === exercise.correct) setCorrectCount(c => c + 1)
    setPhase('feedback')
  }

  const handleNext = async () => {
    if (currentIndex + 1 >= total) {
      setPhase('complete')
      if (!alreadyDone) {
        await completeLesson(lesson.id, lesson.coins, lesson.xpReward, 8)
      }
    } else {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setShowHint(false)
      setPhase('question')
    }
  }

  const isCorrect = selected === exercise.correct
  const score = Math.round((correctCount / total) * 100)

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 md:pl-64">

        <AnimatePresence mode="wait">

          {/* EXERCISE */}
          {(phase === 'question' || phase === 'feedback') && (
            <motion.div
              key={`ex-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate(-1)} className="text-muted hover:text-textbase p-2 -ml-2">
                  <X size={20} />
                </button>
                <div className="flex-1 mx-4">
                  <div className="progress-bar">
                    <motion.div className="progress-fill" animate={{ width: `${progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted">{currentIndex + 1}/{total}</span>
              </div>

              {/* Lesson type badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">
                  {lesson.type === 'vocabulary' ? '📚' : lesson.type === 'grammar' ? '✏️' : lesson.type === 'listening' ? '🎧' : '🎤'}
                </span>
                <div>
                  <p className="font-semibold text-textbase">{lesson.title}</p>
                  <p className="text-xs text-muted capitalize">{lesson.type} · {lesson.level}</p>
                </div>
              </div>

              {/* Question */}
              <div className="glass rounded-2xl p-6 mb-5">
                <p className="text-xl font-semibold text-textbase leading-relaxed">{exercise.question}</p>
                {exercise.hint && (
                  <button
                    onClick={() => setShowHint(v => !v)}
                    className="mt-3 text-xs text-primary-light flex items-center gap-1 hover:opacity-80"
                  >
                    <Lightbulb size={12} /> {showHint ? 'Ocultar pista' : 'Ver pista'}
                  </button>
                )}
                {showHint && exercise.hint && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-sm text-gold bg-gold/10 border border-gold/20 rounded-xl p-3"
                  >
                    💡 {exercise.hint}
                  </motion.p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-5">
                {exercise.options?.map((opt, i) => {
                  let cls = 'bg-surface border border-border text-textbase hover:border-primary/50 cursor-pointer'
                  if (selected !== null) {
                    if (i === exercise.correct) cls = 'bg-success/15 border-success text-success cursor-default'
                    else if (i === selected) cls = 'bg-danger/15 border-danger text-danger cursor-default'
                    else cls = 'bg-surface border border-border text-muted opacity-40 cursor-default'
                  }
                  return (
                    <motion.button
                      key={i}
                      whileHover={selected === null ? { scale: 1.01 } : {}}
                      whileTap={selected === null ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between font-medium ${cls}`}
                    >
                      <span>{opt}</span>
                      {selected !== null && i === exercise.correct && <CheckCircle size={18} className="text-success shrink-0" />}
                      {selected !== null && i === selected && i !== exercise.correct && <XCircle size={18} className="text-danger shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {phase === 'feedback' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-success/10 border border-success/30' : 'bg-danger/10 border border-danger/30'}`}>
                      <p className={`font-semibold text-sm mb-0.5 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                        {isCorrect ? '¡Correcto! 🎉' : '¡Casi! Sigue intentando.'}
                      </p>
                      {exercise.hint && <p className="text-xs text-muted">{exercise.hint}</p>}
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full gradient-bg text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {currentIndex + 1 >= total ? '¡Ver resultado!' : 'Siguiente'} <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* COMPLETE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="text-7xl mb-4 block"
              >
                {score >= 80 ? '🏆' : score >= 60 ? '⭐' : '💪'}
              </motion.div>

              <h2 className="text-2xl font-bold text-textbase mb-1">
                {score >= 80 ? '¡Excelente!' : score >= 60 ? '¡Bien hecho!' : '¡Sigue practicando!'}
              </h2>
              <p className="text-muted text-sm mb-6">{lesson.title}</p>

              <div className="glass rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">{correctCount}</p>
                    <p className="text-xs text-muted">Correctas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold gradient-text">{score}%</p>
                    <p className="text-xs text-muted">Puntuación</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gold">+{alreadyDone ? 0 : lesson.coins}</p>
                    <p className="text-xs text-muted">Coins</p>
                  </div>
                </div>
              </div>

              {alreadyDone && (
                <p className="text-xs text-muted mb-4 bg-surface border border-border rounded-xl p-3">
                  Ya habías completado esta lección — las coins no se duplican. ¡Practica para reforzar!
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full gradient-bg text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Trophy size={18} /> Ir al dashboard
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(0)
                    setSelected(null)
                    setCorrectCount(0)
                    setPhase('question')
                  }}
                  className="w-full bg-surface border border-border text-textbase font-medium py-3 rounded-xl hover:border-primary/40 transition-all"
                >
                  Repetir lección
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </Layout>
  )
}
