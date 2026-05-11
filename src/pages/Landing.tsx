import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Brain, MessageCircle, Trophy, ChevronRight, Star } from 'lucide-react'

const features = [
  { icon: Brain, title: 'Quiz de Nivel', desc: 'Detectamos tu nivel exacto y empezamos desde ahí, no desde cero.', color: 'text-purple-400' },
  { icon: MessageCircle, title: 'Tutor IA 24/7', desc: 'Practica conversación real sin vergüenza. La IA te corrige y te reta.', color: 'text-blue-400' },
  { icon: Trophy, title: 'Tu Personaje', desc: 'Gana coins estudiando y personaliza tu avatar con ropa y accesorios.', color: 'text-gold' },
  { icon: Zap, title: 'Progreso Real', desc: 'Sistema científico que te hace repasar solo lo que necesitas aprender.', color: 'text-emerald-400' },
]

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌍</span>
          <span className="text-xl font-bold gradient-text">LinguaAI</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-muted hover:text-textbase transition-colors"
        >
          Iniciar sesión
        </button>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-24 text-center max-w-4xl mx-auto">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-7xl mb-6 animate-float inline-block"
        >
          🌍
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-textbase mb-4 leading-tight"
        >
          Aprende inglés{' '}
          <span className="gradient-text">en tiempo récord</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-muted max-w-2xl mx-auto mb-10"
        >
          De A1 a B2 en menos tiempo del que imaginas. Con IA como tutor personal,
          lecciones de 10 minutos y un personaje que crece contigo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/login')}
            className="gradient-bg text-white font-semibold px-8 py-4 rounded-2xl text-lg glow-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Empezar gratis <ChevronRight size={20} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-surface border border-border text-textbase font-medium px-8 py-4 rounded-2xl text-lg hover:border-primary/40 transition-all"
          >
            Ver mi nivel →
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-2 text-muted text-sm"
        >
          <div className="flex -space-x-2">
            {['🧑', '👩', '🧑‍🎓', '👨‍💻', '👩‍🏫'].map((e, i) => (
              <span key={i} className="text-xl bg-surface border-2 border-bg rounded-full w-8 h-8 flex items-center justify-center">
                {e}
              </span>
            ))}
          </div>
          <span>Miles aprendiendo hoy</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-gold fill-gold" />)}
          </div>
        </motion.div>
      </section>

      {/* Level progress visualization */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="glass rounded-3xl p-8"
        >
          <p className="text-center text-muted mb-6 text-sm uppercase tracking-widest">Tu camino</p>
          <div className="flex items-center justify-between gap-2">
            {levels.map((level, i) => (
              <div key={level} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeUp}
                  className={`w-full py-2 rounded-xl text-center text-sm font-bold ${
                    i <= 3
                      ? 'gradient-bg text-white'
                      : 'bg-surface border border-border text-muted'
                  }`}
                >
                  {level}
                </motion.div>
                {i < levels.length - 1 && (
                  <div className="w-full h-0.5 bg-border mt-1 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted mt-4 px-1">
            <span>Empiezas aquí</span>
            <span>Graduación ✓</span>
            <span>Dominio total</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-center text-textbase mb-12"
        >
          ¿Por qué es diferente?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              className="glass rounded-2xl p-6 card-hover"
            >
              <Icon size={28} className={`${color} mb-4`} />
              <h3 className="text-lg font-semibold text-textbase mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Time estimate */}
      <section className="px-6 py-12 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10"
        >
          <h2 className="text-2xl font-bold text-textbase mb-2">Con 20-30 minutos al día</h2>
          <p className="text-muted mb-8">Estimado para hispanohablantes desde cero</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { time: '2 meses', level: 'A2', desc: 'Inglés básico' },
              { time: '8 meses', level: 'B2', desc: 'Graduación ✓' },
              { time: '18 meses', level: 'C1', desc: 'Fluidez real' },
            ].map(({ time, level, desc }) => (
              <div key={level} className="flex flex-col items-center gap-2">
                <span className="text-2xl font-bold gradient-text">{time}</span>
                <span className="text-sm bg-primary/20 text-primary-light px-2 py-0.5 rounded-full font-semibold">{level}</span>
                <span className="text-xs text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-3xl font-bold text-textbase mb-4">¿Listo para empezar?</h2>
          <p className="text-muted mb-8">El quiz de nivel tarda menos de 5 minutos</p>
          <button
            onClick={() => navigate('/login')}
            className="gradient-bg text-white font-semibold px-10 py-4 rounded-2xl text-lg glow-primary hover:opacity-90 transition-opacity"
          >
            Empezar ahora — es gratis 🚀
          </button>
        </motion.div>
      </section>

      <footer className="text-center py-8 text-muted text-sm border-t border-border">
        <p>LinguaAI — Hecho para aprender de verdad 🌍</p>
      </footer>
    </div>
  )
}
