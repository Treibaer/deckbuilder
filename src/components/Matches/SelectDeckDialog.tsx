import { useEffect, useRef, useState } from "react";
import { Deck } from "../../models/dtos";
import MoxfieldService from "../../Services/MoxfieldService";
import Button from "../Button";
import Dialog from "../Common/Dialog";
import LoadingSpinner from "../Common/LoadingSpinner";
import SelectDeckDialogDeckPreview from "./SelectDeckDialogDeckPreview";
import Client from "../../Services/Client";

type Tab = "myDeck" | "moxfield" | "favorites";

const SelectDeckDialog: React.FC<{
  onSubmit: (deckId?: number, moxfieldId?: string) => void;
  onClose: () => void;
  decks: Deck[];
}> = ({ onSubmit, onClose, decks }) => {
  const [tab, setTab] = useState<Tab>("moxfield");
  const [deck, setDeck] = useState<Deck | null>(null);
  const [favoriteDeck, setFavoriteDeck] = useState<Deck | null>(null);
  const [moxfieldDeck, setMoxfieldDeck] = useState<Deck | null>(null);
  const [moxfieldInput, setMoxfieldInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const moxfieldInputRef = useRef<HTMLInputElement>(null);

  const [favoriteDecks, setFavoriteDecks] = useState<Deck[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      const favorites = await Client.shared.get<Deck[]>("/favorites", true);
      setFavoriteDecks(favorites);
    }
    loadFavorites();
  }, [tab]);

  useEffect(() => {
    if (tab === "moxfield") {
      setTimeout(() => {
        moxfieldInputRef.current?.focus();
      }, 100);
    }
  }, []);

  const searchTimer = useRef<any>();

  function applyDeck() {
    if (tab === "myDeck" && deck) {
      onSubmit(deck.id);
    }
    if (tab === "moxfield" && moxfieldDeck) {
      onSubmit(undefined, "" + moxfieldDeck.id);
    }
  }

  async function loadMoxFieldDeck(urlOrId: string) {
    const id = urlOrId.split("/").pop();
    if (!id) {
      return;
    }

    const validIdRegex = /^[a-zA-Z0-9_-]{1,2}-?[a-zA-Z0-9_-]{8,24}$/;
    if (!validIdRegex.test(id)) {
      return;
    }

    setIsLoading(true);
    setMoxfieldDeck(null);
    try {
      const deck = await MoxfieldService.shared.getDeck(id);
      setMoxfieldDeck(deck);
    } catch (e) {
      // console.error(e);
    }
    setIsLoading(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMoxfieldInput(event.target.value);
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      loadMoxFieldDeck(event.target.value);
    }, 500);
  }

  return (
    <Dialog
      title="Select Deck"
      onClose={onClose}
      onSubmit={applyDeck}
      submitTitle="Select"
      disabledButton={
        isLoading ||
        (tab === "myDeck" && !deck) ||
        (tab === "moxfield" && !moxfieldDeck)
      }
    >
      <div className="flex gap-2">
        <Button
          title="Moxfield"
          active={tab === "moxfield"}
          onClick={() => {
            setTab("moxfield");
            setTimeout(() => {
              moxfieldInputRef.current?.focus();
            }, 100);
          }}
        />
        <Button
          title="Favorites"
          active={tab === "favorites"}
          onClick={() => setTab("favorites")}
        />
        <Button
          title="My Decks"
          active={tab === "myDeck"}
          onClick={() => setTab("myDeck")}
        />
      </div>
      <div className="h-24">
        {tab === "myDeck" && (
          <div className="flex gap-2 flex-col items-center">
            <select
              className="tb-select bg-transparent w-full"
              name="deck"
              defaultValue={deck?.id ?? 0}
              onChange={(event) =>
                setDeck(
                  decks.find((deck) => deck.id === +event.target.value) ?? null
                )
              }
            >
              <option value={0}>Select Deck</option>
              {decks.map((deck, index) => (
                <option key={index} value={deck.id}>
                  [{deck.id}] {deck.name}
                </option>
              ))}
            </select>

            <div className="w-full select-none">
              {deck && (
                <SelectDeckDialogDeckPreview deck={deck} type="myDeck" />
              )}
            </div>
          </div>
        )}
        {tab === "favorites" && (
          <div className="flex gap-2 flex-col items-center">
            <select
              className="tb-select bg-transparent w-full"
              defaultValue={favoriteDeck?.id ?? ""}
              onChange={(event) =>
                setFavoriteDeck(
                  favoriteDecks.find(
                    (deck) => `${deck.id}` === event.target.value
                  ) ?? null
                )
              }
            >
              <option value={0}>Select Deck</option>
              {favoriteDecks.map((deck, index) => (
                <option key={index} value={deck.id}>
                  [{deck.format}] - [{deck.colors.join(", ")}]: {deck.name}
                </option>
              ))}
            </select>

            <div className="w-full select-none">
              {favoriteDeck && (
                <SelectDeckDialogDeckPreview
                  deck={favoriteDeck}
                  type="favorites"
                />
              )}
            </div>
          </div>
        )}
        {tab === "moxfield" && (
          <div className="flex gap-2 flex-col items-center">
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                ref={moxfieldInputRef}
                placeholder="Moxfield URL or ID"
                className="tb-input w-full"
                defaultValue={moxfieldInput}
                onChange={handleChange}
              />
              <div className="w-10">
                {isLoading && <LoadingSpinner inline />}
              </div>
            </div>
            <div className="w-full select-none">
              {moxfieldDeck && (
                <SelectDeckDialogDeckPreview
                  deck={moxfieldDeck}
                  type="moxfield"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default SelectDeckDialog;
