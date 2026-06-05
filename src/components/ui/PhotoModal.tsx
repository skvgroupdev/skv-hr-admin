import { useEffect } from 'react'
import { X } from 'lucide-react'

interface PhotoModalProps {
  url: string
  onClose: () => void
}

export default function PhotoModal({ url, onClose }: PhotoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-700" />
        </button>
        <img
          src={url}
          alt="selfie"
          className="max-w-lg max-h-[80vh] object-contain rounded-xl shadow-xl"
        />
      </div>
    </div>
  )
}
