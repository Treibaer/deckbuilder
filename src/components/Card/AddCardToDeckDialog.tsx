import { useEffect, useState } from "react";
import { Deck, MagicCard } from "../../models/dtos";
import DeckService from "../../Services/DeckService";
import Dialog from "../Common/Dialog";
import { CardSize } from "../../models/structure";
import MagicCardView from "../MagicCardView";

const deckService = DeckService.shared;

const AddCardToDeckDialog: React.FC<{
  onClose: () => void;
  card: MagicCard;
  setIsLoading: (value: boolean) => void;
}> = ({ onClose, card, setIsLoading }) => {
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  async function addCardToDeck() {
    setIsLoading(true);
    if (!selectedDeckId) {
      return;
    }
    onClose();
    const deck = myDecks.filter((deck) => deck.id === selectedDeckId)[0];
    await deckService.addCardToDeck(deck, card.scryfallId, "mainboard", selectedQuantity);
    setIsLoading(false);
  }

  async function loadDecks() {
    let currentDecks = await deckService.getAll();
    currentDecks = currentDecks.filter((deck) => !deck.isLocked); 
    if (currentDecks.length === 0) {
      return;
    }
    setSelectedDeckId(currentDecks[0]?.id);
    setMyDecks((_) => currentDecks);
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
      <div className="mx-auto">
        <MagicCardView card={card} size={CardSize.large} />
      </div>
      <div className="mx-auto">
        {myDecks.length === 0 && (
          <select disabled  className="h-8 px-2 rounded-xl">
            <option>No decks available</option>
          </select>
        )}
        {myDecks.length > 0 && (
          <select name="deck" id="deck" className="h-8 px-2 rounded-xl" onChange={handleDeckChange}>
            {myDecks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                [{deck.id}] {deck.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="mx-auto">
        <select onChange={handleQuantityChange}  className="h-8 px-2 rounded-xl" disabled={myDecks.length === 0}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
    </Dialog>
  );
};

export default AddCardToDeckDialog;
