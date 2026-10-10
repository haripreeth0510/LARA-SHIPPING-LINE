import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = () => {
  const offices = [
    {
      name: "Head Office - Coimbatore",
      position: [11.0168, 76.9558], // Coimbatore coordinates
    },
    {
      name: "Mumbai Branch Office",
      position: [19.0760, 72.8777], // Mumbai coordinates
    },
    {
      name: "Dubai Branch Office",
      position: [25.2048, 55.2708], // Dubai coordinates
    }
  ];

  return (
    <div style={{ height: '400px', width: '100%', marginBottom: '40px' }}>
      <MapContainer 
        center={[20.0, 65.0]} 
        zoom={4} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {offices.map((office, idx) => (
          <Marker key={idx} position={office.position as [number, number]}>
            <Popup>
              <strong>{office.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
