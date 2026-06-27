import { useAuthStore } from '../../../stores/useAuthStore'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'ສະບາຍດີຕອນເຊົ້າ'
  if (hour < 17) return 'ສະບາຍດີຕອນບ່າຍ'
  if (hour < 21) return 'ສະບາຍດີຕອນແລງ'
  return 'ສະບາຍດີຕອນເດິກ'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

function HeaderAvatar({ initials, avatarUrl }: { initials: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        className="h-12 w-12 rounded-full border-2 border-white/30 object-cover shrink-0"
      />
    )
  }
  return (
    <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-sm text-white shrink-0">
      {initials}
    </div>
  )
}


function BandingBadge({ banding }: { banding: string }) {
  return (
    <span className="inline-block text-xs font-medium bg-white/20 text-white/90 px-2 py-0.5 rounded-full">
      {banding}
    </span>
  )
}

export function HomeHeader() {
  const user = useAuthStore((s) => s.user)
  const initials = user ? getInitials(user.name) : '?'

  return (
    <div className="relative bg-gradient-to-br from-[#1A3A6B] to-[#0F2347] text-white px-5 pt-5 pb-12 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-400/10 translate-y-8 -translate-x-8 pointer-events-none" />
      <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-white/3 pointer-events-none" />

      <div className="relative">

        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-75">{getGreeting()}</p>
            <p className="text-2xl font-bold mt-0.5 tracking-tight">{user?.name ?? '-'}</p>

            {user?.position && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-80">{user.position.name}</span>
                {user.position.banding && <BandingBadge banding={user.position.banding} />}
              </div>
            )}

            {user?.workSchedule?.startTime && (
              <p className="text-xs opacity-70 mt-1">
                ເວລາເຂົ້າວຽກ: {user.workSchedule.startTime} ນ.
              </p>
            )}

            <p className="text-xs opacity-60 mt-1">{formatDate(new Date())}</p>
          </div>
          <HeaderAvatar initials={initials} avatarUrl={user?.avatarUrl} />
        </div>
      </div>
    </div>
  )
}
