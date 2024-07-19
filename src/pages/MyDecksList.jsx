import { useEffect, useState } from "react";
import "./MyDecksList.css";
import LoadingSpinner from "../components/Common/LoadingSpinner.jsx";
import ErrorView from "../components/Common/ErrorView.jsx";
import MagicHelper from "../Services/MagicHelper.js";
import DeckList from "../components/Magic/DeckOverview.jsx";
import DeckService from "../Services/DeckService.js";
import { defer, useLoaderData } from "react-router-dom";
import Dialog from "../components/Magic/Dialog.jsx";

const deckService = DeckService.shared;

export default function MyDecksList() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const data = useLoaderData();
  const [myDecks, setMyDecks] = useState(data);

  async function createDeck() {
    setIsUpdating(true);
    // setIsUpdating(true);
    // setIsCreatingDeck(false);
    const name = document.querySelector("input[name=name]").value;
    if (!name) {
      setError(new Error("Name is required"));
      setIsUpdating(false);
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
      let decks = await deckService.loadMyDecks();
      setMyDecks(decks);
      setIsCreatingDeck(false);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setIsUpdating(false);
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
      cardCount: deck.cardCount,
      colors: [],
    };
  });

  function closeDialog() {
    setIsCreatingDeck(false);
  }

  return (
    <>
      <div>
        <div className="headline">
          <h1>My Decks</h1>
          {isCreatingDeck && (
            <Dialog
              title="Create Deck"
              onClose={closeDialog}
              onSubmit={createDeck}
              error={error}
            >
              <label htmlFor="name">Name</label>
              <input type="text" name="name" />
            </Dialog>
          )}
          {isUpdating && <LoadingSpinner />}
          <button className="tb-button" onClick={showDeckForm}>Create</button>
        </div>
        {myDecks.length === 0 && <p>No decks found</p>}
        <DeckList decks={mappedDecks} />
      </div>
    </>
  );
}

export const loader = async () => {
  return await deckService.loadMyDecks();
};
