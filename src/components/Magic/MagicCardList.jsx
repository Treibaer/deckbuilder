import { useEffect, useState } from "react";
import MagicCard from "./MagicCard";
import "./MagicCardList.css";
import LoadingCard from "../LoadingCard";

export default function MagicCardList({cards, setCards}) {
  // create state for src
  const [isLoading, setIsLoading] = useState(true);
  let [selectedCard, setSelectedCard] = useState(null);

  function showFullScreenCard(card) {
    console.log(card);
    setSelectedCard(card);
  }

  useEffect(() => {
    console.log(cards);
    setTimeout(() => {
      fetch("https://magic.treibaer.de/cards")
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          setCards(data.cards);
          console.log(data.cards);
        });
    }, 1000);
  }, []);
  return (
    <>
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
