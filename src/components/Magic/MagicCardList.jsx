import { useEffect, useState } from "react";
import MagicCard from "./MagicCard";
import "./MagicCardList.css";
import LoadingCard from "../LoadingCard";

export default function MagicCardList({ cards, setCards }) {
  // create state for src
  // const [isLoading, setIsLoading] = useState(true);
  let [selectedCard, setSelectedCard] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  function showFullScreenCard(card) {
    setSelectedCard(card);
  }

  function loadCards(term) {
    fetch("https://magic.treibaer.de/cards?term=" + term)
      .then((response) => response.json())
      .then((data) => {
        setCards(data.cards);
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
    // console.log(event.target.value);
  }
  console.log("MagicCardList.jsx");

  return (
    <>
      <input type="text" value={searchTerm} onChange={handleChange} />
      {selectedCard && (
        <div className="fullscreenCard" onClick={() => setSelectedCard(null)}>
          <img src={selectedCard.image} />
        </div>
      )}

      <div className="card-container">
        {cards.length === 0 &&
          Array.from({ length: 5 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        {cards.map((card, index) => (
          <MagicCard
            key={index}
            card={card}
            onTap={() => showFullScreenCard(card)}
          />
        ))}
      </div>
    </>
  );
}
