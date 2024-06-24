import { useEffect, useState } from "react";

import "./MagicDeckOverview.css";
import U from "../../assets/card-symbols/U.svg";
import B from "../../assets/card-symbols/B.svg";
import G from "../../assets/card-symbols/G.svg";
import R from "../../assets/card-symbols/R.svg";
import W from "../../assets/card-symbols/W.svg";
import MagicDeckView from "./MagicDeckView";

function replaceColorSymbolsByImage(symbol) {
  let image;
  switch (symbol) {
    case "U":
      image = U;
      break;
    case "B":
      image = B;
      break;
    case "G":
      image = G;
      break;
    case "R":
      image = R;
      break;
    case "W":
      image = W;
      break;
    default:
      image = "";
  }
  return <img key={symbol} className="manaSymbol" src={image} />;
}

export default function MagicDeckOverview() {
  const [allDecks, setAllDecks] = useState([]);

  const [selectedDeck, setSelectedDeck] = useState(null);

  // load decks from url
  useEffect(() => {
    fetch("https://magic.treibaer.de/decks")
      .then((response) => response.json())
      .then((data) => {
        let decks = data.data.map((deck) => {
          return {
            id: deck.id,
            publicId: deck.publicId,
            name: deck.name,
            format: deck.format,
            viewCount: deck.viewCount,
            cards: deck.cards,
            mainboardCount: deck.mainboardCount,
            colors: deck.colors,
          };
        });
        // filter unfinished decks by mainboardCount
        decks = decks.filter((deck) => {
          if (deck.format === "commander") {
            return deck.mainboardCount <= 110 && deck.mainboardCount >= 99;
          }
          return deck.mainboardCount <= 60 && deck.mainboardCount >= 59;
        });
        setAllDecks(decks);
        setSelectedDeck(decks[0]);

        // setAllDecks(data.decks);
        // console.log(data.data);
      });
  }, []);

  return (
    <>
      {selectedDeck !== null && (
        <div>
          <MagicDeckView deck={selectedDeck}>
            <button
              onClick={() => {
                setSelectedDeck(null);
              }}
            >
              Back
            </button>
          </MagicDeckView>
        </div>
      )}
      {selectedDeck === null && (
        <div>
          <h1>Magic Deck Overview</h1>
          <div className="deck-overview">
            {selectedDeck === null &&
              allDecks.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeck(deck);
                  }}
                >
                  <p>
                    {deck.colors.map((color) =>
                      replaceColorSymbolsByImage(color)
                    )}
                  </p>
                  <h2>{deck.name}</h2>
                  <p>Format: {deck.format}</p>
                  <p>View Count: {deck.viewCount}</p>
                  <p>Cards: {deck.mainboardCount}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
