import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import Client from "../Services/Client.js";
import MagicCardList from "../components/Magic/MagicCardList.jsx";
import "./MagicCardSearch.css";
import MagicFilterView from "./MagicFilterView.jsx";

export default function MagicCardSearch({}) {
  const navigate = useNavigate();
  const data = useLoaderData();
  const cards = data.data;
  const [searchParams, _] = useSearchParams();
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

  function loadCards2(term) {
    fetch("https://magic.treibaer.de/cards?term=" + term)
      .then((response) => response.json())
      .then((data) => {
        setCards(data.cards);

        // setIsLoading(false);
      });
  }
  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearch() {
    let url = `/search?q=${searchTerm}`;
    navigate(url);
  }

  return (
    <>
      <div className="searchHeader">
        <div className="title">Search</div>

        {data.amount > 0 && (
          <h2>
            {data.amount} card{data.amount === 1 ? "" : "s"} found
          </h2>
        )}
      </div>
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
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={() => {
            setShowFilter(true);
          }}
        >
          Advanced
        </button>
      </div>
      {
        <MagicFilterView
          sets={data.sets}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
      }
      <div className="searchResultsHeader">
        {pages > 1 && (
          <div>
            {Array.from({ length: pages }, (_, i) => (
              <button
                className={selectedPage === i ? "active" : ""}
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
      <div>
        {data.amount === 0 && <p>No cards found</p>}
        {cards.length > 0 && <MagicCardList cards={cards} />}
      </div>
    </>
  );
}

export const loader = async ({ request }) => {
  const sets = await Client.shared.loadSets();
  sets.sort((a, b) => (a.name > b.name ? 1 : -1));
  // filter logic
  let url = `https://api.scryfall.com/cards/search?q=c%3Ar,u,g,b,w`;
  // let url = `https://api.scryfall.com/cards/search?q=`;

  const queryParameters = new URL(request.url).searchParams;
  let q = queryParameters.get("q");

  if (!q) {
    return { data: [], sets: sets };
  }
  q += " game:paper";

  url = `https://api.scryfall.com/cards/search?q=ab+order:name+direction:ascending+c%3Dwu+prefer:usd-low+include:extras&page=1`;
  url = `https://api.scryfall.com/cards/search?q=${q}`;
  if (queryParameters.has("page")) {
    url += `&page=${queryParameters.get("page")}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    return { data: [], sets: sets, amount: 0, hasMore: false };
  }
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const json = await response.json();
  return {
    data: json.data,
    hasMore: json.has_more,
    amount: json.total_cards,
    sets: sets,
  };
};
