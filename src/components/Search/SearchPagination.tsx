import { useNavigate } from "react-router-dom";
import Button from "../Button";

const SearchPagination: React.FC<{
  pages: number;
  selectedPage: number;
  searchTerm: string;
}> = ({ pages, selectedPage, searchTerm }) => {
  const navigate = useNavigate();
  return (
    <>
      {pages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Array.from({ length: pages }, (_, i) => (
            <Button
              key={i}
              onClick={() => {
                let url = `/search?q=${searchTerm}&page=${i + 1}`;
                navigate(url);
              }}
              title={`${i + 1}`}
              active={selectedPage === i}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchPagination;
