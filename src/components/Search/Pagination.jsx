import { useNavigate } from "react-router-dom";

export default function SearchPagination({ pages, selectedPage, searchTerm }) {
  const navigate = useNavigate();
  return (
    <div className="searchResultsHeader">
      {pages > 1 && (
        <div>
          {Array.from({ length: pages }, (_, i) => (
            <button
              className={selectedPage === i ? "active tb-button" : "tb-button"}
              key={i}
              onClick={() => {
                let url = `/search?q=${searchTerm}&page=${i + 1}`;
                navigate(url);
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
