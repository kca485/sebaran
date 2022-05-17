import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import distributionData from '../data/distributionData';
import SearchPanel from './SearchPanel';

function App() {
  const [isSearch, setIsSearch] = useState(false);
  const mapRef = initMap();

  const handleSearchPanel = () => {
    if (isSearch) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
  };

  return (
    <>
      {
        isSearch
          ? (
            <SearchPanel
              mapRef={mapRef}
              featuresData={distributionData.features}
              onSearchClose={handleSearchPanel}
            />
          )
          : (
            <button
              type="button"
              onClick={handleSearchPanel}
              className="absolute z-1100 right-0"
            >
              Cari
            </button>
          )
      }
      <div id="map" className="h-screen" />
    </>
  );
}

function initMap() {
  const mapRef = useRef({} as L.Map);
  useEffect(() => {
    mapRef.current = L.map('map');
    mapRef.current.fitBounds([
      [-8.2, 110.3],
      [-7.9, 110.8],
    ]);
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(mapRef.current);

    L.control.locate({ setView: 'once' }).addTo(mapRef.current);

    distributionData.features.forEach((feature) => {
      const { geometry, properties } = feature;
      if (geometry.type === 'Point') {
        const marker = L.circleMarker(
          geometry.coordinates as L.LatLngExpression,
          {
            color: '#222222',
            weight: 1,
            fillColor: '#ff9911',
            fillOpacity: 1,
            radius: 6,
          },
        ).addTo(mapRef.current);
        const location = `${geometry.coordinates[1]},${geometry.coordinates[0]}`;
        const popupContent = `<table>
            <tr>
              <th scope="row">NAMA</th>
              <td>${properties && properties.NAMA ? properties.NAMA : ''}</td>
            </tr>
            <tr>
              <th scope="row">JENIS</th>
              <td>${properties && properties.JENIS ? properties.JENIS : ''}</td>
            </tr>
            <tr>
              <th scope="row">STATUS</th>
              <td>${properties && properties.STATUS ? properties.STATUS : ''}</td>
            </tr>
            <tr>
              <th scope="row">POTENSI</th>
              <td>${properties && properties.POTENSI ? properties.POTENSI : ''}</td>
            </tr>
            <tr>
              <th scope="row">SURVEYOR</th>
              <td>${properties && properties.SURVEYOR ? properties.SURVEYOR : ''}</td>
            </tr>
            <tr>
              <th scope="row">REFERENSI</th>
              <td>${properties && properties.REFERENSI ? properties.REFERENSI : ''}</td>
            </tr>
          </table>
          <a href="https://www.google.com/maps/search/?api=1&query=${location}" target="_blank" rel="noopener noreferrer">Cari di Google Maps</a>`;
        marker.bindPopup(popupContent);
      }
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return mapRef;
}

export default App;
