import type { VocabWord } from '../types'

export const vocabulary: VocabWord[] = [
  // A1 — Básico
  { id: 'v1', word: 'hello', translation: 'hola', example: 'Hello, how are you?', exampleTranslation: 'Hola, ¿cómo estás?', level: 'A1' },
  { id: 'v2', word: 'thank you', translation: 'gracias', example: 'Thank you very much.', exampleTranslation: 'Muchas gracias.', level: 'A1' },
  { id: 'v3', word: 'please', translation: 'por favor', example: 'Please help me.', exampleTranslation: 'Por favor, ayúdame.', level: 'A1' },
  { id: 'v4', word: 'sorry', translation: 'lo siento / perdón', example: "I'm sorry, I didn't know.", exampleTranslation: 'Lo siento, no sabía.', level: 'A1' },
  { id: 'v5', word: 'yes', translation: 'sí', example: 'Yes, I agree.', exampleTranslation: 'Sí, estoy de acuerdo.', level: 'A1' },
  { id: 'v6', word: 'no', translation: 'no', example: 'No, thank you.', exampleTranslation: 'No, gracias.', level: 'A1' },
  { id: 'v7', word: 'water', translation: 'agua', example: 'Can I have water, please?', exampleTranslation: '¿Me das agua, por favor?', level: 'A1' },
  { id: 'v8', word: 'food', translation: 'comida', example: 'The food is delicious.', exampleTranslation: 'La comida está deliciosa.', level: 'A1' },
  { id: 'v9', word: 'house', translation: 'casa', example: 'My house is small.', exampleTranslation: 'Mi casa es pequeña.', level: 'A1' },
  { id: 'v10', word: 'friend', translation: 'amigo/a', example: 'She is my best friend.', exampleTranslation: 'Ella es mi mejor amiga.', level: 'A1' },
  { id: 'v11', word: 'family', translation: 'familia', example: 'I love my family.', exampleTranslation: 'Amo a mi familia.', level: 'A1' },
  { id: 'v12', word: 'time', translation: 'tiempo / hora', example: 'What time is it?', exampleTranslation: '¿Qué hora es?', level: 'A1' },
  { id: 'v13', word: 'day', translation: 'día', example: 'Have a nice day!', exampleTranslation: '¡Que tengas buen día!', level: 'A1' },
  { id: 'v14', word: 'night', translation: 'noche', example: 'Good night, see you tomorrow.', exampleTranslation: 'Buenas noches, hasta mañana.', level: 'A1' },
  { id: 'v15', word: 'work', translation: 'trabajo / trabajar', example: 'I work in an office.', exampleTranslation: 'Trabajo en una oficina.', level: 'A1' },

  // A2 — Cotidiano
  { id: 'v16', word: 'busy', translation: 'ocupado/a', example: "I'm busy right now.", exampleTranslation: 'Estoy ocupado ahora.', level: 'A2' },
  { id: 'v17', word: 'tired', translation: 'cansado/a', example: "I'm so tired today.", exampleTranslation: 'Estoy muy cansado hoy.', level: 'A2' },
  { id: 'v18', word: 'expensive', translation: 'caro/a', example: 'This phone is expensive.', exampleTranslation: 'Este teléfono es caro.', level: 'A2' },
  { id: 'v19', word: 'cheap', translation: 'barato/a', example: 'I want something cheap.', exampleTranslation: 'Quiero algo barato.', level: 'A2' },
  { id: 'v20', word: 'beautiful', translation: 'hermoso/a', example: 'What a beautiful day!', exampleTranslation: '¡Qué día tan hermoso!', level: 'A2' },
  { id: 'v21', word: 'difficult', translation: 'difícil', example: 'English is not difficult.', exampleTranslation: 'El inglés no es difícil.', level: 'A2' },
  { id: 'v22', word: 'remember', translation: 'recordar', example: "I don't remember her name.", exampleTranslation: 'No recuerdo su nombre.', level: 'A2' },
  { id: 'v23', word: 'forget', translation: 'olvidar', example: "Don't forget your keys.", exampleTranslation: 'No olvides tus llaves.', level: 'A2' },
  { id: 'v24', word: 'understand', translation: 'entender', example: 'I understand you now.', exampleTranslation: 'Te entiendo ahora.', level: 'A2' },
  { id: 'v25', word: 'try', translation: 'intentar / probar', example: 'I will try my best.', exampleTranslation: 'Haré mi mejor intento.', level: 'A2' },

  // B1 — Intermedio
  { id: 'v26', word: 'although', translation: 'aunque', example: 'Although it rained, we went out.', exampleTranslation: 'Aunque llovió, salimos.', level: 'B1' },
  { id: 'v27', word: 'however', translation: 'sin embargo', example: "It's expensive, however worth it.", exampleTranslation: 'Es caro, sin embargo vale la pena.', level: 'B1' },
  { id: 'v28', word: 'achieve', translation: 'lograr / conseguir', example: 'You can achieve anything.', exampleTranslation: 'Puedes lograr cualquier cosa.', level: 'B1' },
  { id: 'v29', word: 'improve', translation: 'mejorar', example: 'I want to improve my English.', exampleTranslation: 'Quiero mejorar mi inglés.', level: 'B1' },
  { id: 'v30', word: 'realize', translation: 'darse cuenta', example: "I didn't realize the time.", exampleTranslation: 'No me di cuenta de la hora.', level: 'B1' },
  { id: 'v31', word: 'suggest', translation: 'sugerir', example: 'I suggest we leave early.', exampleTranslation: 'Sugiero que salgamos temprano.', level: 'B1' },
  { id: 'v32', word: 'avoid', translation: 'evitar', example: 'Try to avoid stress.', exampleTranslation: 'Trata de evitar el estrés.', level: 'B1' },
  { id: 'v33', word: 'support', translation: 'apoyar / apoyo', example: 'Thank you for your support.', exampleTranslation: 'Gracias por tu apoyo.', level: 'B1' },
  { id: 'v34', word: 'whereas', translation: 'mientras que', example: 'He likes tea, whereas I prefer coffee.', exampleTranslation: 'A él le gusta el té, mientras que yo prefiero café.', level: 'B1' },
  { id: 'v35', word: 'eventually', translation: 'finalmente / con el tiempo', example: 'Eventually, she agreed.', exampleTranslation: 'Finalmente, ella aceptó.', level: 'B1' },

  // B2 — Avanzado
  { id: 'v36', word: 'nevertheless', translation: 'sin embargo / no obstante', example: 'It was hard, nevertheless I succeeded.', exampleTranslation: 'Fue difícil, no obstante tuve éxito.', level: 'B2' },
  { id: 'v37', word: 'overwhelming', translation: 'abrumador', example: 'The response was overwhelming.', exampleTranslation: 'La respuesta fue abrumadora.', level: 'B2' },
  { id: 'v38', word: 'inquire', translation: 'preguntar (formal)', example: 'I would like to inquire about the job.', exampleTranslation: 'Me gustaría preguntar sobre el trabajo.', level: 'B2' },
  { id: 'v39', word: 'thorough', translation: 'minucioso / exhaustivo', example: 'She did a thorough job.', exampleTranslation: 'Hizo un trabajo minucioso.', level: 'B2' },
  { id: 'v40', word: 'concise', translation: 'conciso', example: 'Be concise in your answer.', exampleTranslation: 'Sé conciso en tu respuesta.', level: 'B2' },
]

export const getDailyWords = (count = 5, level?: string): VocabWord[] => {
  const pool = level ? vocabulary.filter(w => w.level === level) : vocabulary
  // Selección determinística basada en el día (mismas palabras todo el día)
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const shuffled = [...pool].sort((a, b) => {
    const ha = (a.id.charCodeAt(0) + seed) % 100
    const hb = (b.id.charCodeAt(0) + seed) % 100
    return ha - hb
  })
  return shuffled.slice(0, count)
}

export const getWordById = (id: string) => vocabulary.find(w => w.id === id)
