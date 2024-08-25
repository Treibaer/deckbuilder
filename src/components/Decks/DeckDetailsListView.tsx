import { DeckCard, MagicCard } from "../../pages/deck";
import "./DeckDetailsListView.css";

const DeckDetailsListView: React.FC<{
  structure: any;
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
                          {addToDeck && updateCardAmount && (
                            <span className="actions">
                              <span
                                onClick={() => {
                                  const zone =
                                    key === "Commanders"
                                      ? "commandZone"
                                      : "mainboard";
                                  addToDeck(card.card, zone);
                                }}
                              >
                                ➕
                              </span>
                              <span
                                onClick={() => {
                                  const zone =
                                    key === "Commanders"
                                      ? "commandZone"
                                      : "mainboard";
                                  updateCardAmount(
                                    card.card,
                                    zone,
                                    card.quantity - 1
                                  );
                                }}
                              >
                                ➖
                              </span>
                              {card.card.reprint && (
                                <span
                                  onClick={() =>
                                    openPrintSelection &&
                                    openPrintSelection(card.card)
                                  }
                                >
                                  ...
                                </span>
                              )}
                              {card.card.typeLine.includes("Legendary") &&
                                moveZone && (
                                  <span
                                    className="action"
                                    onClick={() => {
                                      if (key === "Commanders") {
                                        moveZone(
                                          card.card,
                                          "commandZone",
                                          "mainboard"
                                        );
                                      } else {
                                        moveZone(
                                          card.card,
                                          "mainboard",
                                          "commandZone"
                                        );
                                      }
                                    }}
                                  >
                                    C
                                  </span>
                                )}
                              {!card.card.reprint && <span> </span>}
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
