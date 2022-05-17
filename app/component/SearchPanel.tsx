import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import L from 'leaflet';
import type { Feature } from 'geojson';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

interface SearchProps {
  mapRef: React.RefObject<L.Map>;
  featuresData: Feature[];
  onSearchClose(): void;
}

function Search(props: SearchProps) {
  const { mapRef, featuresData, onSearchClose } = props;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as Fuse.FuseResult<string>[]);
  const fuseRef = useRef({} as Fuse<string>);

  useEffect(() => {
    const index = featuresData.reduce((arr: string[], feature) => {
      if (feature.properties) arr.push(feature.properties.NAMA);
      return arr;
    }, []);
    fuseRef.current = new Fuse(index);
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

  const handlePickResult = (e: React.MouseEvent) => {
    const { id } = e.target as HTMLElement;
    const { geometry } = featuresData[parseInt(id, 10)];
    if (geometry.type === 'Point') {
      if (mapRef && mapRef.current) {
        mapRef.current.flyTo(geometry.coordinates as L.LatLngExpression, 16);
      }
    }
  };

  return (
    <div className="absolute top-0 right-0 z-1000">
      <button type="button" onClick={onSearchClose}>Tutup</button>
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
