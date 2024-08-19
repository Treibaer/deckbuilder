export default function SearchBar({
  handleSearch,
  setShowFilter,
  searchTerm,
  handleChange,
}) {
  return (
    <div className="searchBar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button className="tb-button" onClick={handleSearch}>
        Search
      </button>
      <button
        className="tb-button"
        onClick={() => {
          setShowFilter(true);
        }}
      >
        Advanced
      </button>
    </div>
  );
}
