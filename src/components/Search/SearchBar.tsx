import Button from "../Decks/Button";

const SearchBar: React.FC<{
  handleSearch: () => void;
  setShowFilter: (value: boolean) => void;
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
      <Button title="Search" onClick={handleSearch} />
      <Button title="Advanced" onClick={() => setShowFilter(true)} />
    </div>
  );
};

export default SearchBar;
