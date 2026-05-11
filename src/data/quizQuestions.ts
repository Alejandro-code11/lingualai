import type { CEFRLevel } from '../types'

export interface QuizQuestion {
  id: number
  level: CEFRLevel
  type: 'multiple-choice' | 'listening' | 'reading'
  question: string
  audioText?: string // texto a reproducir con text-to-speech
  passage?: string // párrafo para comprensión lectora
  options: string[]
  correct: number
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  // ============ A1 (7 preguntas) ============
  {
    id: 1, level: 'A1', type: 'multiple-choice',
    question: '¿Qué significa "Hello" en español?',
    options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
    correct: 1,
    explanation: '"Hello" significa "Hola" — el saludo más común.',
  },
  {
    id: 2, level: 'A1', type: 'multiple-choice',
    question: 'Completa: "My name ___ Maria."',
    options: ['are', 'am', 'is', 'be'],
    correct: 2,
    explanation: 'Con "My name" usamos "is". = "Mi nombre ES María".',
  },
  {
    id: 3, level: 'A1', type: 'multiple-choice',
    question: '¿Cómo se dice el número 8 en inglés?',
    options: ['Six', 'Nine', 'Eight', 'Ten'],
    correct: 2,
    explanation: 'Six=6, Eight=8, Nine=9, Ten=10.',
  },
  {
    id: 4, level: 'A1', type: 'multiple-choice',
    question: '¿Cómo se dice "azul" en inglés?',
    options: ['Red', 'Green', 'Yellow', 'Blue'],
    correct: 3,
    explanation: 'Blue=azul, Red=rojo, Green=verde, Yellow=amarillo.',
  },
  {
    id: 5, level: 'A1', type: 'multiple-choice',
    question: '¿Cuándo usas "Good morning"?',
    options: ['En la noche', 'En la tarde', 'En la mañana', 'Al mediodía'],
    correct: 2,
    explanation: '"Good morning" significa "Buenos días" — se usa en la mañana.',
  },
  {
    id: 6, level: 'A1', type: 'listening',
    question: 'Escucha y elige lo que dijo:',
    audioText: 'What is your name?',
    options: ['What is your age?', 'What is your name?', 'Where are you from?', 'How old are you?'],
    correct: 1,
    explanation: 'Dijo "What is your name?" — ¿Cuál es tu nombre?',
  },
  {
    id: 7, level: 'A1', type: 'multiple-choice',
    question: '¿Cómo se dice "gracias" en inglés?',
    options: ['Sorry', 'Please', 'Thank you', 'Welcome'],
    correct: 2,
    explanation: '"Thank you" = gracias. "Sorry"=lo siento, "Please"=por favor.',
  },

  // ============ A2 (7 preguntas) ============
  {
    id: 8, level: 'A2', type: 'multiple-choice',
    question: '¿Cuál oración está correcta?',
    options: ['She go to school', 'She goes to school', 'She going to school', 'She goed to school'],
    correct: 1,
    explanation: 'Con she/he/it en presente simple añadimos -s al verbo: "goes".',
  },
  {
    id: 9, level: 'A2', type: 'multiple-choice',
    question: '¿Cuál es el pasado del verbo "go" (ir)?',
    options: ['Goed', 'Goes', 'Went', 'Gone'],
    correct: 2,
    explanation: '"Go" es irregular. Pasado: "went". Ej: "Yesterday I went" = Ayer fui.',
  },
  {
    id: 10, level: 'A2', type: 'multiple-choice',
    question: 'Completa: "Yesterday I ___ to the store."',
    options: ['go', 'goes', 'going', 'went'],
    correct: 3,
    explanation: '"Yesterday" (ayer) indica pasado, entonces "went".',
  },
  {
    id: 11, level: 'A2', type: 'multiple-choice',
    question: '¿Qué significa "although"?',
    options: ['Porque', 'Entonces', 'Aunque', 'Después'],
    correct: 2,
    explanation: '"Although" = "Aunque" — introduce una idea contraria.',
  },
  {
    id: 12, level: 'A2', type: 'multiple-choice',
    question: 'Completa: "I have been studying English ___ two years."',
    options: ['since', 'during', 'for', 'while'],
    correct: 2,
    explanation: 'Con período de tiempo (two years) usamos "for". "Since" va con fecha de inicio.',
  },
  {
    id: 13, level: 'A2', type: 'listening',
    question: 'Escucha y elige lo que dijo:',
    audioText: 'I went to the store yesterday.',
    options: [
      'I go to the store every day.',
      'I went to the store yesterday.',
      'I will go to the store tomorrow.',
      'I am going to the store now.',
    ],
    correct: 1,
    explanation: '"I went to the store yesterday" = Fui a la tienda ayer.',
  },
  {
    id: 14, level: 'A2', type: 'multiple-choice',
    question: '¿Qué significa "to forget"?',
    options: ['Recordar', 'Olvidar', 'Perdonar', 'Encontrar'],
    correct: 1,
    explanation: '"To forget" = olvidar. Lo opuesto es "to remember" (recordar).',
  },

  // ============ B1 (8 preguntas) ============
  {
    id: 15, level: 'B1', type: 'multiple-choice',
    question: '¿Cuál palabra significa lo mismo que "happy" (feliz)?',
    options: ['Sad', 'Angry', 'Joyful', 'Tired'],
    correct: 2,
    explanation: '"Joyful" es sinónimo de "happy". Sad=triste, Angry=enojado, Tired=cansado.',
  },
  {
    id: 16, level: 'B1', type: 'multiple-choice',
    question: 'Completa: "If I ___ more time, I would study more."',
    options: ['have', 'has', 'having', 'had'],
    correct: 3,
    explanation: 'Segunda condicional: "If + pasado, would + infinitivo". Por eso "had".',
  },
  {
    id: 17, level: 'B1', type: 'multiple-choice',
    question: 'Alguien te dice que está cansada. ¿Cómo lo reportas correctamente?',
    options: [
      'She telled me she was tired',
      'She told me that she is tired',
      'She told me that she was tired',
      'She said me she was tired',
    ],
    correct: 2,
    explanation: 'Reported speech: "told me that she was tired" — verbo en pasado, "told" no "said me".',
  },
  {
    id: 18, level: 'B1', type: 'multiple-choice',
    question: 'Completa: "I\'m interested ___ learning English."',
    options: ['on', 'at', 'in', 'by'],
    correct: 2,
    explanation: '"Interested in" — preposición fija. Como "interesado en".',
  },
  {
    id: 19, level: 'B1', type: 'multiple-choice',
    question: '¿Qué significa "nevertheless"?',
    options: ['Además', 'Por lo tanto', 'En cambio', 'Sin embargo'],
    correct: 3,
    explanation: '"Nevertheless" = "Sin embargo". Equivalente a "however".',
  },
  {
    id: 20, level: 'B1', type: 'listening',
    question: 'Escucha y elige lo que dijo:',
    audioText: "If I had known earlier, I would have called you.",
    options: [
      'If I knew earlier, I would call you.',
      'If I had known earlier, I would have called you.',
      'When I know earlier, I will call you.',
      'I knew earlier and I called you.',
    ],
    correct: 1,
    explanation: 'Tercera condicional: "Si hubiera sabido antes, te habría llamado".',
  },
  {
    id: 21, level: 'B1', type: 'reading',
    question: 'Según el texto, ¿qué hace Sarah los fines de semana?',
    passage: 'Sarah is a 28-year-old teacher who lives in London. During the week, she works at a primary school where she teaches English to young children. On weekends, she usually goes hiking with her friends or visits art galleries in the city. She loves cooking Italian food and is learning Spanish in her free time.',
    options: [
      'Trabaja en la escuela',
      'Cocina comida italiana o aprende español',
      'Hace senderismo o visita galerías de arte',
      'Enseña inglés a niños',
    ],
    correct: 2,
    explanation: 'El texto dice "On weekends, she usually goes hiking... or visits art galleries".',
  },
  {
    id: 22, level: 'B1', type: 'multiple-choice',
    question: 'Completa: "By the time we arrived, the movie ___."',
    options: ['started', 'has started', 'had started', 'was starting'],
    correct: 2,
    explanation: 'Past Perfect: una acción pasada antes que otra acción pasada. La película había empezado antes de que llegaramos.',
  },

  // ============ B2 (8 preguntas) ============
  {
    id: 23, level: 'B2', type: 'multiple-choice',
    question: 'Completa: "By the time he arrives, we ___ for two hours."',
    options: ['are waiting', 'will be waiting', 'waited', 'will have been waiting'],
    correct: 3,
    explanation: 'Future Perfect Continuous: acción que habrá estado ocurriendo hasta un punto futuro.',
  },
  {
    id: 24, level: 'B2', type: 'multiple-choice',
    question: '¿Qué significa "ubiquitous"?',
    options: ['Raro y único', 'Extremadamente grande', 'Presente en todas partes', 'Muy temporal'],
    correct: 2,
    explanation: '"Ubiquitous" = presente en todas partes simultáneamente.',
  },
  {
    id: 25, level: 'B2', type: 'multiple-choice',
    question: '¿Cuál es la opción más formal para un contexto académico?',
    options: [
      'What about the report?',
      'Can you tell me about the report?',
      'I want to know about the report.',
      'I would like to inquire about the report.',
    ],
    correct: 3,
    explanation: '"I would like to inquire" es la más formal — perfecta para emails académicos.',
  },
  {
    id: 26, level: 'B2', type: 'multiple-choice',
    question: 'Completa: "Had I known about the problem, I ___ it."',
    options: ['would solve', 'had solved', 'would have solved', 'was solving'],
    correct: 2,
    explanation: 'Tercera condicional invertida: "Had I known... would have + participio".',
  },
  {
    id: 27, level: 'B2', type: 'multiple-choice',
    question: '¿Cuál es la forma pasiva correcta de "They are building a new hospital"?',
    options: [
      'A new hospital is being built.',
      'A new hospital has been built.',
      'A new hospital was built.',
      'A new hospital will be built.',
    ],
    correct: 0,
    explanation: 'Presente continuo pasivo: "is/are being + participio" = está siendo construido.',
  },
  {
    id: 28, level: 'B2', type: 'listening',
    question: 'Escucha el siguiente texto y elige la idea principal:',
    audioText: "Despite the heavy rain that fell throughout the morning, the conference proceeded as scheduled, with all participants arriving on time and engaging actively in the discussions.",
    options: [
      'La conferencia fue cancelada por la lluvia.',
      'La lluvia retrasó la conferencia pero terminó bien.',
      'A pesar de la lluvia, la conferencia transcurrió normalmente.',
      'Los participantes llegaron tarde por la lluvia.',
    ],
    correct: 2,
    explanation: '"Despite the heavy rain... the conference proceeded as scheduled" = A pesar de la lluvia, la conferencia siguió como estaba planeada.',
  },
  {
    id: 29, level: 'B2', type: 'reading',
    question: '¿Cuál es la conclusión principal del texto?',
    passage: 'Recent studies have shown that learning a second language not only improves communication skills but also enhances cognitive abilities such as memory, problem-solving, and multitasking. Furthermore, bilingual individuals are statistically less likely to develop certain age-related cognitive disorders. However, the benefits depend significantly on the consistency and depth of language exposure.',
    options: [
      'Aprender un segundo idioma es solo útil para comunicarse.',
      'Solo los bilingües desde la niñez obtienen beneficios cognitivos.',
      'Los beneficios cognitivos del bilingüismo dependen de la consistencia.',
      'Los trastornos cognitivos no se pueden prevenir con idiomas.',
    ],
    correct: 2,
    explanation: 'El texto concluye: "the benefits depend significantly on the consistency and depth of language exposure".',
  },
  {
    id: 30, level: 'B2', type: 'multiple-choice',
    question: 'Elige el uso correcto del subjuntivo:',
    options: [
      'It\'s essential that he is on time.',
      'It\'s essential that he be on time.',
      'It\'s essential that he was on time.',
      'It\'s essential that he were on time.',
    ],
    correct: 1,
    explanation: 'Subjuntivo en inglés con verbos como "essential", "important": se usa el verbo en infinitivo sin "to" → "be".',
  },
]

// Agrupar por nivel
export const questionsByLevel: Record<CEFRLevel, QuizQuestion[]> = {
  A1: quizQuestions.filter(q => q.level === 'A1'),
  A2: quizQuestions.filter(q => q.level === 'A2'),
  B1: quizQuestions.filter(q => q.level === 'B1'),
  B2: quizQuestions.filter(q => q.level === 'B2'),
  C1: [],
  C2: [],
}

// Threshold para pasar cada nivel (≥ 65% correctas)
export const passThreshold: Record<CEFRLevel, number> = {
  A1: 5, A2: 5, B1: 5, B2: 5, C1: 99, C2: 99,
}
