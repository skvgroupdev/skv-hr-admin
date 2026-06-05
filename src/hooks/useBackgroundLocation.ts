import { useEffect } from 'react'
import { useLocationStore } from '../stores/useLocationStore'

const INTERVAL_MS = 30_000

const GPS_OPTIONS: PositionOptions = {
  timeout: 10_000,
  maximumAge: 15_000, // allow slightly cached position for background polling
  enableHighAccuracy: true,
}

const getErrorMessage = (code: number): string => {
  if (code === GeolocationPositionError.PERMISSION_DENIED)
    return 'ກະລຸນາເປີດ Location ໃນ browser settings'
  if (code === GeolocationPositionError.POSITION_UNAVAILABLE)
    return 'ບໍ່ສາມາດຫາຕຳແໜ່ງໄດ້'
  return 'ໝົດເວລາພັກຫາຕຳແໜ່ງ'
}

export const useBackgroundLocation = (): void => {
  const setLocation = useLocationStore((s) => s.setLocation)
  const setError = useLocationStore((s) => s.setError)
  const setTracking = useLocationStore((s) => s.setTracking)
  const hydrated = useLocationStore((s) => s._hydrated)
  const isFresh = useLocationStore((s) => s.isFresh)

  useEffect(() => {
    // รอ store hydrate จาก sessionStorage ก่อน
    if (!hydrated) return

    if (!navigator.geolocation) {
      setError('Browser ບໍ່ຮອງຮັບ GPS')
      return
    }

    // ถ้ามี location สดจาก sessionStorage ใช้ได้เลย ไม่ต้องรอ GPS fix
    if (isFresh()) {
      setTracking(true)
    }

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy)
          setTracking(true)
        },
        (err) => {
          setError(getErrorMessage(err.code))
        },
        GPS_OPTIONS,
      )
    }

    // ถ้า location ยังสดอยู่ ไม่ต้อง fetch ทันที รอ interval รอบถัดไป
    if (!isFresh()) {
      fetchLocation()
    }

    const intervalId = setInterval(fetchLocation, INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
      setTracking(false)
    }
  }, [hydrated, setLocation, setError, setTracking, isFresh])
}
