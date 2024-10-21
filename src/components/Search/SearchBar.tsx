import { useEffect, useRef } from "react";
import Button from "../Button";
import useIsMobile from "../../hooks/useIsMobile";

const SearchBar: React.FC<{
  handleSearch: () => void;
  setShowFilter?: (value: boolean) => void;
  searchTerm: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ handleSearch, setShowFilter, searchTerm, handleChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isMobile]);
  
  return (
    <div className="flex gap-2 mt-2 justify-center items-center">
      <input
        type="text"
        ref={inputRef}
        className="tb-input max-w-[500px]"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button title="Search" onClick={handleSearch} />
      {setShowFilter && (
        <Button title="Advanced" onClick={() => setShowFilter(true)} />
      )}
    </div>
  );
};

export default SearchBar;
