import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Dialog from "../components/Common/Dialog";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import DeckList from "../components/Decks/DecksList";
import DeckService from "../Services/DeckService";
import MagicHelper from "../Services/MagicHelper";
import { Deck } from "./deck";
import "./MyDecksList.css";

const deckService = DeckService.shared;

const MyDecksList = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<{ message: string } | undefined>(
    undefined
  );
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const data = useLoaderData() as Deck[];
  const [myDecks, setMyDecks] = useState<Deck[]>(data);

  async function createDeck() {
    setIsUpdating(true);
    const name = (
      document.querySelector("input[name=name]")! as HTMLInputElement
    ).value;
    if (!name) {
      setError({ message: "Name is required" });
      setIsUpdating(false);
      return;
    }

    try {
      await deckService.createDeck({
        id: 0,
        name: name ?? "Deck 1",
        description: "nice deck",
        promoId: "",
        format: "standard",
        cardCount: 0,
        viewCount: 0,
        colors: [],
        commanders: [],
        mainboard: [],
        sideboard: [],
      });
      let decks = await deckService.getDecks();
      setMyDecks(decks);
      setIsCreatingDeck(false);
      setError(undefined);
    } catch (error) {
      console.log(error);
      setError({ message: "Failed to create deck" });
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
          <button className="tb-button" onClick={showDeckForm}>
            Create
          </button>
        </div>
        {myDecks.length === 0 && <p>No decks found</p>}
        <DeckList decks={mappedDecks} />
      </div>
    </>
  );
};

export const loader = async () => {
  return await deckService.getDecks();
};

export default MyDecksList;
