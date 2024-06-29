import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import MagicCardList from "../components/Magic/MagicCardList.jsx";
import MagicFilterView from "./MagicFilterView.jsx";
import "./MagicCardSearch.css";

export default function MagicCardSearch({}) {
  const navigate = useNavigate();
  const data = useLoaderData();
  const cards = data.data;
  const queryParameters = new URLSearchParams(window.location.search);
  const q = queryParameters.get("q");

  const [showFilter, setShowFilter] = useState(false);

  console.log("search term: " + q);
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
    let url = `/magicCardSearch?q=${searchTerm}`;
    navigate(url);
  }

  return (
    <>
      <h1>Magic Card Search</h1>
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
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          setSearchTerm={setSearchTerm}
        />
      }
      {cards.length > 0 && <MagicCardList cards={cards} />}
    </>
  );
}

export const loader = async ({ request }) => {
  // filter logic
  let url = `https://api.scryfall.com/cards/search?q=c%3Ar,u,g,b,w`;
  // let url = `https://api.scryfall.com/cards/search?q=`;

  const queryParameters = new URL(request.url).searchParams;
  let q = queryParameters.get("q");

  if (!q) {
    return { data: [] };
  }
  q += " game:paper";

  // log(url);
  url = `https://api.scryfall.com/cards/search?q=ab+order:name+direction:ascending+c%3Dwu+prefer:usd-low+include:extras&page=1`;
  url = `https://api.scryfall.com/cards/search?q=${q}`;
  // if (queryParameters.size > 0) {
  //   url = `https://api.scryfall.com/cards/search?q=${filter.join("+")}`;
  // } else {
  //   return {data: []};
  // }
  const response = await fetch(url);
  if (!response.ok) {
    return { data: [] };
  }
  // wait 2 seconds
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return response;
};
