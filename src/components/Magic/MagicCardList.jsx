import { useEffect, useState } from "react";
import MagicCard from "./MagicCardView";
import "./MagicCardList.css";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function MagicCardList({ cards, setCards }) {
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
    // setIsLoading(true);
    // setCards([]);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      loadCards(event.target.value);
    }, 300);
  }
  console.log("MagicCardList.jsx");

  return (
    <div id="magic-card-list">
      <input type="text" value={searchTerm} onChange={handleChange} />
      {selectedCard && (
        <div className="fullscreenCard" onClick={() => setSelectedCard(null)}>
          <img src={selectedCard.image} />
        </div>
      )}

      <div className="card-container">
        {cards.length === 0 && <LoadingSpinner />}
        {cards.map((card, index) => (
          <MagicCard
            key={index}
            card={card}
            onTap={() => showFullScreenCard(card)}
          />
        ))}
      </div>
    </div>
  );
}
