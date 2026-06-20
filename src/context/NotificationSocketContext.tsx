import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../stores/useAuthStore'
import type { SocketNotificationNew, SocketLeaveStatusChanged, SocketOutsideWorkStatusChanged, SocketOTStatusChanged } from '../hooks/useNotificationSocket'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:4000'

interface SocketContextValue {
  isConnected: boolean
  lastNotification: SocketNotificationNew | null
  lastLeaveUpdate: SocketLeaveStatusChanged | null
  lastOutsideWorkUpdate: SocketOutsideWorkStatusChanged | null
  lastOTUpdate: SocketOTStatusChanged | null
}

const NotificationSocketContext = createContext<SocketContextValue>({
  isConnected: false,
  lastNotification: null,
  lastLeaveUpdate: null,
  lastOutsideWorkUpdate: null,
  lastOTUpdate: null,
})

export function NotificationSocketProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const socketRef = useRef<Socket | null>(null)

  const [value, setValue] = useState<SocketContextValue>({
    isConnected: false,
    lastNotification: null,
    lastLeaveUpdate: null,
    lastOutsideWorkUpdate: null,
    lastOTUpdate: null,
  })

  useEffect(() => {
    if (!user?.id) return

    const socket = io(`${WS_URL}/notifications`, {
      auth: { userId: user.id },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => setValue((p) => ({ ...p, isConnected: true })))
    socket.on('disconnect', () => setValue((p) => ({ ...p, isConnected: false })))

    socket.on('notification:new', (payload: SocketNotificationNew) => {
      setValue((p) => ({ ...p, lastNotification: payload }))
    })

    socket.on('leave:status_changed', (payload: SocketLeaveStatusChanged) => {
      setValue((p) => ({ ...p, lastLeaveUpdate: payload }))
    })

    socket.on('outside-work:status_changed', (payload: SocketOutsideWorkStatusChanged) => {
      setValue((p) => ({ ...p, lastOutsideWorkUpdate: payload }))
    })

    socket.on('ot:status_changed', (payload: SocketOTStatusChanged) => {
      setValue((p) => ({ ...p, lastOTUpdate: payload }))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setValue({ isConnected: false, lastNotification: null, lastLeaveUpdate: null, lastOutsideWorkUpdate: null, lastOTUpdate: null })
    }
  }, [user?.id])

  return (
    <NotificationSocketContext.Provider value={value}>
      {children}
    </NotificationSocketContext.Provider>
  )
}

export const useNotificationSocketContext = () => useContext(NotificationSocketContext)
