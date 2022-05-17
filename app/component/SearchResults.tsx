import React from 'react';
import Fuse from 'fuse.js';
import type { Feature } from 'geojson';

interface SearchResultsProps {
  results: Fuse.FuseResult<Feature>[];
  onPickResult(e: React.MouseEvent | React.KeyboardEvent): void;
}

function SearchResults(props: SearchResultsProps) {
  const { results, onPickResult } = props;

  const resultsList = results.map((result) => {
    const { properties } = result.item;
    return properties
      && (
        <li key={result.refIndex} className="my-4">
          <button
            id={result.refIndex.toString()}
            type="button"
            onClick={onPickResult}
            className="w-full text-left outline-1 hover:outline"
          >
            <p className="font-semibold">{properties.NAMA}</p>
            <p className="text-sm">{properties.DESA && [properties.DESA, properties.KECAMATAN].join(', ')}</p>
          </button>
        </li>
      );
  });

  return (
    <div>
      <ul>
        {resultsList}
      </ul>
    </div>
  );
}

export default SearchResults;
