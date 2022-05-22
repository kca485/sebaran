import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import L from 'leaflet';
import type { Feature } from 'geojson';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

interface SearchProps {
  mapRef: React.RefObject<L.Map>;
  featuresData: Feature[];
  onSearchClose(): void;
  onMenuClose(): void;
}

function Search(props: SearchProps) {
  const {
    mapRef,
    featuresData,
    onSearchClose,
    onMenuClose,
  } = props;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as Fuse.FuseResult<Feature>[]);
  const fuseRef = useRef({} as Fuse<Feature>);
  const navigate = useNavigate();

  useEffect(() => {
    const index = featuresData.reduce((arr: Feature[], feature) => {
      if (feature.properties) arr.push(feature);
      return arr;
    }, []);
    fuseRef.current = new Fuse(index, { keys: ['properties.NAMA'] });
  }, []);

  const handleQueryChange = (e: React.ChangeEvent) => {
    setQuery((e.target as HTMLInputElement).value);
  };

  const handleQuerySearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newResults = fuseRef.current.search(
        (e.target as HTMLInputElement).value,
      );
      setResults(newResults);
    }
  };

  const handlePickResult = async (e: React.MouseEvent) => {
    const { id } = e.currentTarget;
    const { geometry } = featuresData[parseInt(id, 10)];
    if (geometry.type === 'Point') {
      await navigate('/');
      if (mapRef && mapRef.current) {
        mapRef.current.flyTo(geometry.coordinates as L.LatLngExpression, 16);
      }
    }
    onMenuClose();
  };

  return (
    <div>
      <button
        type="button"
        onClick={onSearchClose}
        className="absolute top-0 left-0 mt-2.5 ml-2.5 flex"
      >
        <span className="bg-[url('./images/arrow-left-s-line.svg')] bg-no-repeat bg-center h-7 w-7" />
        menu
      </button>
      <SearchForm
        query={query}
        onQueryChange={handleQueryChange}
        onQuerySearch={handleQuerySearch}
      />
      <SearchResults
        results={results}
        onPickResult={handlePickResult}
      />
    </div>
  );
}

export default Search;
