import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Clock, Zap, ChevronRight, Star } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import Character from '../components/Character'
import Layout from '../components/Layout'
import { getLessonsByLevel } from '../data/lessons'

const DAILY_GOAL = 25

export default function Dashboard() {
  const { state, dispatch } = useGame()
  const profile = state.profile
  const [sessionTime, setSessionTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showGoalCelebration, setShowGoalCelebration] = useState(false)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionTime(t => {
        const next = t + 1
        if (next % 60 === 0) {
          dispatch({ type: 'ADD_MINUTES', payload: 1 })
        }
        return next
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  useEffect(() => {
    if (profile && profile.todayMinutes === DAILY_GOAL) {
      setShowGoalCelebration(true)
      setTimeout(() => setShowGoalCelebration(false), 4000)
    }
  }, [profile?.todayMinutes])

  if (!profile) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="text-muted">Cargando...</div></div>

  const todayMinutes = profile.todayMinutes
  const goalProgress = Math.min((todayMinutes / DAILY_GOAL) * 100, 100)
  const goalMet = todayMinutes >= DAILY_GOAL
  const sessionMinutes = Math.floor(sessionTime / 60)
  const sessionSeconds = sessionTime % 60
  const availableLessons = getLessonsByLevel(profile.level)
  const nextLesson = availableLessons.find(l => !profile.completedLessons.includes(l.id))
  const completedToday = availableLessons.filter(l => profile.completedLessons.includes(l.id)).length

  const xpToNextLevel = { A1: 200, A2: 400, B1: 800, B2: 1500, C1: 2500, C2: 9999 }
  const xpNeeded = xpToNextLevel[profile.level] ?? 200
  const xpProgress = Math.min((profile.xp / xpNeeded) * 100, 100)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 md:pl-64">

        {/* Goal celebration */}
        {showGoalCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-success text-white font-semibold px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2"
          >
            <Star className="fill-white" size={18} /> ¡Meta del día cumplida! 🎉
          </motion.div>
        )}

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-textbase">
            Hola, {profile.displayName?.split(' ')[0] ?? 'Learner'} 👋
          </h1>
          <p className="text-muted text-sm mt-1">
            {goalMet ? '¡Meta cumplida hoy! Puedes seguir si quieres 🔥' : `${DAILY_GOAL - todayMinutes} minutos más para cumplir la meta`}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Character card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 flex flex-col items-center gap-4"
          >
            <Character
              equippedItems={profile.equippedItems}
              skinTone={profile.skinTone}
              size="md"
              animated
            />
            <div className="text-center">
              <p className="font-semibold text-textbase">{profile.displayName?.split(' ')[0] ?? 'Learner'}</p>
              <p className="text-xs text-muted">Nivel {profile.level}</p>
            </div>
            <Link
              to="/store"
              className="text-xs text-primary-light hover:underline"
            >
              Personalizar →
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-6 flex flex-col gap-4"
          >
            {/* Streak */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-orange-400" />
                <span className="text-sm text-muted">Racha</span>
              </div>
              <span className="font-bold text-textbase text-lg">{profile.streak} días</span>
            </div>

            {/* Session timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-blue-400" />
                <span className="text-sm text-muted">Esta sesión</span>
              </div>
              <span className="font-bold text-textbase font-mono">
                {String(sessionMinutes).padStart(2, '0')}:{String(sessionSeconds).padStart(2, '0')}
              </span>
            </div>

            {/* Coins */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪙</span>
                <span className="text-sm text-muted">Coins</span>
              </div>
              <span className="font-bold text-gold text-lg">{profile.coins}</span>
            </div>

            {/* XP */}
            <div>
              <div className="flex justify-between text-xs text-muted mb-1.5">
                <span className="flex items-center gap-1"><Zap size={12} /> XP</span>
                <span>{profile.xp} / {xpNeeded}</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" animate={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </motion.div>

          {/* Daily goal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-textbase">Meta del día</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${goalMet ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary-light'}`}>
                {goalMet ? '¡Cumplida! ✓' : `${todayMinutes} / ${DAILY_GOAL} min`}
              </span>
            </div>

            {/* Circular-ish progress */}
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="38" fill="none" stroke="#1E1E35" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="38"
                    fill="none"
                    stroke={goalMet ? '#10B981' : '#7C3AED'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - goalProgress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-textbase">{todayMinutes}</span>
                  <span className="text-xs text-muted">min</span>
                </div>
              </div>
              <p className="text-xs text-muted text-center">
                {goalMet ? 'Puedes seguir si quieres 💪' : `Recomendado: ${DAILY_GOAL} min/día`}
              </p>
            </div>

            {/* Today's sessions */}
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Lecciones hoy</span>
              <span className="text-textbase font-medium">{completedToday}</span>
            </div>
          </motion.div>
        </div>

        {/* Next lesson */}
        {nextLesson && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Continúa aprendiendo</h2>
            <Link
              to={`/lessons/${nextLesson.id}`}
              className="glass rounded-2xl p-5 flex items-center justify-between card-hover block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-2xl">
                  {nextLesson.type === 'vocabulary' ? '📚' : nextLesson.type === 'grammar' ? '✏️' : nextLesson.type === 'listening' ? '🎧' : '🎤'}
                </div>
                <div>
                  <p className="font-semibold text-textbase">{nextLesson.title}</p>
                  <p className="text-xs text-muted capitalize">{nextLesson.type} · {nextLesson.level} · +{nextLesson.coins} coins</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 text-primary-light px-2 py-1 rounded-lg font-medium">Siguiente</span>
                <ChevronRight size={18} className="text-muted" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* All lessons */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Lecciones {profile.level}</h2>
            <Link to="/lessons" className="text-xs text-primary-light hover:underline">Ver todas →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableLessons.slice(0, 4).map(lesson => {
              const done = profile.completedLessons.includes(lesson.id)
              return (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className={`glass rounded-xl p-4 flex items-center gap-3 card-hover ${done ? 'opacity-70' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${done ? 'bg-success/20' : 'bg-primary/20'}`}>
                    {done ? '✓' : lesson.type === 'vocabulary' ? '📚' : lesson.type === 'grammar' ? '✏️' : '🎧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-textbase text-sm truncate">{lesson.title}</p>
                    <p className="text-xs text-muted">+{lesson.coins} coins</p>
                  </div>
                  {done && <span className="text-success text-xs font-medium">Completada</span>}
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
