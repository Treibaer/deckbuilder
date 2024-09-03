import { DeckCard, MagicCard } from "../../models/dtos";
import MagicCardView from "../MagicCardView";
import Button from "./Button";
import "./DeckDetailsGridView.css";
import { CardSize, DeckStructure } from "../../models/structure";

const DeckDetailsGridView: React.FC<{
  structure: DeckStructure;
  setPreviewImage: (card: MagicCard | null, faceSide?: number) => void;
  addToDeck?: (card: MagicCard, zone: string) => void;
  updateCardAmount?: (card: MagicCard, zone: string, amount: number) => void;
  openPrintSelection?: (card: MagicCard) => void;
  showCardPreview: (card: MagicCard) => void;
  moveZone?: (card: MagicCard, from: string, to: string) => void;
}> = ({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  openPrintSelection,
  showCardPreview,
  moveZone,
}) => {
  function formatTitle(title: string, section: DeckCard[]) {
    const cardAmount = section.reduce((acc, card) => acc + card.quantity, 0);
    if (isNaN(cardAmount) || cardAmount === 0) {
      return title;
    }
    return `${title} (${cardAmount})`;
  }

  const handleAddToDeck = (card: DeckCard, key: string) => {
    const zone = key === "Commanders" ? "commandZone" : "mainboard";
    if (addToDeck) {
      addToDeck(card.card, zone);
    }
  };

  const handleRemoveFromDeck = (card: DeckCard, key: string) => {
    const zone = key === "Commanders" ? "commandZone" : "mainboard";
    if (updateCardAmount) {
      updateCardAmount(card.card, zone, card.quantity - 1);
    }
  };
  const handleMoveZone = (card: MagicCard, key: string) => {
    if (moveZone) {
      const from = key === "Commanders" ? "commandZone" : "mainboard";
      const to = key === "Commanders" ? "mainboard" : "commandZone";
      moveZone(card, from, to);
    }
  };

  const canEdit = addToDeck && updateCardAmount && openPrintSelection;

  return (
    <div id="deck-grid-view">
      {Object.keys(structure).map(
        (key, index) =>
          structure[key].length > 0 && (
            <div key={index + 200}>
              {key !== "Hide" && (
                <>
                  <h3>{formatTitle(key, structure[key])}</h3>
                  <div className="deck-grid-view-section">
                    {structure[key].map((card: DeckCard) => (
                      <div className="cardWrapper" key={card.card.scryfallId}>
                        <MagicCardView
                          card={card.card}
                          onTap={() => showCardPreview(card.card)}
                          onMouseOver={(faceSide) => {
                            setPreviewImage(card.card, faceSide);
                          }}
                          size={CardSize.small}
                        />
                        {card.quantity > 1 && (
                          <div className="amountOverlay">x{card.quantity}</div>
                        )}

                        {canEdit && (
                          <div className="actionButtons">
                            <div
                              className="action"
                              onClick={() => handleAddToDeck(card, key)}
                            >
                              +
                            </div>
                            <Button
                              title="-"
                              onClick={() => handleRemoveFromDeck(card, key)}
                            />
                            {card.card.reprint && (
                              <Button
                                title="..."
                                onClick={() => openPrintSelection(card.card)}
                              />
                            )}
                            {card.card.typeLine.includes("Legendary") && (
                              <Button
                                title="C"
                                onClick={() => handleMoveZone(card.card, key)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default DeckDetailsGridView;
