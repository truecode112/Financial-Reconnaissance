import { MapContainer, WMSTileLayer } from 'react-leaflet'
import { useStore } from "../../contexts/Store.context"
import "leaflet/dist/leaflet.css"

export default function LocationAnalysis() {
    const { sidebarIsOpen } = useStore()
    return (
        <MapContainer
            key={sidebarIsOpen}
            style={{ height: "100%", width: "100%" }}
            center={[9.8877846, 7.7763959]}
            zoom={7}
        >
            <WMSTileLayer
                url={`http://172.16.27.217:18080/geoserver/NG/wms`}
                params={{
                    layers: 'NG:ng_test',
                    format: 'image/png',
                    transparent: true,
                }}
            />
        </MapContainer>
    )
}