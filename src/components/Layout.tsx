import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, ShoppingBag, MessageCircle, LogOut, Flame } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Inicio' },
  { path: '/lessons', icon: BookOpen, label: 'Lecciones' },
  { path: '/tutor', icon: MessageCircle, label: 'Tutor IA' },
  { path: '/store', icon: ShoppingBag, label: 'Tienda' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const { state } = useGame()
  const location = useLocation()
  const navigate = useNavigate()
  const profile = state.profile

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar */}
      <header className="glass sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span className="font-bold text-lg gradient-text">LinguaAI</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-textbase">{profile?.streak ?? 0}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border">
            <span className="text-base">🪙</span>
            <span className="text-sm font-semibold text-gold">{profile?.coins ?? 0}</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
            <span className="text-xs font-bold text-primary-light">{profile?.level ?? 'A1'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-danger"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 glass md:hidden px-2 py-2 flex justify-around z-50">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                active ? 'text-primary-light bg-primary/20' : 'text-muted hover:text-textbase'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Side nav (desktop) */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-56 glass flex-col gap-2 p-4 border-r border-border z-40">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'text-muted hover:text-textbase hover:bg-surface'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </aside>
    </div>
  )
}
