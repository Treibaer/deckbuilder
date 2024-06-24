import { useEffect, useState } from "react";
import MagicDeckView from "./MagicDeckView";
import Helper from "./Helper";
import Client from "../../Services/Client";
import "./MagicDeckOverview.css";

const client = Client.shared;

export default function MagicDeckOverview() {
  const [allDecks, setAllDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    client.getDecks().then((decks) => {
      setAllDecks(decks);
      // setSelectedDeck(decks[0]);
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
          <div id="deck-overview">
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
                      Helper.replaceColorSymbolsByImage(color)
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
