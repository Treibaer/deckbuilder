const SearchBar: React.FC<{
  handleSearch: () => void;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ handleSearch, setShowFilter, searchTerm, handleChange }) => {
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
};

export default SearchBar;
