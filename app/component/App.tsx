import React, { useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import distributionData from '../data/distributionData';
import Map from './Map';
import DataTable from './DataTable';
import MenuPanel from './MenuPanel';

function App() {
  const [isMenu, setIsMenu] = useState(false);
  const mapRef = useRef({} as L.Map);

  const handleMenuPanel = () => {
    if (isMenu) {
      setIsMenu(false);
    } else {
      setIsMenu(true);
    }
  };

  return (
    <>
      {
        isMenu
          ? (
            <MenuPanel
              mapRef={mapRef}
              featuresData={distributionData.features}
              onMenuClose={handleMenuPanel}
            />
          )
          : (
            <button
              type="button"
              onClick={handleMenuPanel}
              className="absolute z-1100 right-0 border-2 border-solid border-black border-opacity-20 rounded bg-white mt-2.5 mr-2.5 flex bg-clip-padding"
            >
              <span className="bg-[url('./images/menu-line.svg')] bg-no-repeat bg-center h-7 w-7" />
              <span className="sr-only">Menu</span>
            </button>
          )
      }
      <Routes>
        <Route path="/" element={<Map ref={mapRef} />} />
        <Route path="/basis-data" element={<DataTable />} />
      </Routes>
    </>
  );
}

export default App;
