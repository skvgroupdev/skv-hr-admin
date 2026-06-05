import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { create } from 'zustand'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error'
}

interface ToastStore {
  toasts: ToastItem[]
  addToast: (message: string, type: 'success' | 'error') => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message: string) => useToastStore.getState().addToast(message, 'success'),
  error: (message: string) => useToastStore.getState().addToast(message, 'error'),
}

function ToastItem({ item }: { item: ToastItem }) {
  const [visible, setVisible] = useState(false)
  const removeToast = useToastStore((s) => s.removeToast)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${item.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
    >
      {item.type === 'success' ? (
        <CheckCircle className="h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0" />
      )}
      <p className="text-sm font-medium">{item.message}</p>
      <button
        onClick={() => removeToast(item.id)}
        className="ml-auto rounded p-0.5 hover:bg-white/20 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} />
      ))}
    </div>
  )
}
