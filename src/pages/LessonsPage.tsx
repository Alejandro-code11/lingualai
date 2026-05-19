import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Search, X } from 'lucide-react'
import { lessons } from '../data/lessons'
import { useGame } from '../contexts/GameContext'
import Layout from '../components/Layout'
import type { CEFRLevel } from '../types'

const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const levelColors: Record<string, string> = {
  A1: 'from-emerald-500 to-teal-500',
  A2: 'from-blue-500 to-cyan-500',
  B1: 'from-violet-500 to-purple-500',
  B2: 'from-orange-500 to-amber-500',
  C1: 'from-red-500 to-rose-500',
  C2: 'from-yellow-400 to-amber-400',
}

const typeIcon: Record<string, string> = {
  vocabulary: '📚',
  grammar: '✏️',
  listening: '🎧',
  speaking: '🎤',
}

export default function LessonsPage() {
  const { state } = useGame()
  const profile = state.profile
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  if (!profile) return null

  const userLevelIdx = levels.indexOf(profile.level)
  const query = search.trim().toLowerCase()

  const filteredLessons = query || filterType !== 'all'
    ? lessons.filter(l => {
        const matchSearch = !query || l.title.toLowerCase().includes(query) || l.type.toLowerCase().includes(query)
        const matchType = filterType === 'all' || l.type === filterType
        return matchSearch && matchType
      })
    : null // null means show all grouped by level

  const totalCompleted = profile.completedLessons.length
  const totalLessons = lessons.filter(l => levels.indexOf(l.level) <= userLevelIdx + 1).length

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6 md:pl-64">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-textbase mb-0.5">Lecciones</h1>
              <p className="text-muted text-sm">
                Nivel actual: <span className="text-primary-light font-semibold">{profile.level}</span>
                <span className="mx-2 text-border">·</span>
                <span className="text-textbase font-medium">{totalCompleted}</span>
                <span className="text-muted"> / {totalLessons} completadas</span>
              </p>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar lección..."
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-textbase placeholder-muted focus:outline-none focus:border-primary/60 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-textbase">
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-textbase focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="vocabulary">📚 Vocabulario</option>
              <option value="grammar">✏️ Gramática</option>
              <option value="listening">🎧 Listening</option>
              <option value="speaking">🎤 Speaking</option>
            </select>
          </div>

          {/* Search results */}
          {filteredLessons !== null ? (
            filteredLessons.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-muted text-sm">No se encontraron lecciones para "{search}"</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredLessons.map((lesson, i) => {
                  const levelIdx = levels.indexOf(lesson.level)
                  const isLocked = levelIdx > userLevelIdx + 1
                  const done = profile.completedLessons.includes(lesson.id)

                  if (isLocked) {
                    return (
                      <div key={lesson.id} className="glass rounded-xl p-4 flex items-center gap-3 opacity-40">
                        <div className="w-10 h-10 rounded-xl bg-border flex items-center justify-center">
                          <Lock size={16} className="text-muted" />
                        </div>
                        <div>
                          <p className="font-medium text-textbase text-sm">{lesson.title}</p>
                          <p className="text-xs text-muted">{lesson.level} · Bloqueado</p>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                    >
                      <Link
                        to={`/lessons/${lesson.id}`}
                        className={`glass rounded-xl p-4 flex items-center gap-3 card-hover block ${done ? 'border-success/20' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${done ? 'bg-success/20' : 'bg-primary/20'}`}>
                          {done ? '✅' : (typeIcon[lesson.type] ?? '📖')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-textbase text-sm truncate">{lesson.title}</p>
                          <p className="text-xs text-muted">{lesson.level} · {lesson.type} · +{lesson.coins} coins</p>
                        </div>
                        {done && <span className="text-success text-xs shrink-0">✓</span>}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )
          ) : (
            /* Normal grouped view */
            levels.map((level, levelIdx) => {
              const levelLessons = lessons.filter(l => l.level === level)
              const isLocked = levelIdx > userLevelIdx + 1
              const isActive = levelIdx <= userLevelIdx
              const completedCount = levelLessons.filter(l => profile.completedLessons.includes(l.id)).length

              return (
                <div key={level} className="mb-8">
                  {/* Level header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${levelColors[level]} flex items-center justify-center font-bold text-white text-sm ${isLocked ? 'opacity-40' : ''}`}>
                      {level}
                    </div>
                    <div>
                      <p className="font-semibold text-textbase">{level}</p>
                      <p className="text-xs text-muted">
                        {isLocked ? '🔒 Bloqueado' : `${completedCount} / ${levelLessons.length} completadas`}
                      </p>
                    </div>
                    {isActive && !isLocked && levelLessons.length > 0 && (
                      <div className="flex-1 ml-2">
                        <div className="progress-bar h-1.5">
                          <div
                            className="progress-fill"
                            style={{ width: `${(completedCount / levelLessons.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lessons grid */}
                  {levelLessons.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {levelLessons.map((lesson, i) => {
                        const done = profile.completedLessons.includes(lesson.id)
                        if (isLocked) {
                          return (
                            <div key={lesson.id} className="glass rounded-xl p-4 flex items-center gap-3 opacity-40">
                              <div className="w-10 h-10 rounded-xl bg-border flex items-center justify-center">
                                <Lock size={16} className="text-muted" />
                              </div>
                              <div>
                                <p className="font-medium text-textbase text-sm">{lesson.title}</p>
                                <p className="text-xs text-muted capitalize">{lesson.type}</p>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link
                              to={`/lessons/${lesson.id}`}
                              className={`glass rounded-xl p-4 flex items-center gap-3 card-hover block ${done ? 'border-success/20' : ''}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${done ? 'bg-success/20' : 'bg-primary/20'}`}>
                                {done ? '✅' : (typeIcon[lesson.type] ?? '📖')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-medium text-textbase text-sm truncate">{lesson.title}</p>
                                </div>
                                <p className="text-xs text-muted capitalize">{lesson.type} · ⏱️ {lesson.durationMin ?? 10} min · +{lesson.coins} coins</p>
                              </div>
                              {done && <span className="text-success text-xs shrink-0">✓</span>}
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className={`glass rounded-xl p-4 text-center ${isLocked ? 'opacity-40' : ''}`}>
                      <p className="text-muted text-sm">Próximamente más lecciones {level}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
