import type { Achievement } from '../types'

export const achievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Primera Lección',
    description: 'Completaste tu primera lección',
    emoji: '🌱',
    condition: p => p.completedLessons.length >= 1,
  },
  {
    id: 'five-lessons',
    title: 'Aprendiz Dedicado',
    description: 'Completaste 5 lecciones',
    emoji: '📚',
    condition: p => p.completedLessons.length >= 5,
  },
  {
    id: 'ten-lessons',
    title: 'Estudiante Constante',
    description: 'Completaste 10 lecciones',
    emoji: '🎓',
    condition: p => p.completedLessons.length >= 10,
  },
  {
    id: 'twenty-lessons',
    title: 'Maestro del Aprendizaje',
    description: 'Completaste 20 lecciones',
    emoji: '🏆',
    condition: p => p.completedLessons.length >= 20,
  },
  {
    id: 'streak-3',
    title: 'En Racha',
    description: '3 días consecutivos estudiando',
    emoji: '🔥',
    condition: p => p.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Una Semana Imparable',
    description: '7 días consecutivos',
    emoji: '⚡',
    condition: p => p.streak >= 7,
  },
  {
    id: 'streak-30',
    title: 'Hábito de Hierro',
    description: '30 días consecutivos',
    emoji: '💎',
    condition: p => p.streak >= 30,
  },
  {
    id: 'level-a2',
    title: '¡Nivel A2!',
    description: 'Subiste al nivel A2',
    emoji: '🌿',
    condition: p => ['A2', 'B1', 'B2', 'C1', 'C2'].includes(p.level),
  },
  {
    id: 'level-b1',
    title: '¡Nivel B1!',
    description: 'Subiste al nivel B1',
    emoji: '🌳',
    condition: p => ['B1', 'B2', 'C1', 'C2'].includes(p.level),
  },
  {
    id: 'level-b2',
    title: '¡Nivel B2 — Graduado!',
    description: 'Llegaste al nivel de graduación',
    emoji: '⭐',
    condition: p => ['B2', 'C1', 'C2'].includes(p.level),
  },
  {
    id: 'rich',
    title: 'Acumulador',
    description: 'Acumulaste 500 coins',
    emoji: '💰',
    condition: p => p.coins >= 500,
  },
  {
    id: 'fashionista',
    title: 'Fashionista',
    description: 'Compraste 5 items en la tienda',
    emoji: '🎨',
    condition: p => p.purchasedItems.length >= 5,
  },
]

export const getUnlockedAchievements = (profile: import('../types').UserProfile) =>
  achievements.filter(a => a.condition(profile))
