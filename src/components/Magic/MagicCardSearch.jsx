import { useEffect, useState } from "react";
import MagicCardList from "./MagicCardList";

export default function MagicCardSearch({ cards, setCards }) {
  const [searchTerm, setSearchTerm] = useState("");

  function loadCards2(term) {
    fetch("https://magic.treibaer.de/cards?term=" + term)
      .then((response) => response.json())
      .then((data) => {
        setCards(data.cards);
        // setIsLoading(false);
      });
  }

  function loadCards(term) {
    let setCode = "mh3";
    let url = `https://api.scryfall.com/cards/search?q=c%3Ar,u,g,b,w`;
    url = `https://api.scryfall.com/cards/search?q=c%3Ac`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setCards(data.data);
        // setIsLoading(false);
      });
  }

  useEffect(() => {
    setTimeout(() => {
      loadCards(searchTerm);
    }, 0);
  }, []);

  let searchTimer = 0;

  function handleChange(event) {
    setSearchTerm(event.target.value);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      loadCards(event.target.value);
    }, 300);
  }
  console.log("MagicCardList.jsx");

  return (
    <>
      <h1>Magic Card Search</h1>
      <div>
        {/* <input type="text" value={searchTerm} onChange={handleChange} /> */}
      </div>
      <MagicCardList cards={cards} />
    </>
  );
}