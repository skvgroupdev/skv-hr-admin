import { MapPin } from 'lucide-react'

interface GpsStatusBadgeProps {
  loading: boolean
  lat: number | null
  error: string | null
  checkedIn: boolean
}

export function GpsStatusBadge({ loading, lat, error, checkedIn }: GpsStatusBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPin className="h-4 w-4 text-employee-accent animate-pulse" />
        <span>ກຳລັງຫາຕຳແໜ່ງ...</span>
      </div>
    )
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-employee-danger text-xs font-medium transition-colors">
        <MapPin className="h-3.5 w-3.5" />
        {error}
      </span>
    )
  }

  if (checkedIn && lat) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-employee-success text-xs font-medium transition-colors">
        <MapPin className="h-3.5 w-3.5" />
        ຢູ່ໃນພື້ນທີ່
      </span>
    )
  }

  if (lat) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-employee-danger text-xs font-medium transition-colors">
        <MapPin className="h-3.5 w-3.5" />
        ຢູ່ອອກວຽກນອກ
      </span>
    )
  }

  return null
}
