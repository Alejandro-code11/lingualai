import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GameProvider } from './contexts/GameContext'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const LanguageSelect = lazy(() => import('./pages/LanguageSelect'))
const PlacementQuiz = lazy(() => import('./pages/PlacementQuiz'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const LessonsPage = lazy(() => import('./pages/LessonsPage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const TutorPage = lazy(() => import('./pages/TutorPage'))
const EmergencyMode = lazy(() => import('./pages/EmergencyMode'))
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl animate-float">🌍</span>
        <p className="text-muted text-sm">Cargando...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Auto-redirect a la última página visitada
function AutoRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading || !user) return
    if (location.pathname !== '/' && location.pathname !== '/login') return
    // Si está en landing/login y ya logueado, redirigir a última página
    const lastPage = localStorage.getItem(`linguaai_lastpage_${user.uid}`)
    if (lastPage && lastPage !== '/login' && lastPage !== '/') {
      navigate(lastPage, { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, location.pathname, navigate])

  return <>{children}</>
}

// Trackeador de última página
function PageTracker() {
  const location = useLocation()
  const { user } = useAuth()
  useEffect(() => {
    if (!user) return
    if (location.pathname === '/login' || location.pathname === '/') return
    localStorage.setItem(`linguaai_lastpage_${user.uid}`, location.pathname)
  }, [location.pathname, user])
  return null
}

function AppRoutes() {
  return (
    <>
      <PageTracker />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<AutoRedirect><Landing /></AutoRedirect>} />
          <Route path="/login" element={<AutoRedirect><Login /></AutoRedirect>} />
          <Route path="/placement-quiz" element={<PlacementQuiz />} />
          <Route path="/emergency" element={<EmergencyMode />} />
          <Route path="/language-select" element={
            <ProtectedRoute><GameProvider><LanguageSelect /></GameProvider></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><GameProvider><Dashboard /></GameProvider></ProtectedRoute>
          } />
          <Route path="/lessons" element={
            <ProtectedRoute><GameProvider><LessonsPage /></GameProvider></ProtectedRoute>
          } />
          <Route path="/lessons/:id" element={
            <ProtectedRoute><GameProvider><LessonPage /></GameProvider></ProtectedRoute>
          } />
          <Route path="/vocabulary" element={
            <ProtectedRoute><GameProvider><VocabularyPage /></GameProvider></ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute><GameProvider><AchievementsPage /></GameProvider></ProtectedRoute>
          } />
          <Route path="/store" element={
            <ProtectedRoute><GameProvider><StorePage /></GameProvider></ProtectedRoute>
          } />
          <Route path="/tutor" element={
            <ProtectedRoute><GameProvider><TutorPage /></GameProvider></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
