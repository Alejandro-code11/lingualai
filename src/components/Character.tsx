import { storeItems, skinTones } from '../data/store'

interface CharacterProps {
  equippedItems: Record<string, string>
  skinTone: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export default function Character({ equippedItems, skinTone, size = 'md', animated = false }: CharacterProps) {
  const skin = skinTones.find(s => s.id === skinTone)?.color ?? '#D4894A'
  const shirt = storeItems.find(i => i.id === equippedItems.shirt)
  const pants = storeItems.find(i => i.id === equippedItems.pants)
  const hat = storeItems.find(i => i.id === equippedItems.hat)
  const glasses = storeItems.find(i => i.id === equippedItems.glasses)
  const accessory = storeItems.find(i => i.id === equippedItems.accessory)

  const sizes = { sm: 80, md: 120, lg: 180 }
  const s = sizes[size]
  const scale = s / 120

  return (
    <div
      className={`relative inline-flex flex-col items-center ${animated ? 'animate-float' : ''}`}
      style={{ width: s, height: s * 1.6 }}
    >
      <svg
        width={s}
        height={s * 1.6}
        viewBox="0 0 120 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hat */}
        {hat && (
          <text x="60" y="18" textAnchor="middle" fontSize={28 * scale} style={{ userSelect: 'none' }}>
            {hat.emoji}
          </text>
        )}

        {/* Head */}
        <ellipse cx="60" cy="42" rx="22" ry="24" fill={skin} />

        {/* Hair */}
        <ellipse cx="60" cy="22" rx="22" ry="10" fill="#3B1F0A" />

        {/* Eyes */}
        <ellipse cx="52" cy="42" rx="4" ry="5" fill="white" />
        <ellipse cx="68" cy="42" rx="4" ry="5" fill="white" />
        <circle cx="53" cy="43" r="2.5" fill="#1E293B" />
        <circle cx="69" cy="43" r="2.5" fill="#1E293B" />
        <circle cx="54" cy="42" r="0.8" fill="white" />
        <circle cx="70" cy="42" r="0.8" fill="white" />

        {/* Glasses */}
        {glasses && (
          <text x="60" y="50" textAnchor="middle" fontSize={18 * scale} style={{ userSelect: 'none' }}>
            {glasses.emoji}
          </text>
        )}

        {/* Nose */}
        <ellipse cx="60" cy="50" rx="3" ry="2" fill={skin} style={{ filter: 'brightness(0.85)' }} />

        {/* Mouth — smile */}
        <path d="M 52 57 Q 60 63 68 57" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Neck */}
        <rect x="54" y="64" width="12" height="10" rx="3" fill={skin} />

        {/* Body / Shirt */}
        <rect x="36" y="72" width="48" height="52" rx="10" fill={shirt?.color ?? '#F1F5F9'} />

        {/* Arms */}
        <rect x="18" y="72" width="20" height="40" rx="8" fill={shirt?.color ?? '#F1F5F9'} />
        <rect x="82" y="72" width="20" height="40" rx="8" fill={shirt?.color ?? '#F1F5F9'} />

        {/* Hands */}
        <ellipse cx="28" cy="115" rx="10" ry="9" fill={skin} />
        <ellipse cx="92" cy="115" rx="10" ry="9" fill={skin} />

        {/* Pants */}
        <rect x="36" y="120" width="22" height="52" rx="8" fill={pants?.color ?? '#1D4ED8'} />
        <rect x="62" y="120" width="22" height="52" rx="8" fill={pants?.color ?? '#1D4ED8'} />

        {/* Shoes */}
        <ellipse cx="47" cy="174" rx="14" ry="8" fill="#1E293B" />
        <ellipse cx="73" cy="174" rx="14" ry="8" fill="#1E293B" />

        {/* Accessory badge */}
        {accessory && (
          <text x="88" y="78" textAnchor="middle" fontSize={20 * scale} style={{ userSelect: 'none' }}>
            {accessory.emoji}
          </text>
        )}
      </svg>
    </div>
  )
}
