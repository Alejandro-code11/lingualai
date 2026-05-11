import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Brain, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

type Screen = 'auth' | 'choose'

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()
  const [screen, setScreen] = useState<Screen>('auth')
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const afterAuth = () => {
    setScreen('choose')
  }

  const handleGoogle = async () => {
    try {
      setLoading(true)
      setError('')
      await signInWithGoogle()
      // Google no distingue fácil nuevo vs existente, siempre mostramos elección
      setScreen('choose')
    } catch {
      setError('No se pudo iniciar sesión con Google. Verifica que Firebase esté configurado.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Completa todos los campos.'); return }
    try {
      setLoading(true)
      setError('')
      if (mode === 'login') {
        await signInWithEmail(email, password)
        navigate('/dashboard')
      } else {
        await signUpWithEmail(email, password)
        afterAuth()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('Email o contraseña incorrectos.')
      } else if (msg.includes('email-already-in-use')) {
        setError('Este email ya tiene una cuenta. Inicia sesión.')
      } else if (msg.includes('weak-password')) {
        setError('La contraseña debe tener al menos 6 caracteres.')
      } else {
        setError('Error al conectar. Verifica que Firebase esté configurado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">

        {/* PANTALLA AUTH */}
        {screen === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-8">
              <Link to="/">
                <span className="text-5xl animate-float inline-block">🌍</span>
              </Link>
              <h1 className="text-2xl font-bold text-textbase mt-4">
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta gratis'}
              </h1>
              <p className="text-muted text-sm mt-1">
                {mode === 'login' ? 'Continúa tu progreso' : 'Empieza a aprender inglés hoy'}
              </p>
            </div>

            <div className="glass rounded-3xl p-6">
              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full bg-surface border border-border hover:border-primary/40 text-textbase font-medium py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 mb-6"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted text-xs">o con email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleEmail} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-textbase placeholder-muted text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-11 text-textbase placeholder-muted text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-textbase">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-danger text-xs bg-danger/10 border border-danger/20 rounded-xl p-3">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-bg text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              </form>

              <p className="text-center text-muted text-sm mt-5">
                {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }}
                  className="text-primary-light hover:underline font-medium"
                >
                  {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
                </button>
              </p>

              <div className="mt-4 pt-4 border-t border-border text-center">
                <button
                  onClick={() => navigate('/placement-quiz')}
                  className="text-xs text-muted hover:text-primary-light transition-colors"
                >
                  Hacer el quiz sin registrarme →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PANTALLA ELECCIÓN después de registrarse */}
        {screen === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md text-center"
          >
            <span className="text-5xl block mb-4 animate-float">🎉</span>
            <h1 className="text-2xl font-bold text-textbase mb-2">¡Cuenta creada!</h1>
            <p className="text-muted text-sm mb-8">¿Cómo quieres empezar?</p>

            <div className="flex flex-col gap-4">
              {/* Quiz */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/placement-quiz')}
                className="glass rounded-2xl p-6 text-left card-hover border-primary/20 hover:border-primary/50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shrink-0">
                    <Brain size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-textbase mb-1">Hacer el quiz de nivel</p>
                    <p className="text-muted text-sm">Detectamos en qué nivel estás y empezamos exactamente desde ahí. Recomendado.</p>
                    <span className="text-xs text-primary-light mt-2 inline-block">5 minutos · 20 preguntas</span>
                  </div>
                </div>
              </motion.button>

              {/* Empezar directo */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="glass rounded-2xl p-6 text-left card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center shrink-0">
                    <Zap size={22} className="text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-textbase mb-1">Empezar desde cero</p>
                    <p className="text-muted text-sm">Empezar desde A1 directamente, sin hacer el quiz primero.</p>
                    <span className="text-xs text-muted mt-2 inline-block">Nivel A1 · Principiante</span>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
