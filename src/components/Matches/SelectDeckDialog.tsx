import { useRef, useState } from "react";
import { Deck } from "../../models/dtos";
import MoxfieldService from "../../Services/MoxfieldService";
import Button from "../Button";
import Dialog from "../Common/Dialog";
import LoadingSpinner from "../Common/LoadingSpinner";
import SelectDeckDialogDeckPreview from "./SelectDeckDialogDeckPreview";

type Tab = "myDeck" | "moxfieldDeck";

const SelectDeckDialog: React.FC<{
  onSubmit: (deckId?: number, moxfieldId?: string) => void;
  onClose: () => void;
  decks: Deck[];
}> = ({ onSubmit, onClose, decks }) => {
  const [tab, setTab] = useState<Tab>("myDeck");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [selectedMoxfieldDeck, setSelectedMoxfieldDeck] = useState<Deck | null>(
    null
  );
  const [moxfieldInput, setMoxfieldInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchTimer = useRef<any>();

  function applyDeck() {
    if (tab === "myDeck" && selectedDeck) {
      onSubmit(selectedDeck.id);
    }
    if (tab === "moxfieldDeck" && selectedMoxfieldDeck) {
      onSubmit(undefined, "" + selectedMoxfieldDeck.id);
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
    setSelectedMoxfieldDeck(null);
    try {
      const deck = await MoxfieldService.shared.getDeck(id);
      setSelectedMoxfieldDeck(deck);
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
        (tab === "myDeck" && !selectedDeck) ||
        (tab === "moxfieldDeck" && !selectedMoxfieldDeck)
      }
    >
      <div className="flex gap-2">
        <Button
          title="My Decks"
          active={tab === "myDeck"}
          onClick={() => setTab("myDeck")}
        />
        <Button
          title="Moxfield Decks"
          active={tab === "moxfieldDeck"}
          onClick={() => setTab("moxfieldDeck")}
        />
      </div>
      <div className="h-24">
        {tab === "myDeck" && (
          <div className="flex gap-2 flex-col items-center">
            <select
              className="tb-select bg-transparent w-full"
              name="deck"
              defaultValue={selectedDeck?.id ?? 0}
              onChange={(event) =>
                setSelectedDeck(
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
              {selectedDeck && (
                <SelectDeckDialogDeckPreview
                  deck={selectedDeck}
                  type="myDeck"
                />
              )}
            </div>
          </div>
        )}
        {tab === "moxfieldDeck" && (
          <div className="flex gap-2 flex-col items-center">
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
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
              {selectedMoxfieldDeck && (
                <SelectDeckDialogDeckPreview
                  deck={selectedMoxfieldDeck}
                  type="moxfieldDeck"
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
