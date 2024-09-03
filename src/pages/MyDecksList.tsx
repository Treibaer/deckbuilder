import { useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Dialog from "../components/Common/Dialog";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Button from "../components/Decks/Button";
import DeckList from "../components/Decks/DecksList";
import DeckService from "../Services/DeckService";
import MagicHelper from "../Services/MagicHelper";
import "./MyDecksList.css";
import { Deck } from "../models/dtos";

const deckService = DeckService.shared;

const MyDecksList = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<{ message: string } | undefined>(
    undefined
  );
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const data = useLoaderData() as Deck[];
  const [myDecks, setMyDecks] = useState<Deck[]>(data);
  const inputRef = useRef<HTMLInputElement>(null);

  async function createDeck() {
    setIsUpdating(true);

    if (!inputRef.current?.value) {
      setError({ message: "Name is required" });
      setIsUpdating(false);
      return;
    }

    try {
      await deckService.create(inputRef.current.value);
      let decks = await deckService.getAll();
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
            <input ref={inputRef} type="text" name="name" />
          </Dialog>
        )}
        {isUpdating && <LoadingSpinner />}
        <Button title="Create" onClick={showDeckForm} />
      </div>
      {myDecks.length === 0 && <p>No decks found</p>}
      <DeckList decks={mappedDecks} />
    </div>
  );
};

export const loader = async () => {
  return await deckService.getAll();
};

export default MyDecksList;
