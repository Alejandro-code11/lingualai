import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Lock, CheckCircle } from 'lucide-react'
import { storeItems, skinTones } from '../data/store'
import { useGame } from '../contexts/GameContext'
import Character from '../components/Character'
import Layout from '../components/Layout'
import type { CEFRLevel } from '../types'

type Category = 'all' | 'shirt' | 'pants' | 'hat' | 'glasses' | 'accessory'

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: 'all', label: 'Todo', emoji: '🛍️' },
  { id: 'shirt', label: 'Camisas', emoji: '👕' },
  { id: 'pants', label: 'Pantalones', emoji: '👖' },
  { id: 'hat', label: 'Gorros', emoji: '🧢' },
  { id: 'glasses', label: 'Gafas', emoji: '🕶️' },
  { id: 'accessory', label: 'Accesorios', emoji: '⭐' },
]

const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function StorePage() {
  const { state, dispatch, saveProfile } = useGame()
  const profile = state.profile
  const [category, setCategory] = useState<Category>('all')
  const [feedback, setFeedback] = useState<string | null>(null)

  if (!profile) return null

  const filtered = category === 'all' ? storeItems : storeItems.filter(i => i.type === category)

  const isOwned = (id: string) => profile.purchasedItems.includes(id)
  const isEquipped = (id: string) => Object.values(profile.equippedItems).includes(id)
  const isLevelLocked = (unlockLevel?: CEFRLevel) => {
    if (!unlockLevel) return false
    return levelOrder.indexOf(profile.level) < levelOrder.indexOf(unlockLevel)
  }

  const handleBuy = async (item: typeof storeItems[0]) => {
    if (profile.coins < item.price) { setFeedback('No tienes suficientes coins 🪙'); setTimeout(() => setFeedback(null), 2500); return }
    if (isLevelLocked(item.unlockLevel)) { setFeedback(`Necesitas nivel ${item.unlockLevel} 🔒`); setTimeout(() => setFeedback(null), 2500); return }
    dispatch({ type: 'SPEND_COINS', payload: item.price })
    dispatch({ type: 'PURCHASE_ITEM', payload: item.id })
    dispatch({ type: 'EQUIP_ITEM', payload: { type: item.type, id: item.id } })
    await saveProfile()
    setFeedback('¡Comprado y puesto! 🎉')
    setTimeout(() => setFeedback(null), 2500)
  }

  const handleEquip = async (item: typeof storeItems[0]) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { type: item.type, id: item.id } })
    await saveProfile()
  }

  const handleSkinTone = async (id: string) => {
    dispatch({ type: 'SET_SKIN', payload: id })
    await saveProfile()
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-6 md:pl-64">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-textbase flex items-center gap-2">
                <ShoppingBag size={24} className="text-primary-light" /> Tienda
              </h1>
              <p className="text-muted text-sm mt-1">Gana coins estudiando y personaliza tu personaje</p>
            </div>
            <div className="flex items-center gap-1.5 bg-surface px-3 py-2 rounded-xl border border-border">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-gold">{profile.coins}</span>
            </div>
          </div>

          {/* Feedback toast */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border text-textbase text-sm font-medium px-5 py-3 rounded-2xl shadow-xl"
            >
              {feedback}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Character preview */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4 sticky top-20">
                <p className="text-sm text-muted">Vista previa</p>
                <Character
                  equippedItems={profile.equippedItems}
                  skinTone={profile.skinTone}
                  size="lg"
                  animated
                />

                {/* Skin tones */}
                <div>
                  <p className="text-xs text-muted mb-2 text-center">Tono de piel</p>
                  <div className="flex gap-2 justify-center">
                    {skinTones.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => handleSkinTone(tone.id)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${profile.skinTone === tone.id ? 'border-primary scale-110' : 'border-transparent hover:border-border'}`}
                        style={{ backgroundColor: tone.color }}
                        title={tone.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="lg:col-span-2">
              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                      category === cat.id
                        ? 'gradient-bg text-white border-transparent'
                        : 'bg-surface border-border text-muted hover:text-textbase'
                    }`}
                  >
                    <span>{cat.emoji}</span> {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.map((item, i) => {
                  const owned = isOwned(item.id)
                  const equipped = isEquipped(item.id)
                  const locked = isLevelLocked(item.unlockLevel)
                  const canAfford = profile.coins >= item.price

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`glass rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all ${locked ? 'opacity-50' : ''} ${equipped ? 'border-primary/40 glow-primary' : 'card-hover'}`}
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <p className="text-xs font-medium text-textbase">{item.name}</p>

                      {item.unlockLevel && (
                        <span className="text-xs bg-primary/20 text-primary-light px-1.5 py-0.5 rounded-full">
                          {item.unlockLevel}
                        </span>
                      )}

                      {locked ? (
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Lock size={10} /> Nivel {item.unlockLevel}
                        </div>
                      ) : equipped ? (
                        <div className="flex items-center gap-1 text-xs text-success font-medium">
                          <CheckCircle size={12} /> Puesto
                        </div>
                      ) : owned ? (
                        <button
                          onClick={() => handleEquip(item)}
                          className="text-xs bg-primary/20 text-primary-light px-3 py-1 rounded-lg hover:bg-primary/30 transition-colors font-medium"
                        >
                          Ponerse
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            canAfford
                              ? 'gradient-bg text-white hover:opacity-90'
                              : 'bg-surface border border-border text-muted cursor-not-allowed'
                          }`}
                        >
                          🪙 {item.price}
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
