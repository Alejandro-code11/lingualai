export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type Language = 'english' | 'italian' | 'german' | 'french'

export interface Lesson {
  id: string
  title: string
  level: CEFRLevel
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking'
  xpReward: number
  coins: number
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'match' | 'translate' | 'listen-type'
  question: string
  options?: string[]
  correct: string | number
  audio?: string
  hint?: string
}

export interface CharacterOutfit {
  id: string
  name: string
  type: 'shirt' | 'pants' | 'hat' | 'glasses' | 'shoes' | 'accessory'
  price: number
  color: string
  emoji: string
  unlockLevel?: CEFRLevel
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  level: CEFRLevel
  language: Language
  coins: number
  xp: number
  streak: number
  lastStudyDate: string
  todayMinutes: number
  totalMinutes: number
  completedLessons: string[]
  purchasedItems: string[]
  equippedItems: Record<string, string>
  skinTone: string
  createdAt: string
}
