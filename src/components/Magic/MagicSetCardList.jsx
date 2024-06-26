import { useEffect, useState } from "react";
import Cards from "./MagicCardList.jsx";
import "./MagicSetCardList.css";

export default function MagicSetCardList({ setCode }) {
  let [cards, setCards] = useState([]);

  // let setCode = "mh3";
  // setCode = "mrd";
  let url = `https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${setCode}&unique=prints`;
  //   url = `https://api.scryfall.com/cards/search?q=s%3A${setCode}+color%3D%28B+OR+U%29`
    // url = "https://api.scryfall.com/cards/search?order=cmc&q=c%3Arg+pow%3D3&page=1"

  async function loadCards(term) {
    // setCards([]);
    const data = await fetch(url);
    const resData = await data.json();
    let cards = resData.data;

    setCards(cards);
  }

  useEffect(() => {
    loadCards("");
  }, []);

  return (
    <>
      <h1>Magic Set Card List</h1>
      {<Cards cards={cards} />}
    </>
  );
}
