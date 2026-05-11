import { createContext, useContext, useEffect, useReducer } from 'react'
import type { ReactNode } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import type { CEFRLevel, Language, UserProfile } from '../types'

interface GameState {
  profile: UserProfile | null
  sessionMinutes: number
  isLoaded: boolean
}

type GameAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'SPEND_COINS'; payload: number }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'SET_LEVEL'; payload: CEFRLevel }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'ADD_MINUTES'; payload: number }
  | { type: 'PURCHASE_ITEM'; payload: string }
  | { type: 'EQUIP_ITEM'; payload: { type: string; id: string } }
  | { type: 'SET_SKIN'; payload: string }
  | { type: 'UPDATE_STREAK' }
  | { type: 'ADD_SESSION_MINUTES'; payload: number }
  | { type: 'SET_LOADED' }

const defaultProfile = (uid: string, email: string, name: string): UserProfile => ({
  uid, email,
  displayName: name,
  level: 'A1',
  language: 'english',
  coins: 50,
  xp: 0,
  streak: 0,
  lastStudyDate: '',
  todayMinutes: 0,
  totalMinutes: 0,
  completedLessons: [],
  purchasedItems: ['shirt-white', 'pants-blue'],
  equippedItems: { shirt: 'shirt-white', pants: 'pants-blue' },
  skinTone: 'medium',
  createdAt: new Date().toISOString(),
})

function gameReducer(state: GameState, action: GameAction): GameState {
  if (!state.profile) {
    if (action.type === 'SET_PROFILE') return { ...state, profile: action.payload, isLoaded: true }
    if (action.type === 'SET_LOADED') return { ...state, isLoaded: true }
    return state
  }

  const p = state.profile
  switch (action.type) {
    case 'SET_PROFILE': return { ...state, profile: action.payload, isLoaded: true }
    case 'SET_LOADED': return { ...state, isLoaded: true }
    case 'ADD_COINS': return { ...state, profile: { ...p, coins: p.coins + action.payload } }
    case 'SPEND_COINS': return { ...state, profile: { ...p, coins: Math.max(0, p.coins - action.payload) } }
    case 'ADD_XP': return { ...state, profile: { ...p, xp: p.xp + action.payload } }
    case 'SET_LEVEL': return { ...state, profile: { ...p, level: action.payload } }
    case 'SET_LANGUAGE': return { ...state, profile: { ...p, language: action.payload } }
    case 'COMPLETE_LESSON': {
      const completed = p.completedLessons.includes(action.payload)
        ? p.completedLessons
        : [...p.completedLessons, action.payload]
      return { ...state, profile: { ...p, completedLessons: completed } }
    }
    case 'ADD_MINUTES': return {
      ...state,
      profile: { ...p, todayMinutes: p.todayMinutes + action.payload, totalMinutes: p.totalMinutes + action.payload },
    }
    case 'ADD_SESSION_MINUTES': return { ...state, sessionMinutes: state.sessionMinutes + action.payload }
    case 'PURCHASE_ITEM': return {
      ...state,
      profile: { ...p, purchasedItems: [...p.purchasedItems, action.payload] },
    }
    case 'EQUIP_ITEM': return {
      ...state,
      profile: { ...p, equippedItems: { ...p.equippedItems, [action.payload.type]: action.payload.id } },
    }
    case 'SET_SKIN': return { ...state, profile: { ...p, skinTone: action.payload } }
    case 'UPDATE_STREAK': {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const last = p.lastStudyDate
      const streak = last === today ? p.streak : last === yesterday ? p.streak + 1 : 1
      return { ...state, profile: { ...p, streak, lastStudyDate: today } }
    }
    default: return state
  }
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  saveProfile: () => Promise<void>
  completeLesson: (lessonId: string, coins: number, xp: number, minutes: number) => Promise<void>
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(gameReducer, { profile: null, sessionMinutes: 0, isLoaded: false })

  useEffect(() => {
    if (!user) {
      // Load from localStorage for guest users
      const saved = localStorage.getItem('linguaai_guest')
      if (saved) {
        dispatch({ type: 'SET_PROFILE', payload: JSON.parse(saved) })
      } else {
        const guest = defaultProfile('guest', '', 'Estudiante')
        localStorage.setItem('linguaai_guest', JSON.stringify(guest))
        dispatch({ type: 'SET_PROFILE', payload: guest })
      }
      return
    }
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      dispatch({ type: 'SET_PROFILE', payload: snap.data() as UserProfile })
    } else {
      // Recover quiz level and guest progress if exists
      const savedLevel = localStorage.getItem('linguaai_quiz_level') as CEFRLevel | null
      const guestData = localStorage.getItem('linguaai_guest')
      const guest = guestData ? JSON.parse(guestData) : null
      const profile = defaultProfile(user.uid, user.email ?? '', user.displayName ?? 'Learner')
      if (savedLevel) profile.level = savedLevel
      if (guest) {
        profile.coins = guest.coins
        profile.completedLessons = guest.completedLessons
      }
      localStorage.removeItem('linguaai_quiz_level')
      localStorage.removeItem('linguaai_guest')
      await setDoc(ref, profile)
      dispatch({ type: 'SET_PROFILE', payload: profile })
    }
  }

  const saveProfile = async () => {
    if (!state.profile) return
    if (!user) {
      localStorage.setItem('linguaai_guest', JSON.stringify(state.profile))
      return
    }
    await setDoc(doc(db, 'users', user.uid), state.profile)
  }

  const completeLesson = async (lessonId: string, coins: number, xp: number, minutes: number) => {
    dispatch({ type: 'COMPLETE_LESSON', payload: lessonId })
    dispatch({ type: 'ADD_COINS', payload: coins })
    dispatch({ type: 'ADD_XP', payload: xp })
    dispatch({ type: 'ADD_MINUTES', payload: minutes })
    dispatch({ type: 'UPDATE_STREAK' })
    await saveProfile()
  }

  return (
    <GameContext.Provider value={{ state, dispatch, saveProfile, completeLesson }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
