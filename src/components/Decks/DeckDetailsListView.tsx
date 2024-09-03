import { DeckCard, MagicCard } from "../../models/dtos";
import "./DeckDetailsListView.css";
import { DeckStructure } from "../../models/structure";

const DeckDetailsListView: React.FC<{
  structure: DeckStructure;
  setPreviewImage: (card: MagicCard, faceSide?: number) => void;
  addToDeck?: (card: MagicCard, zone: string) => void;
  updateCardAmount?: (card: MagicCard, zone: string, amount: number) => void;
  showCardPreview?: (card: MagicCard) => void;
  openPrintSelection?: (card: MagicCard) => void;
  moveZone?: (card: MagicCard, from: string, to: string) => void;
}> = ({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  showCardPreview,
  openPrintSelection,
  moveZone,
}) => {
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
    <div id="deck-list-view">
      {Object.keys(structure).map((key, index) => {
        return (
          structure[key].length > 0 && (
            <div key={index + 200}>
              {key !== "Hide" && (
                <>
                  <h3>{key}</h3>
                  <div className="deck-list-view-section">
                    {structure[key].map((card: DeckCard) => (
                      <div
                        key={card.card.scryfallId}
                        onMouseOver={() => {
                          setPreviewImage(card.card);
                        }}
                      >
                        <div
                          onClick={() =>
                            showCardPreview && showCardPreview(card.card)
                          }
                        >
                          {card.quantity} x {card.card.name}
                        </div>
                        <div>
                          {/* {Helper.convertCostsToImgArray(
                            card.card.manaCost ?? card.card.mana_cost
                          )} */}
                          {canEdit && (
                            <span className="actions">
                              <span
                                onClick={() => {
                                  handleAddToDeck(card, key);
                                }}
                              >
                                ➕
                              </span>
                              <span
                                onClick={() => handleRemoveFromDeck(card, key)}
                              >
                                ➖
                              </span>
                              {card.card.reprint && (
                                <span
                                  onClick={() => openPrintSelection(card.card)}
                                >
                                  ...
                                </span>
                              )}
                              {card.card.typeLine.includes("Legendary") &&
                                moveZone && (
                                  <span
                                    className="action"
                                    onClick={() => {
                                      handleMoveZone(card.card, key);
                                    }}
                                  >
                                    C
                                  </span>
                                )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default DeckDetailsListView;
