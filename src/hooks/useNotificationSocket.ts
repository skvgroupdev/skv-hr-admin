import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../stores/useAuthStore'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:4000'

export interface SocketNotificationNew {
  type: string
  message: string
  leaveRequestId?: string
  outsideWorkId?: string
}

export interface SocketLeaveStatusChanged {
  leaveRequestId: string
  status: 'APPROVED' | 'REJECTED'
  approverName?: string
  reason?: string
  comment?: string
}

export interface SocketOutsideWorkStatusChanged {
  outsideWorkId: string
  status: 'APPROVED' | 'REJECTED'
  reason?: string
  comment?: string
}

export interface SocketOTStatusChanged {
  otRequestId: string
  status: 'APPROVED' | 'REJECTED'
  reason?: string
  comment?: string
}

interface NotificationSocketState {
  isConnected: boolean
  lastNotification: SocketNotificationNew | null
  lastLeaveUpdate: SocketLeaveStatusChanged | null
  lastOutsideWorkUpdate: SocketOutsideWorkStatusChanged | null
  lastOTUpdate: SocketOTStatusChanged | null
}

export function useNotificationSocket() {
  const user = useAuthStore((s) => s.user)
  const socketRef = useRef<Socket | null>(null)

  const [state, setState] = useState<NotificationSocketState>({
    isConnected: false,
    lastNotification: null,
    lastLeaveUpdate: null,
    lastOutsideWorkUpdate: null,
    lastOTUpdate: null,
  })

  useEffect(() => {
    // Only connect when user is logged in
    if (!user?.id) return

    const socket = io(`${WS_URL}/notifications`, {
      auth: { userId: user.id },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setState((prev) => ({ ...prev, isConnected: true }))
    })

    socket.on('disconnect', () => {
      setState((prev) => ({ ...prev, isConnected: false }))
    })

    socket.on('notification:new', (payload: SocketNotificationNew) => {
      setState((prev) => ({ ...prev, lastNotification: payload }))
    })

    socket.on('leave:status_changed', (payload: SocketLeaveStatusChanged) => {
      setState((prev) => ({ ...prev, lastLeaveUpdate: payload }))
    })

    socket.on('outside-work:status_changed', (payload: SocketOutsideWorkStatusChanged) => {
      setState((prev) => ({ ...prev, lastOutsideWorkUpdate: payload }))
    })

    socket.on('ot:status_changed', (payload: SocketOTStatusChanged) => {
      setState((prev) => ({ ...prev, lastOTUpdate: payload }))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setState({ isConnected: false, lastNotification: null, lastLeaveUpdate: null, lastOutsideWorkUpdate: null, lastOTUpdate: null })
    }
  }, [user?.id])

  return state
}
