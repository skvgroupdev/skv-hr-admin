import { useRef } from 'react'
import { cn } from '../../lib/cn'

interface NumberInputProps {
  label?: string
  value: string        // raw digits, no commas
  onChange: (raw: string) => void  // returns raw digits string
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
  id?: string
}

function formatWithCommas(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  className,
  id,
}: NumberInputProps) {
  const inputId = id ?? label
  const inputRef = useRef<HTMLInputElement>(null)

  const displayed = formatWithCommas(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    onChange(raw)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        inputMode="numeric"
        value={displayed}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
          disabled && 'bg-gray-100 text-gray-400 cursor-not-allowed',
          className,
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
