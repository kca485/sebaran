import React from 'react';
import Fuse from 'fuse.js';

interface SearchResultsProps {
  results: Fuse.FuseResult<string>[];
  onPickResult(e: React.MouseEvent | React.KeyboardEvent): void;
}

function SearchResults(props: SearchResultsProps) {
  const { results, onPickResult } = props;

  const resultsList = results.map((result) => (
    <li key={result.refIndex}>
      <button id={result.refIndex.toString()} type="button" onClick={onPickResult} className="w-full text-left">
        {result.item}
      </button>
    </li>
  ));

  return (
    <div>
      <ul>
        {resultsList}
      </ul>
    </div>
  );
}

export default SearchResults;
