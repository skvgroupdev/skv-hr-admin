import { useRef } from 'react'
import { Upload, Trash2, FileText } from 'lucide-react'
import { useUploadMutation } from '../../hooks/mutations/useUploadMutation'
import { toast } from './Toast'
import { cn } from '../../lib/cn'

interface FileUploadProps {
  type?: string           // 'profile' | 'chat' | 'image' → skv-hr/{type}/uuid.ext
  currentUrl?: string
  currentKey?: string
  accept?: string
  onUploaded: (url: string, key: string) => void
  onDeleted?: () => void
  label?: string
}

const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url)

function FilePreview({ url }: { url: string }) {
  if (isImageUrl(url)) {
    return (
      <img
        src={url}
        alt="preview"
        className="h-24 w-24 rounded-lg object-cover border border-gray-200"
      />
    )
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <FileText className="h-5 w-5 text-gray-500 shrink-0" />
      <span className="text-xs text-gray-600 truncate max-w-[160px]">{url.split('/').pop()}</span>
    </div>
  )
}

export function FileUpload({
  type,
  currentUrl,
  currentKey,
  accept,
  onUploaded,
  onDeleted,
  label = 'ເລືອກໄຟລ໌',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, remove, update } = useUploadMutation({
    onSuccess: ({ url, key }) => onUploaded(url, key),
  })

  const isPending = upload.isPending || update.isPending || remove.isPending

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (currentKey) {
      update.mutate(
        { oldKey: currentKey, file: selectedFile, type },
        { onError: () => toast.error('ອັບໂຫລດໄຟລ໌ລົ້ມເຫລວ') },
      )
    } else {
      upload.mutate(
        { file: selectedFile, type },
        { onError: () => toast.error('ອັບໂຫລດໄຟລ໌ລົ້ມເຫລວ') },
      )
    }

    // reset so same file can be re-selected
    e.target.value = ''
  }

  const handleDelete = () => {
    if (!currentKey) return
    remove.mutate(
      { key: currentKey },
      {
        onSuccess: () => onDeleted?.(),
        onError: () => toast.error('ລຶບໄຟລ໌ລົ້ມເຫລວ'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {currentUrl && <FilePreview url={currentUrl} />}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700',
            'hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isPending ? (
            <svg className="h-4 w-4 animate-spin text-[#0D2B6B]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isPending ? 'ກຳລັງອັບໂຫລດ...' : label}
        </button>

        {currentKey && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            ລຶບ
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
