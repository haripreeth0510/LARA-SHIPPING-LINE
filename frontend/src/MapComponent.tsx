import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom SVG icon generator for Lara Shipping Line markers
const createCustomIcon = (isHeadOffice: boolean) => {
  const pinColor = isHeadOffice ? '#0284c7' : '#0369a1';
  const badgeColor = isHeadOffice ? '#22c55e' : '#38bdf8';
  return L.divIcon({
    className: 'lara-map-marker-icon',
    html: `
      <div style="position: relative; width: 34px; height: 44px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); cursor: pointer;">
        <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 28.5 17 44 17 44C17 44 34 28.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${pinColor}"/>
          <circle cx="17" cy="16" r="8" fill="#ffffff"/>
          <circle cx="17" cy="16" r="4.5" fill="${badgeColor}"/>
        </svg>
      </div>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -44],
  });
};

interface Office {
  id: string;
  name: string;
  badge: string;
  isHeadOffice: boolean;
  position: [number, number];
  address: string;
  phone: string[];
  email?: string;
}

const offices: Office[] = [
  {
    id: 'coimbatore',
    name: 'Head Office - Coimbatore',
    badge: 'Head Office',
    isHeadOffice: true,
    position: [11.0168, 76.9558],
    address: '114/115, Vivaan Arcade, Ramlakshman Nagar, East Zone, Sowripalayam Post, Coimbatore - 641028, India',
    phone: ['+91 81481 14238', '+91 81481 14279'],
    email: 'sales@larashippingline.com'
  },
  {
    id: 'mumbai',
    name: 'Mumbai Branch Office',
    badge: 'Branch Office',
    isHeadOffice: false,
    position: [19.0760, 72.8777],
    address: 'G-34, Haware Fantasia Business Park, Plot No. 47, Sector -30A, Vashi, Navi Mumbai - 400703, India',
    phone: ['+91 22 45773828']
  },
  {
    id: 'dubai',
    name: 'Dubai Branch Office',
    badge: 'LARA SHIPPING LINE LLC',
    isHeadOffice: false,
    position: [25.2048, 55.2708],
    address: 'M-Floor Office – 208, Hamsa A Wing, Al Karama, Dubai, United Arab Emirates',
    phone: ['+971 56 542 0228']
  }
];

const DEFAULT_CENTER: [number, number] = [19.5, 66.5];
const DEFAULT_ZOOM = 4;

function MapViewController({ targetCoords, zoom }: { targetCoords: [number, number] | null; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, zoom, { duration: 1.2 });
    }
  }, [targetCoords, zoom, map]);
  return null;
}

const MapComponent: React.FC = () => {
  const [activeView, setActiveView] = useState<{ coords: [number, number]; zoom: number }>({
    coords: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });
  const [selectedId, setSelectedId] = useState<string>('all');

  const handleSelectOffice = (office: Office) => {
    setSelectedId(office.id);
    setActiveView({
      coords: office.position,
      zoom: 11,
    });
  };

  const handleReset = () => {
    setSelectedId('all');
    setActiveView({
      coords: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });
  };

  return (
    <section className="lara-map-section" aria-label="Our Office Locations">
      <div className="lara-map-bar">
        <div className="lara-map-info">
          <span className="lara-map-tag">Global Presence</span>
          <h2 className="lara-map-title">Office Locations</h2>
        </div>
        <div className="lara-map-nav" role="tablist" aria-label="Office locations switcher">
          <button
            type="button"
            className={`lara-map-btn ${selectedId === 'all' ? 'active' : ''}`}
            onClick={handleReset}
          >
            Show All Offices
          </button>
          {offices.map((office) => (
            <button
              key={office.id}
              type="button"
              className={`lara-map-btn ${selectedId === office.id ? 'active' : ''}`}
              onClick={() => handleSelectOffice(office)}
            >
              {office.name.replace(' - ', ' • ')}
            </button>
          ))}
        </div>
      </div>

      <div className="lara-map-wrapper">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          scrollWheelZoom={false}
        >
          {/* Google Maps Roadmap Tile Layer in English (hl=en) */}
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
            attribution='&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a>'
          />

          <MapViewController targetCoords={activeView.coords} zoom={activeView.zoom} />

          {offices.map((office) => (
            <Marker
              key={office.id}
              position={office.position}
              icon={createCustomIcon(office.isHeadOffice)}
            >
              <Tooltip
                direction="top"
                offset={[0, -42]}
                permanent
                className="lara-map-tooltip"
              >
                {office.name}
              </Tooltip>

              <Popup className="lara-map-popup-window" maxWidth={320}>
                <div className="lara-map-popup-card">
                  <div className="lara-popup-header">
                    <span className={`lara-popup-badge ${office.isHeadOffice ? 'hq' : ''}`}>
                      {office.badge}
                    </span>
                    <h3 className="lara-popup-title">{office.name}</h3>
                  </div>
                  <div className="lara-popup-body">
                    <p className="lara-popup-item">
                      <span className="lara-popup-icon">📍</span>
                      <span>{office.address}</span>
                    </p>
                    <div className="lara-popup-item">
                      <span className="lara-popup-icon">📞</span>
                      <div>
                        {office.phone.map((ph, idx) => (
                          <a key={idx} href={`tel:${ph.replace(/\s+/g, '')}`} className="lara-popup-link">
                            {ph}
                          </a>
                        ))}
                      </div>
                    </div>
                    {office.email && (
                      <p className="lara-popup-item">
                        <span className="lara-popup-icon">✉️</span>
                        <a href={`mailto:${office.email}`} className="lara-popup-link">
                          {office.email}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="lara-popup-footer">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${office.position[0]},${office.position[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lara-popup-directions-btn"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default MapComponent;
