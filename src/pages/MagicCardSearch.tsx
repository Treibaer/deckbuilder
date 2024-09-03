import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import MagicCardList from "../components/MagicCardList";
import MagicFilterView from "../components/Search/MagicFilterView";
import SearchPagination from "../components/Search/Pagination";
import SearchBar from "../components/Search/SearchBar";
import CardService from "../Services/CardService";
import "./MagicCardSearch.css";

const cardService = CardService.shared;

const MagicCardSearch: React.FC = () => {
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

  return (
    <>
      <div className="searchHeader">
        <div className={"title " + (data.data.length === 0 ? "" : "hide")}>
          Search
        </div>
      </div>
      <SearchBar
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        handleChange={handleChange}
        setShowFilter={setShowFilter}
      />
      <MagicFilterView
        sets={data.sets}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
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
    </>
  );
};

export const loader = async ({ request }: any) => {
  const sets = await cardService.getSets();
  sets.sort((a, b) => (a.name > b.name ? 1 : -1));

  const queryParameters = new URL(request.url).searchParams;
  let q = queryParameters.get("q");

  if (!q) {
    return { data: [], sets: sets };
  }
  q += " game:paper";

  let url = `https://api.scryfall.com/cards/search?q=${q}`;
  if (queryParameters.has("page")) {
    url += `&page=${queryParameters.get("page")}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    return { data: [], sets: sets, amount: 0, hasMore: false };
  }

  const json = await response.json();
  json.data.map((card: any) => {
    card.scryfallId = card.id;
    return card;
  });
  return {
    data: json.data,
    hasMore: json.has_more,
    amount: json.total_cards,
    sets: sets,
  };
};

export default MagicCardSearch;
