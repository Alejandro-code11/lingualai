import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Clock, ChevronRight, Trophy, AlertTriangle, Sparkles, Volume2 } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import Character from '../components/Character'
import Layout from '../components/Layout'
import { getLessonsByLevel, lessons } from '../data/lessons'
import { getDailyWords } from '../data/vocabulary'
import { achievements } from '../data/achievements'
import { getGreeting, getMotivationalQuote, getLevelLabel } from '../utils/greeting'

const DAILY_GOAL = 25

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

export default function Dashboard() {
  const { state, dispatch, saveProfile } = useGame()
  const location = useLocation()
  const profile = state.profile
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Guardar última página visitada
  useEffect(() => {
    if (profile) {
      dispatch({ type: 'SET_PROFILE', payload: { ...profile, lastVisitedPage: location.pathname } })
      saveProfile()
    }
  }, [location.pathname])

  // Timer sesión
  useEffect(() => {
    let count = 0
    timerRef.current = setInterval(() => {
      count += 1
      if (count % 60 === 0) dispatch({ type: 'ADD_MINUTES', payload: 1 })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  if (!profile) return (
    <Layout><div className="min-h-screen flex items-center justify-center text-muted">Cargando...</div></Layout>
  )

  const { greeting, emoji } = getGreeting(profile.displayName ?? 'Estudiante')
  const quote = getMotivationalQuote()
  const levelLabel = getLevelLabel(profile.level)
  const todayMinutes = profile.todayMinutes
  const goalProgress = Math.min((todayMinutes / DAILY_GOAL) * 100, 100)
  const goalMet = todayMinutes >= DAILY_GOAL

  // 3 acciones rápidas para "Aprende Hoy"
  const availableLessons = getLessonsByLevel(profile.level)
  const nextLesson = availableLessons.find(l => !profile.completedLessons.includes(l.id))
    ?? lessons.find(l => !profile.completedLessons.includes(l.id))

  // Vocabulario del día
  const dailyWords = getDailyWords(5, profile.level)

  // Vocabulario dominado %
  const totalLessonsAvailable = lessons.length
  const masteryPct = Math.round((profile.completedLessons.length / totalLessonsAvailable) * 100)

  // Logros desbloqueados
  const unlockedAchievements = achievements.filter(a => a.condition(profile))
  const newestAchievement = unlockedAchievements[unlockedAchievements.length - 1]

  // Progreso semanal (XP por día últimos 7 días)
  const today = new Date()
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toDateString()
  })
  const xpHistory = profile.dailyXpHistory ?? []
  const weekData = last7Days.map(date => {
    const entry = xpHistory.find(h => h.date === date)
    return { date, xp: entry?.xp ?? 0 }
  })
  const maxWeekXp = Math.max(...weekData.map(d => d.xp), 50)

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6 md:pl-64 pb-32">

        {/* Saludo personalizado */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-textbase flex items-center gap-2">
                {greeting} <span className="text-2xl">{emoji}</span>
              </h1>
              <p className="text-muted text-sm mt-1">
                {goalMet ? '¡Meta del día cumplida! 🎉' : `${DAILY_GOAL - todayMinutes} min más para tu meta de hoy`}
              </p>
            </div>
            <Character equippedItems={profile.equippedItems} skinTone={profile.skinTone} size="sm" />
          </div>
        </motion.div>

        {/* Frase motivacional del día */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-textbase italic">"{quote.en}"</p>
          <p className="text-xs text-muted mt-1">"{quote.es}"</p>
        </motion.div>

        {/* Stats principales */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard icon={<Flame size={18} className="text-orange-400" />} value={profile.streak} label="días seguidos" />
          <StatCard icon={<Trophy size={18} className="text-gold" />} value={profile.level} label={levelLabel} />
          <StatCard icon={<Sparkles size={18} className="text-primary-light" />} value={`${masteryPct}%`} label="dominado" />
        </div>

        {/* Meta del día */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              <span className="font-semibold text-textbase text-sm">Meta del día</span>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${goalMet ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary-light'}`}>
              {todayMinutes} / {DAILY_GOAL} min
            </span>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" animate={{ width: `${goalProgress}%` }} />
          </div>
        </motion.div>

        {/* APRENDE HOY — 3 acciones rápidas */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">📚 Aprende hoy</h2>
          <div className="grid gap-3">

            {/* Acción 1: Próxima lección */}
            {nextLesson && (
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="glass rounded-2xl p-5 flex items-center justify-between card-hover group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-2xl">
                    {nextLesson.type === 'vocabulary' ? '📚' : nextLesson.type === 'grammar' ? '✏️' : '🎧'}
                  </div>
                  <div>
                    <p className="font-semibold text-textbase">{nextLesson.title}</p>
                    <p className="text-xs text-muted">⏱️ {nextLesson.durationMin ?? 10} min · +{nextLesson.coins} coins</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted group-hover:text-textbase transition-colors" />
              </Link>
            )}

            {/* Acción 2: Vocabulario del día */}
            <Link
              to="/vocabulary"
              className="glass rounded-2xl p-5 flex items-center justify-between card-hover group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                  💡
                </div>
                <div>
                  <p className="font-semibold text-textbase">Vocabulario del día</p>
                  <p className="text-xs text-muted">⏱️ 5 min · 5 palabras nuevas con audio</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted group-hover:text-textbase transition-colors" />
            </Link>

            {/* Acción 3: Tutor IA */}
            <Link
              to="/tutor"
              className="glass rounded-2xl p-5 flex items-center justify-between card-hover group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <p className="font-semibold text-textbase">Hablar con tutor IA</p>
                  <p className="text-xs text-muted">⏱️ 10 min · Conversación real adaptada</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted group-hover:text-textbase transition-colors" />
            </Link>
          </div>
        </motion.section>

        {/* MODO EMERGENCIA */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link
            to="/emergency"
            className="glass rounded-2xl p-5 flex items-center gap-4 card-hover bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-textbase">🚨 Necesito inglés YA</p>
              <p className="text-xs text-muted">100 frases listas para situaciones reales</p>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </Link>
        </motion.section>

        {/* VOCABULARIO DEL DÍA */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">💡 Vocabulario del día</h2>
            <Link to="/vocabulary" className="text-xs text-primary-light hover:underline">Ver todas →</Link>
          </div>
          <div className="space-y-2">
            {dailyWords.slice(0, 3).map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                className="glass rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-textbase text-sm">{w.word}</p>
                  <p className="text-xs text-muted">{w.translation}</p>
                </div>
                <button
                  onClick={() => speak(w.word)}
                  className="p-2 bg-surface hover:bg-primary/20 rounded-lg transition-colors"
                >
                  <Volume2 size={14} className="text-primary-light" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PROGRESO SEMANAL */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">📊 Esta semana</h2>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-end justify-between gap-2 h-24">
              {weekData.map((d, i) => {
                const height = d.xp > 0 ? (d.xp / maxWeekXp) * 100 : 4
                const day = new Date(d.date).toLocaleDateString('es', { weekday: 'short' })
                const isToday = i === weekData.length - 1
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-full rounded-t-md ${isToday ? 'gradient-bg' : 'bg-primary/40'}`}
                    />
                    <span className={`text-xs ${isToday ? 'text-primary-light font-bold' : 'text-muted'}`}>{day.charAt(0).toUpperCase()}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-muted mt-3 pt-3 border-t border-border">
              <span>Total XP semana: <span className="text-textbase font-semibold">{weekData.reduce((s, d) => s + d.xp, 0)}</span></span>
              <span>XP total: <span className="text-textbase font-semibold">{profile.xp}</span></span>
            </div>
          </div>
        </motion.section>

        {/* LOGROS */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">🏆 Logros</h2>
            <Link to="/achievements" className="text-xs text-primary-light hover:underline">
              {unlockedAchievements.length} / {achievements.length} →
            </Link>
          </div>
          {newestAchievement ? (
            <Link to="/achievements" className="glass rounded-2xl p-5 flex items-center gap-4 card-hover">
              <span className="text-4xl">{newestAchievement.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-textbase text-sm">Último logro: {newestAchievement.title}</p>
                <p className="text-xs text-muted">{newestAchievement.description}</p>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </Link>
          ) : (
            <div className="glass rounded-2xl p-5 text-center">
              <p className="text-sm text-muted">Completa tu primera lección para desbloquear logros</p>
            </div>
          )}
        </motion.section>
      </div>
    </Layout>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-bold text-textbase">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}
