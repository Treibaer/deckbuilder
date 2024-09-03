import { useEffect, useState } from "react";
import { Deck, MagicCard } from "../../models/dtos";
import DeckService from "../../Services/DeckService";
import Dialog from "../Common/Dialog";
import { CardSize } from "../../models/structure";
import MagicCardView from "../MagicCardView";

const deckService = DeckService.shared;

const AddToDeckDialog: React.FC<{
  onClose: () => void;
  card: MagicCard;
  setIsLoading: (value: boolean) => void;
}> = ({ onClose, card, setIsLoading }) => {
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  async function addCardToDeck() {
    setIsLoading(true);
    onClose();
    const deck = myDecks.filter((deck) => deck.id === selectedDeckId)[0];
    await deckService.addCardToDeck(deck, card, "mainboard", selectedQuantity);
    setIsLoading(false);
  }

  async function loadDecks() {
    const currentDecks = await deckService.getAll();
    setSelectedDeckId(currentDecks[0]?.id);
    setMyDecks((decks) => currentDecks);
  }

  useEffect(() => {
    loadDecks();
  }, []);

  const handleDeckChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeckId(parseInt(event.target.value));
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedQuantity(parseInt(event.target.value));
  };

  return (
    <Dialog
      title="Add to Deck"
      onClose={onClose}
      onSubmit={addCardToDeck}
      submitTitle="Add"
    >
      <div className="cardPreview">
        <MagicCardView card={card} size={CardSize.small} />
      </div>
      <div className="deckSelect">
        {myDecks.length === 0 && (
          <select disabled>
            <option>Loading...</option>
          </select>
        )}
        {myDecks && (
          <select name="deck" id="deck" onChange={handleDeckChange}>
            {myDecks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                [{deck.id}] {deck.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="quantitySelect">
        <select onChange={handleQuantityChange}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <option key={i} value={i}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </Dialog>
  );
};

export default AddToDeckDialog;
