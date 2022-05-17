import React from 'react';

interface SearchFormProps {
  query: string;
  onQueryChange(e: React.ChangeEvent): void;
  onQuerySearch(e: React.KeyboardEvent): void;
}

function SearchForm(props: SearchFormProps) {
  const { query, onQueryChange, onQuerySearch } = props;

  return (
    <div>
      <label htmlFor="searchInput" className="sr-only">cari gua</label>
      <input id="searchInput" type="text" value={query} onChange={onQueryChange} onKeyDown={onQuerySearch} />
    </div>
  );
}

export default SearchForm;
