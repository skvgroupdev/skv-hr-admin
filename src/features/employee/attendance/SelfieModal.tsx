import { useState, useEffect, useRef } from 'react'
import { X, Camera, RotateCcw, Check } from 'lucide-react'
import { stampTimestamp } from '../../../utils/stampTimestamp'

type ModalState = 'prompt' | 'camera' | 'preview'

interface SelfieModalProps {
  onCapture: (file: File) => void
  onSkip: () => void
  onClose: () => void
}

// ---- Camera view ----

interface CameraViewProps {
  onCapture: (file: File) => void
  onBack: () => void
}

function CameraView({ onCapture, onBack }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  useEffect(() => {
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() => {
        if (!cancelled) setCameraError('ບໍ່ສາມາດເປີດກ້ອງໄດ້ — ກວດສອບສິດທິ browser')
      })

    return () => {
      cancelled = true
      stopStream()
    }
  }, [])

  const captureFrame = async () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    stopStream()

    canvas.toBlob(
      async (blob) => {
        if (!blob) return
        const stamped = await stampTimestamp(blob, new Date())
        onCapture(stamped)
      },
      'image/jpeg',
      0.9,
    )
  }

  const handleBack = () => {
    stopStream()
    onBack()
  }

  if (cameraError) {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-red-600 text-center">{cameraError}</p>
        <button
          onClick={handleBack}
          className="w-full h-11 rounded-xl border border-gray-200 text-sm text-gray-600"
        >
          ກັບຄືນ
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-[3/4] object-cover rounded-xl bg-black"
      />
      <div className="flex items-center justify-between px-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
          ຍົກເລີກ
        </button>

        {/* Shutter button */}
        <button
          onClick={captureFrame}
          className="h-16 w-16 rounded-full bg-white border-4 border-gray-300 shadow-md flex items-center justify-center hover:border-gray-400 active:scale-95 transition-transform"
          aria-label="ຖ່າຍຮູບ"
        >
          <Camera className="h-7 w-7 text-gray-600" />
        </button>

        {/* Spacer to center shutter */}
        <div className="w-16" />
      </div>
    </div>
  )
}

// ---- Preview view ----

interface PreviewViewProps {
  file: File
  onUse: () => void
  onRetake: () => void
}

function PreviewView({ file, onUse, onRetake }: PreviewViewProps) {
  const previewUrl = URL.createObjectURL(file)

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return (
    <div className="space-y-4">
      <img
        src={previewUrl}
        alt="ຕົວຢ່າງຮູບ selfie"
        className="w-full aspect-[3/4] object-cover rounded-xl"
      />
      <div className="flex gap-3 px-1">
        <button
          onClick={onRetake}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-sm text-gray-600 flex items-center justify-center gap-1.5 hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
          ຖ່າຍໃໝ່
        </button>
        <button
          onClick={onUse}
          className="flex-1 h-11 rounded-xl bg-[#0D2B6B] text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0a2259] active:scale-[0.98] transition-transform"
        >
          <Check className="h-4 w-4" />
          ໃຊ້ຮູບນີ້
        </button>
      </div>
    </div>
  )
}

// ---- Prompt view ----

interface PromptViewProps {
  onTakePhoto: () => void
  onSkip: () => void
  onClose: () => void
}

function PromptView({ onTakePhoto, onSkip, onClose }: PromptViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-gray-800">ຖ່າຍຮູບບໍ?</p>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="text-sm text-gray-500">ທ່ານຕ້ອງການຖ່າຍຮູບເພື່ອຢັ້ງຢືນບໍ?</p>
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 h-12 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-transform"
        >
          ຂ້າມ
        </button>
        <button
          onClick={onTakePhoto}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#1A3A6B] to-[#0D2B6B] text-white text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          ຖ່າຍຮູບ
        </button>
      </div>
    </div>
  )
}

// ---- Main modal ----

export function SelfieModal({ onCapture, onSkip, onClose }: SelfieModalProps) {
  const [step, setStep] = useState<ModalState>('prompt')
  const [capturedFile, setCapturedFile] = useState<File | null>(null)

  const handleCameraCapture = (file: File) => {
    setCapturedFile(file)
    setStep('preview')
  }

  const handleRetake = () => {
    setCapturedFile(null)
    setStep('camera')
  }

  const handleUse = () => {
    if (capturedFile) onCapture(capturedFile)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
      onClick={step === 'prompt' ? onClose : undefined}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-2xl px-5 pt-5 pb-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'prompt' && (
          <PromptView
            onTakePhoto={() => setStep('camera')}
            onSkip={onSkip}
            onClose={onClose}
          />
        )}
        {step === 'camera' && (
          <CameraView
            onCapture={handleCameraCapture}
            onBack={() => setStep('prompt')}
          />
        )}
        {step === 'preview' && capturedFile && (
          <PreviewView
            file={capturedFile}
            onUse={handleUse}
            onRetake={handleRetake}
          />
        )}
      </div>
    </div>
  )
}
