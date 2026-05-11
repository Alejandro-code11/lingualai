const motivationalQuotes = [
  { en: 'Every expert was once a beginner.', es: 'Todo experto fue alguna vez principiante.' },
  { en: 'Practice makes progress.', es: 'La práctica te hace progresar.' },
  { en: 'Small steps every day lead to big results.', es: 'Pequeños pasos cada día llevan a grandes resultados.' },
  { en: "Don't be afraid to make mistakes.", es: 'No tengas miedo de cometer errores.' },
  { en: 'Your future self will thank you.', es: 'Tu yo del futuro te lo agradecerá.' },
  { en: 'Learning a language opens new worlds.', es: 'Aprender un idioma abre nuevos mundos.' },
  { en: 'Consistency beats perfection.', es: 'La constancia vence a la perfección.' },
  { en: 'You are stronger than your excuses.', es: 'Eres más fuerte que tus excusas.' },
  { en: 'Today is a new opportunity.', es: 'Hoy es una nueva oportunidad.' },
  { en: 'Speak it, even if it sounds weird.', es: 'Dilo, aunque suene raro.' },
]

export function getGreeting(name: string): { greeting: string; emoji: string } {
  const hour = new Date().getHours()
  const firstName = name.split(' ')[0]

  if (hour < 12) return { greeting: `Buenos días, ${firstName}`, emoji: '☀️' }
  if (hour < 19) return { greeting: `Buenas tardes, ${firstName}`, emoji: '🌤️' }
  return { greeting: `Buenas noches, ${firstName}`, emoji: '🌙' }
}

export function getMotivationalQuote() {
  // Frase del día: misma para todo el día
  const day = new Date().toDateString()
  const seed = day.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return motivationalQuotes[seed % motivationalQuotes.length]
}

export function getLevelLabel(level: string): string {
  if (level === 'A1' || level === 'A2') return 'Beginner'
  if (level === 'B1' || level === 'B2') return 'Intermediate'
  return 'Advanced'
}

export function daysSinceLastVisit(lastDateStr: string): number {
  if (!lastDateStr) return 0
  const last = new Date(lastDateStr)
  const today = new Date()
  const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}
