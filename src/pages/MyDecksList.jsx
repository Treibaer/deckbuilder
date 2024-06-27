import { useEffect, useState } from "react";
import "./MyDecksList.css";
import LoadingSpinner from "../components/Common/LoadingSpinner.jsx";
import ErrorView from "../components/Common/ErrorView.jsx";
import MagicHelper from "../Services/MagicHelper.js";
import DeckList from "../components/Magic/DeckOverview.jsx";
import DeckService from "../Services/DeckService.js";
import { useLoaderData } from "react-router-dom";

const deckService = DeckService.shared;

export default function MyDecksList() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  const myDecks = useLoaderData();

  async function createDeck() {
    // setIsUpdating(true);
    // setIsCreatingDeck(false);
    const name = document.querySelector("input[name=name]").value;
    if (!name) {
      setError(new Error("Name is required"));
      return;
    }
    try {
      await deckService.createDeck({
        id: 0,
        name: name ?? "Deck 1",
        description: "nice deck",
        mainboard: [],
        promoId: "",
      });
      await loadMyDecks();
      setIsCreatingDeck(false);
      setError(null);
    } catch (error) {
      setError(error);
    }
    // setIsUpdating(false);
  }

  function showDeckForm() {
    setIsCreatingDeck(true);
  }

  const mappedDecks = myDecks.map((deck) => {
    return {
      id: deck.id,
      img: deck.promoId ? MagicHelper.artCropUrl(deck.promoId) : undefined,
      link: `/decks/my/${deck.id}`,
      name: deck.name,
      format: deck.format,
      viewCount: deck.viewCount,
      cardCount: DeckService.shared.cardCount(deck),
      colors: [],
    };
  });

  return (
    <>
      <div>
        <h1>MyDeckView</h1>
        {isUpdating && (
          <div className="fullscreenBlurWithLoading">
            <LoadingSpinner />
          </div>
        )}
        {isCreatingDeck && (
          <div className="fullscreenBlurWithLoading">
            <div className="new-deck-form">
              {error && <ErrorView message={error.message} />}
              <h2>Create Deck</h2>
              <label htmlFor="name">Name</label>
              <input type="text" name="name" />
              <button onClick={createDeck}>Create</button>
            </div>
          </div>
        )}
        <button onClick={showDeckForm}> Create Deck</button>
        {myDecks.length === 0 && <p>No decks found</p>}
        <DeckList decks={mappedDecks} />
      </div>
    </>
  );
}

export const loader = async () => {
  return await deckService.loadMyDecks();
};
