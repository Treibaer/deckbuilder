import { Deck } from "../../models/dtos";
import Dialog from "../Common/Dialog";

const SelectDeckDialog: React.FC<{
  onSubmit: () => void;
  onClose: () => void;
  decks: Deck[];
  setSelectedDeckId: (id: number) => void;
}> = ({ onSubmit, onClose, decks, setSelectedDeckId }) => {
  return (
    <Dialog
      title="Select Deck"
      onClose={onClose}
      onSubmit={onSubmit}
      submitTitle="Select"
    >
      <div className="formRow">
        <label htmlFor="enemy">My Deck</label>
      </div>
      <div className="formRow">
        <select
          name="deck"
          onChange={(event) => setSelectedDeckId(Number(event.target.value))}
        >
          {decks.map((deck, index) => (
            <option key={index} value={deck.id}>
              [{deck.id}] {deck.name}
            </option>
          ))}
        </select>
      </div>
    </Dialog>
  );
};

export default SelectDeckDialog;
