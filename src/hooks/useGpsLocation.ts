import { useState } from 'react'

interface GpsLocation {
  lat: number | null
  lng: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  requestLocation: () => Promise<void>
}

const GPS_OPTIONS: PositionOptions = {
  timeout: 10_000,
  maximumAge: 0,
  enableHighAccuracy: true,
}

const getErrorMessage = (code: number): string => {
  if (code === GeolocationPositionError.PERMISSION_DENIED)
    return 'ກະລຸນາເປີດ Location ໃນ browser settings'
  if (code === GeolocationPositionError.POSITION_UNAVAILABLE)
    return 'ບໍ່ສາມາດຫາຕຳແໜ່ງໄດ້'
  return 'ໝົດເວລາພັກຫາຕຳແໜ່ງ'
}

export const useGpsLocation = (): GpsLocation => {
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const requestLocation = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude)
          setLng(pos.coords.longitude)
          setAccuracy(pos.coords.accuracy)
          setLoading(false)
          resolve()
        },
        (err) => {
          setError(getErrorMessage(err.code))
          setLoading(false)
          reject(new Error(getErrorMessage(err.code)))
        },
        GPS_OPTIONS,
      )
    })
  }

  return { lat, lng, accuracy, error, loading, requestLocation }
}
