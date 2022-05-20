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
              className="absolute z-1100 right-0 border-2 border-solid border-black border-opacity-20 rounded bg-white mt-2.5 mr-2.5 flex bg-clip-padding"
            >
              <span className="bg-[url('./images/search-line.svg')] bg-no-repeat bg-center h-7 w-7" />
              <span className="sr-only">Buka panel pencarian</span>
            </button>
          )
      }
      <div id="map" className="h-full" />
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

    const streetTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );
    const satelliteTile = L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        id: 'mapbox/satellite-streets-v11',
        accessToken: 'pk.eyJ1Ijoia2NhNDg1IiwiYSI6ImNsM2RqaTQyNjAxbXEzZG1rbDk1dDhxd3EifQ.OgV0imkW3Wor1pnIPvJs_Q',
        tileSize: 512,
        zoomOffset: -1,
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank"><strong>Improve this map</strong></a>',
      },
    );
    const terrainTile = L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        id: 'kca485/cl3etab72000014o8agfwpj9h',
        accessToken: 'pk.eyJ1Ijoia2NhNDg1IiwiYSI6ImNsM2RqaTQyNjAxbXEzZG1rbDk1dDhxd3EifQ.OgV0imkW3Wor1pnIPvJs_Q',
        tileSize: 512,
        zoomOffset: -1,
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/" target="_blank"><strong>Improve this map</strong></a>',
      },
    );
    streetTile.addTo(mapRef.current);

    const tiles = {
      'Peta jalan': streetTile,
      'Peta satelit': satelliteTile,
      'Peta kontur': terrainTile,
    };
    L.control.layers(tiles, undefined, { position: 'bottomleft' }).addTo(mapRef.current);

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
        const location = JSON.stringify(geometry.coordinates);
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
          <a href="https://www.google.com/maps/search/?api=1&query=${location}" target="_blank" rel="noopener noreferrer" class="block mt-2">Cari di Google Maps</a>`;
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
