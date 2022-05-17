import React from 'react';

interface SearchFormProps {
  query: string;
  onQueryChange(e: React.ChangeEvent): void;
  onQuerySearch(e: React.KeyboardEvent): void;
}

function SearchForm(props: SearchFormProps) {
  const { query, onQueryChange, onQuerySearch } = props;

  return (
    <div className="mt-12">
      <label htmlFor="searchInput" className="sr-only">cari gua</label>
      <input
        id="searchInput"
        type="text"
        value={query}
        placeholder="Cari gua..."
        onChange={onQueryChange}
        onKeyDown={onQuerySearch}
        className="border-2 w-full placeholder:text-sm"
      />
    </div>
  );
}

export default SearchForm;
