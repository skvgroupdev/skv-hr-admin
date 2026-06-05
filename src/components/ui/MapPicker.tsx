import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon broken by webpack/vite asset handling
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

export interface LatLng {
  lat: number
  lng: number
}

interface MapPickerProps {
  value: LatLng | null
  onChange: (coords: LatLng) => void
}

const LAO_CENTER: LatLng = { lat: 17.9757, lng: 102.6331 }

function ClickHandler({ onChange }: { onChange: (coords: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function RecenterMap({ center }: { center: LatLng }) {
  // Only recenter on initial mount, not on every value change
  const initialized = useRef(false)
  const map = useMapEvents({})

  useEffect(() => {
    if (!initialized.current) {
      map.setView([center.lat, center.lng], map.getZoom())
      initialized.current = true
    }
  }, [center, map])

  return null
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const center = value ?? LAO_CENTER

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">ຄລິກໃສ່ແຜນທີ່ເພື່ອປັກໝຸດຕຳແໜ່ງ</p>
      <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height: 300 }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {value && <RecenterMap center={value} />}
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      {value ? (
        <p className="text-xs text-gray-600 font-mono bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
          Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}
        </p>
      ) : (
        <p className="text-xs text-amber-600">ຍັງບໍ່ໄດ້ເລືອກຕຳແໜ່ງ</p>
      )}
    </div>
  )
}
