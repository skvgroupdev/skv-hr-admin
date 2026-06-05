import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by webpack/vite asset bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER: [number, number] = [17.9757, 102.6331]
const DEFAULT_ZOOM = 13

export interface MapPickerProps {
  value?: [number, number] // [lat, lng]
  onChange: (coords: [number, number]) => void
}

function ClickHandler({ onChange }: { onChange: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        ຕຳແໜ່ງສາຂາ * <span className="font-normal text-gray-500">(ຄລິກແຜນທີ່ເພື່ອປັກໝຸດ)</span>
      </label>
      <div className="overflow-hidden rounded-md border border-gray-300" style={{ height: 300 }}>
        <MapContainer
          center={value ?? DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {value && <Marker position={value} />}
        </MapContainer>
      </div>
      {value ? (
        <p className="text-xs text-gray-500">
          Lat: {value[0].toFixed(6)}, Lng: {value[1].toFixed(6)}
        </p>
      ) : (
        <p className="text-xs text-gray-400">ຍັງບໍ່ໄດ້ເລືອກຕຳແໜ່ງ</p>
      )}
    </div>
  )
}
