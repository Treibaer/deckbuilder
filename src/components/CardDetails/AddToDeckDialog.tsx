import { useEffect, useState } from "react";
import { Deck, MagicCard } from "../../pages/deck";
import DeckService from "../../Services/DeckService";
import Dialog from "../Common/Dialog";
import MagicCardView from "../MagicCardView";

const AddToDeckDialog: React.FC<{
  onClose: () => void;
  card: MagicCard;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onClose, card, setIsLoading }) => {
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  async function addCardToDeck() {
    setIsLoading(true);
    onClose();
    const deck = myDecks.filter((deck) => deck.id === selectedDeckId)[0];
    await DeckService.shared.addCardToDeck(
      deck,
      card,
      "mainboard",
      selectedQuantity
    );
    setIsLoading(false);
  }

  async function load() {
    const currentDecks = await DeckService.shared.getDecks();
    setSelectedDeckId(currentDecks[0]?.id);
    setMyDecks(currentDecks);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <Dialog
      title="Add to Deck"
      onClose={onClose}
      onSubmit={addCardToDeck}
      submitTitle="Add"
    >
      <div className="cardPreview">
        <MagicCardView card={card} size="small" />
      </div>
      <div className="deckSelect">
        {!myDecks && (
          <select disabled>
            <option>Loading...</option>
          </select>
        )}
        {myDecks && (
          <select
            name="deck"
            id="deck"
            onChange={(event) => {
              setSelectedDeckId(parseInt(event.target.value));
            }}
          >
            {myDecks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                [{deck.id}] {deck.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="quantitySelect">
        <select
          onChange={(event) => {
            setSelectedQuantity(parseInt(event.target.value));
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </Dialog>
  );
};

export default AddToDeckDialog;
