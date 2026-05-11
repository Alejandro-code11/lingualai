import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Volume2, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { emergencyCategories } from '../data/emergencyPhrases'

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

export default function EmergencyMode() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const category = emergencyCategories.find(c => c.id === selectedCategory)

  const allPhrases = emergencyCategories.flatMap(c =>
    c.phrases.map(p => ({ ...p, categoryEmoji: c.emoji, categoryTitle: c.title }))
  )
  const searchResults = search.length >= 2
    ? allPhrases.filter(p =>
        p.en.toLowerCase().includes(search.toLowerCase()) ||
        p.es.toLowerCase().includes(search.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => category ? setSelectedCategory(null) : navigate(-1)}
          className="p-2 -ml-2 hover:bg-surface rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-textbase flex items-center gap-2">
            🚨 Necesito inglés YA
          </h1>
          <p className="text-xs text-muted">100 frases listas para usar</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 pb-32">

        {/* Search */}
        {!category && (
          <div className="mb-6 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar frase en inglés o español..."
              className="w-full bg-surface border border-border rounded-2xl py-3 pl-11 pr-4 text-textbase placeholder-muted text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        )}

        {/* Search results */}
        {!category && search.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
            </p>
            {searchResults.map((p, i) => (
              <PhraseCard key={i} en={p.en} es={p.es} categoryEmoji={p.categoryEmoji} />
            ))}
          </motion.div>
        )}

        {/* Categories grid */}
        {!category && search.length < 2 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-muted mb-4">Elige tu situación:</p>
            <div className="grid grid-cols-2 gap-3">
              {emergencyCategories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="glass rounded-2xl p-5 text-left card-hover"
                >
                  <span className="text-3xl block mb-2">{cat.emoji}</span>
                  <p className="font-semibold text-textbase">{cat.title}</p>
                  <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                  <p className="text-xs text-primary-light mt-2">{cat.phrases.length} frases →</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phrases list */}
        <AnimatePresence mode="wait">
          {category && (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{category.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-textbase">{category.title}</h2>
                  <p className="text-xs text-muted">{category.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {category.phrases.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                  >
                    <PhraseCard en={p.en} es={p.es} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PhraseCard({ en, es, categoryEmoji }: { en: string; es: string; categoryEmoji?: string }) {
  return (
    <div className="glass rounded-xl p-4 flex items-start gap-3">
      <button
        onClick={() => speak(en)}
        className="shrink-0 w-10 h-10 gradient-bg rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <Volume2 size={16} className="text-white" />
      </button>
      <div className="flex-1 min-w-0">
        {categoryEmoji && <span className="text-xs text-muted mr-1">{categoryEmoji}</span>}
        <p className="text-textbase font-medium text-sm leading-snug">{en}</p>
        <p className="text-muted text-xs mt-0.5 leading-snug">{es}</p>
      </div>
    </div>
  )
}
