import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import type { Language } from '../types'

const languages = [
  { id: 'english', flag: '🇺🇸', name: 'Inglés', native: 'English', available: true, desc: 'El más demandado del mundo' },
  { id: 'italian', flag: '🇮🇹', name: 'Italiano', native: 'Italiano', available: false, desc: 'Próximamente' },
  { id: 'german', flag: '🇩🇪', name: 'Alemán', native: 'Deutsch', available: false, desc: 'Próximamente' },
  { id: 'french', flag: '🇫🇷', name: 'Francés', native: 'Français', available: false, desc: 'Próximamente' },
]

export default function LanguageSelect() {
  const { dispatch, saveProfile } = useGame()
  const navigate = useNavigate()

  const handleSelect = async (lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang })
    await saveProfile()
    navigate('/placement-quiz')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-5xl mb-4 block">🌍</span>
          <h1 className="text-3xl font-bold text-textbase">¿Qué idioma quieres aprender?</h1>
          <p className="text-muted mt-2">Puedes cambiar o agregar idiomas más adelante</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {languages.map(({ id, flag, name, native, available, desc }, i) => (
            <motion.button
              key={id}
              custom={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              onClick={() => available && handleSelect(id as Language)}
              disabled={!available}
              className={`relative glass rounded-2xl p-6 text-center transition-all ${
                available
                  ? 'card-hover cursor-pointer hover:border-primary/40'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {!available && (
                <div className="absolute top-3 right-3">
                  <Lock size={14} className="text-muted" />
                </div>
              )}
              <span className="text-4xl block mb-3">{flag}</span>
              <p className="font-semibold text-textbase">{name}</p>
              <p className="text-xs text-muted">{native}</p>
              {available ? (
                <span className="mt-2 inline-block text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                  Disponible
                </span>
              ) : (
                <span className="mt-2 inline-block text-xs bg-surface text-muted px-2 py-0.5 rounded-full">
                  {desc}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
