import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import type { Feature } from 'geojson';
import Search from './Search';

interface MenuPanelProps {
  mapRef: React.RefObject<L.Map>;
  featuresData: Feature[];
  onMenuClose(): void;
}

function MenuPanel(props: MenuPanelProps) {
  const { mapRef, featuresData, onMenuClose } = props;
  const [isSearch, setIsSearch] = useState(false);

  const handleSearch = () => {
    if (isSearch) {
      setIsSearch(false);
    } else {
      setIsSearch(true);
    }
  };

  return (
    <div className="absolute top-0 right-0 z-1100 h-full max-h-full w-full max-w-sm overflow-y-scroll bg-white px-6">
      <button
        type="button"
        onClick={onMenuClose}
        className="absolute right-0 mt-2.5 mr-2.5 flex"
      >
        <span className="bg-[url('./images/close-line.svg')] bg-no-repeat bg-center h-7 w-7" />
        <span className="sr-only">Tutup menu</span>
      </button>
      {
        isSearch
          ? (
            <Search
              mapRef={mapRef}
              featuresData={featuresData}
              onSearchClose={handleSearch}
              onMenuClose={onMenuClose}
            />
          )
          : (
            <div className="mt-12">
              <button
                type="button"
                onClick={handleSearch}
              >
                Cari gua
              </button>
              <nav>
                <ul>
                  <li>
                    <Link to="./" onClick={onMenuClose}>Beranda</Link>
                  </li>
                </ul>
              </nav>
            </div>
          )
      }
    </div>
  );
}

export default MenuPanel;
