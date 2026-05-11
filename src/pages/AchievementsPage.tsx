import { motion } from 'framer-motion'
import { ArrowLeft, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { achievements } from '../data/achievements'
import { useGame } from '../contexts/GameContext'
import Layout from '../components/Layout'

export default function AchievementsPage() {
  const { state } = useGame()
  const navigate = useNavigate()
  const profile = state.profile
  if (!profile) return null

  const unlocked = achievements.filter(a => a.condition(profile))
  const locked = achievements.filter(a => !a.condition(profile))

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 md:pl-64">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted hover:text-textbase mb-4 text-sm">
          <ArrowLeft size={16} /> Volver
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center">
              <Trophy size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-textbase">Logros</h1>
              <p className="text-xs text-muted">{unlocked.length} de {achievements.length} desbloqueados</p>
            </div>
          </div>

          {/* Unlocked */}
          {unlocked.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-success font-semibold uppercase tracking-wider mb-3">✓ Desbloqueados</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {unlocked.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                    className="glass rounded-2xl p-4 text-center border-success/30"
                  >
                    <span className="text-4xl block mb-2">{a.emoji}</span>
                    <p className="font-semibold text-textbase text-sm">{a.title}</p>
                    <p className="text-xs text-muted mt-1">{a.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locked */}
          {locked.length > 0 && (
            <div>
              <p className="text-sm text-muted font-semibold uppercase tracking-wider mb-3">🔒 Por desbloquear</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {locked.map(a => (
                  <div key={a.id} className="glass rounded-2xl p-4 text-center opacity-50 grayscale">
                    <span className="text-4xl block mb-2">{a.emoji}</span>
                    <p className="font-semibold text-textbase text-sm">{a.title}</p>
                    <p className="text-xs text-muted mt-1">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
