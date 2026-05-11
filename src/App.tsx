import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GameProvider } from './contexts/GameContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import LanguageSelect from './pages/LanguageSelect'
import PlacementQuiz from './pages/PlacementQuiz'
import Dashboard from './pages/Dashboard'
import LessonPage from './pages/LessonPage'
import LessonsPage from './pages/LessonsPage'
import StorePage from './pages/StorePage'
import TutorPage from './pages/TutorPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl animate-float">🌍</span>
        <p className="text-muted text-sm">Cargando...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/language-select" element={
        <ProtectedRoute>
          <GameProvider>
            <LanguageSelect />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="/placement-quiz" element={
        <ProtectedRoute>
          <GameProvider>
            <PlacementQuiz />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <GameProvider>
            <Dashboard />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="/lessons" element={
        <ProtectedRoute>
          <GameProvider>
            <LessonsPage />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="/lessons/:id" element={
        <ProtectedRoute>
          <GameProvider>
            <LessonPage />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="/store" element={
        <ProtectedRoute>
          <GameProvider>
            <StorePage />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="/tutor" element={
        <ProtectedRoute>
          <GameProvider>
            <TutorPage />
          </GameProvider>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
