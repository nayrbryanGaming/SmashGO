'use client'
// src/components/booking/PreOrderForm.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus, Package } from 'lucide-react'

const ITEMS = [
  { id: 'raket-yonex', name: 'Raket Yonex (Sewa)', price: 25000, category: 'equipment', icon: '🏸' },
  { id: 'raket-victor', name: 'Raket Victor (Sewa)', price: 20000, category: 'equipment', icon: '🏸' },
  { id: 'shuttlecock-1', name: 'Shuttlecock IST (1 tabung)', price: 35000, category: 'consumable', icon: '🪶' },
  { id: 'shuttlecock-2', name: 'Shuttlecock Pro (1 tabung)', price: 50000, category: 'consumable', icon: '🪶' },
  { id: 'air-mineral', name: 'Air Mineral (600ml)', price: 5000, category: 'consumable', icon: '💧' },
  { id: 'isotonic', name: 'Pocari Sweat (500ml)', price: 8000, category: 'consumable', icon: '🥤' },
  { id: 'grip', name: 'Overgrip (1 biji)', price: 10000, category: 'equipment', icon: '🎯' },
  { id: 'kaos-kaki', name: 'Kaos Kaki Anti-slip', price: 15000, category: 'merchandise', icon: '🧦' },
]

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  icon: string
}

interface PreOrderFormProps {
  onCartChange?: (items: CartItem[], total: number) => void
}

export function PreOrderForm({ onCartChange }: PreOrderFormProps) {
  const [cart, setCart] = useState<Record<string, number>>({})

  function updateCart(itemId: string, delta: number) {
    setCart((prev) => {
      const newCart = { ...prev }
      const current = newCart[itemId] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) delete newCart[itemId]
      else newCart[itemId] = next

      // Notify parent
      const cartItems: CartItem[] = ITEMS
        .filter((i) => newCart[i.id])
        .map((i) => ({ id: i.id, name: i.name, price: i.price, qty: newCart[i.id], icon: i.icon }))
      const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
      onCartChange?.(cartItems, total)

      return newCart
    })
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = ITEMS.filter((i) => cart[i.id]).reduce((sum, i) => sum + i.price * (cart[i.id] || 0), 0)

  const categories = ['equipment', 'consumable', 'merchandise']
  const catLabels: Record<string, string> = { equipment: '🏸 Peralatan', consumable: '🛒 Konsumsi', merchandise: '👕 Merchandise' }

  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const items = ITEMS.filter((i) => i.category === cat)
        return (
          <div key={cat} className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{catLabels[cat]}</p>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${cart[item.id] ? 'border-indigo-500/50 bg-indigo-900/20' : 'border-slate-700/50 bg-slate-800/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-[10px] font-black text-indigo-400">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCart(item.id, -1)}
                      disabled={!cart[item.id]}
                      className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 flex items-center justify-center text-white transition-all"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className={`w-6 text-center font-black text-sm ${cart[item.id] ? 'text-indigo-400' : 'text-slate-600'}`}>
                      {cart[item.id] || 0}
                    </span>
                    <button
                      onClick={() => updateCart(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {totalItems > 0 && (
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">{totalItems} item dipilih</span>
          </div>
          <p className="font-black text-white">+Rp {totalPrice.toLocaleString('id-ID')}</p>
        </div>
      )}
    </div>
  )
}
