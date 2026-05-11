import type { CharacterOutfit } from '../types'

export const storeItems: CharacterOutfit[] = [
  // Shirts
  { id: 'shirt-white', name: 'White Tee', type: 'shirt', price: 0, color: '#F1F5F9', emoji: '👕' },
  { id: 'shirt-purple', name: 'Purple Tee', type: 'shirt', price: 50, color: '#7C3AED', emoji: '👕' },
  { id: 'shirt-blue', name: 'Blue Tee', type: 'shirt', price: 50, color: '#2563EB', emoji: '👕' },
  { id: 'shirt-red', name: 'Red Tee', type: 'shirt', price: 80, color: '#EF4444', emoji: '👕' },
  { id: 'shirt-hoodie', name: 'Cool Hoodie', type: 'shirt', price: 150, color: '#1E293B', emoji: '🧥' },
  { id: 'shirt-gold', name: 'Gold Hoodie', type: 'shirt', price: 300, color: '#F59E0B', emoji: '🧥' },
  { id: 'shirt-suit', name: 'Suit Jacket', type: 'shirt', price: 500, color: '#1E293B', emoji: '🤵', unlockLevel: 'B1' },

  // Pants
  { id: 'pants-blue', name: 'Blue Jeans', type: 'pants', price: 0, color: '#1D4ED8', emoji: '👖' },
  { id: 'pants-black', name: 'Black Pants', type: 'pants', price: 60, color: '#1E293B', emoji: '👖' },
  { id: 'pants-khaki', name: 'Khaki Pants', type: 'pants', price: 80, color: '#92400E', emoji: '👖' },
  { id: 'pants-red', name: 'Red Shorts', type: 'pants', price: 100, color: '#DC2626', emoji: '🩳' },
  { id: 'pants-formal', name: 'Formal Pants', type: 'pants', price: 400, color: '#374151', emoji: '👖', unlockLevel: 'B1' },

  // Hats
  { id: 'hat-cap', name: 'Baseball Cap', type: 'hat', price: 80, color: '#1E293B', emoji: '🧢' },
  { id: 'hat-beanie', name: 'Beanie', type: 'hat', price: 100, color: '#7C3AED', emoji: '🎩' },
  { id: 'hat-crown', name: 'Crown', type: 'hat', price: 500, color: '#F59E0B', emoji: '👑', unlockLevel: 'B2' },
  { id: 'hat-graduation', name: 'Graduation Cap', type: 'hat', price: 0, color: '#1E293B', emoji: '🎓', unlockLevel: 'B2' },

  // Glasses
  { id: 'glasses-round', name: 'Round Glasses', type: 'glasses', price: 120, color: '#92400E', emoji: '🕶️' },
  { id: 'glasses-cool', name: 'Cool Shades', type: 'glasses', price: 200, color: '#1E293B', emoji: '😎' },
  { id: 'glasses-smart', name: 'Smart Glasses', type: 'glasses', price: 150, color: '#374151', emoji: '🤓' },

  // Accessories
  { id: 'acc-star', name: 'Gold Star', type: 'accessory', price: 200, color: '#F59E0B', emoji: '⭐' },
  { id: 'acc-fire', name: 'Fire Streak', type: 'accessory', price: 300, color: '#EF4444', emoji: '🔥' },
  { id: 'acc-rocket', name: 'Rocket Pin', type: 'accessory', price: 250, color: '#7C3AED', emoji: '🚀' },
  { id: 'acc-book', name: 'English Book', type: 'accessory', price: 180, color: '#10B981', emoji: '📚' },
]

export const skinTones = [
  { id: 'light', color: '#FDDBB4', label: 'Light' },
  { id: 'medium-light', color: '#F0B895', label: 'Medium Light' },
  { id: 'medium', color: '#D4894A', label: 'Medium' },
  { id: 'medium-dark', color: '#A0522D', label: 'Medium Dark' },
  { id: 'dark', color: '#6B3A2A', label: 'Dark' },
]
