import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import MagicCardList from "../components/MagicCardList";
import MagicFilterView from "../components/Search/MagicFilterView";
import SearchBar from "../components/Search/SearchBar";
import SearchPagination from "../components/Search/SearchPagination";
import CardService from "../Services/CardService";

const SearchView: React.FC = () => {
  /*
    useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, []);
  */
  const navigate = useNavigate();
  const data = useLoaderData() as {
    data: any[];
    amount: number;
    hasMore: boolean;
    sets: any[];
  };
  const cards = data.data;
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const page = searchParams.get("page");
  const selectedPage = page ? parseInt(page) - 1 : 0;

  const [showFilter, setShowFilter] = useState(false);

  let pages = Math.ceil(data.amount / cards.length);

  if (!data.hasMore) {
    pages = selectedPage + 1;
  }

  const [searchTerm, setSearchTerm] = useState(q ?? "");

  useEffect(() => {
    setSearchTerm(q ?? "");
  }, [q]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleSearch() {
    navigate(`/search?q=${searchTerm}`);
  }

  function submitFilter(query: string) {
    navigate(`/search?q=${query}`);
    setShowFilter(false);
  }

  return (
    <div className="w-full">
      {data.data.length === 0 && (
        <div className="cursor-default text-3xl font-semibold m-2 text-center">
          Search
        </div>
      )}
      <SearchBar
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        handleChange={handleChange}
        setShowFilter={setShowFilter}
      />
      <MagicFilterView
        query={searchTerm}
        sets={data.sets}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        onSubmit={submitFilter}
      />
      <SearchPagination
        pages={pages}
        selectedPage={selectedPage}
        searchTerm={searchTerm}
      />
      <div>
        {data.amount === 0 && <p>No cards found</p>}
        {cards.length > 0 && <MagicCardList cards={cards} />}
      </div>
    </div>
  );
};

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  let q = queryParameters.get("q");

  return await CardService.shared.searchCards(
    q ?? "",
    queryParameters.get("page")
  );
};

export default SearchView;
