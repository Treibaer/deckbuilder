import { useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import DelayedLoadingSpinner from "../components/Common/DelayedLoadingSpinner";
import Dialog from "../components/Common/Dialog";
import DeckList from "../components/Decks/DecksList";
import TitleView from "../components/TitleView";
import { Deck } from "../models/dtos";
import DeckService from "../Services/DeckService";
import MagicHelper from "../Services/MagicHelper";
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

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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
      {isCreatingDeck && (
        <Dialog
          title="Create Deck"
          onClose={closeDialog}
          onSubmit={createDeck}
          error={error}
        >
          <label htmlFor="name">Name</label>
          <input
            ref={inputRef}
            className="tb-input mb-10"
            type="text"
            name="name"
          />
        </Dialog>
      )}
      {isUpdating && <DelayedLoadingSpinner />}
      <TitleView title="My Decks" openDialog={showDeckForm} />
      {myDecks.length === 0 && <p>No decks found</p>}
      <DeckList decks={mappedDecks} />
    </div>
  );
};

export const loader = async () => {
  return await deckService.getAll();
};

export default MyDecksList;
