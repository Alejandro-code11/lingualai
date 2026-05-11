import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GameProvider } from './contexts/GameContext'

// Code splitting — cada página se carga solo cuando se necesita
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const LanguageSelect = lazy(() => import('./pages/LanguageSelect'))
const PlacementQuiz = lazy(() => import('./pages/PlacementQuiz'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const LessonsPage = lazy(() => import('./pages/LessonsPage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const TutorPage = lazy(() => import('./pages/TutorPage'))

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

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/placement-quiz" element={<PlacementQuiz />} />
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
        <Route path="/store" element={
          <ProtectedRoute><GameProvider><StorePage /></GameProvider></ProtectedRoute>
        } />
        <Route path="/tutor" element={
          <ProtectedRoute><GameProvider><TutorPage /></GameProvider></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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
