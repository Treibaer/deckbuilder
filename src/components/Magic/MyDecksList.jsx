import { useEffect, useState } from "react";
import DeckService from "../../Services/DeckService.js";
import "./MyDecksList.css";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import ErrorView from "../Common/ErrorView.jsx";
import MagicDeckView from "./MagicDeckView.jsx";
import MyDeckView from "./MyDeckView.jsx";

const deckService = DeckService.shared;

export default function MyDecksList() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [myDecks, setMyDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  async function loadMyDecks() {
    const decks = await deckService.loadMyDecks();
    setMyDecks(decks);
  }

  useEffect(() => {
    loadMyDecks();
  }, []);

  async function createDeck() {
    setIsUpdating(true);
    try {
      await deckService.createDeck({
        id: 0,
        name: "Deck 1",
        description: "nice deck",
        mainboard: [],
      });
    } catch (error) {
      setError(error);
    }
    await loadMyDecks();
    setIsUpdating(false);
  }

  return (
    <>
      {selectedDeck !== null && (
        <div>
          <MyDeckView deckId={selectedDeck.id}>
            <button
              onClick={() => {
                setSelectedDeck(null);
                loadMyDecks();
              }}
            >
              Back
            </button>
          </MyDeckView>
        </div>
      )}
      {!selectedDeck && (
        <div>
          <h1>MyDeckView</h1>
          {isUpdating && (
            <div className="fullscreenBlurWithLoading">
              <LoadingSpinner />
            </div>
          )}
          {error && <ErrorView message={error.message} />}
          <button onClick={() => createDeck()}> Create Deck</button>
          {myDecks.length === 0 && <p>No decks found</p>}
          <div className="deckList">
            {myDecks.map((deck) => (
              <div key={deck.id} onClick={() => setSelectedDeck(deck)}>
                <div style={{ width: "150px", height: "110px" }}>
                  {deck.mainboard[0]?.card.image_uris.art_crop && (
                    <img
                      style={{ width: "150px", height: "110px" }}
                      src={deck.mainboard[0]?.card.image_uris.art_crop}
                      alt="deck"
                    />
                  )}
                </div>
                <h2>{deck.name}</h2>
                <p>{deck.description}</p>
                <p>Format:</p>
                <p>Cards: {DeckService.shared.cardCount(deck)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
