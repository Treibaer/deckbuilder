import Dialog from "../Common/Dialog";

export default function SelectDeckDialog({ onSubmit, onClose, decks, setSelectedDeckId }) {
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
          onChange={(event) => setSelectedDeckId(event.target.value)}
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
}
