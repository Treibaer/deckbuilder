import { DeckCard, MagicCard } from "../../pages/deck";
import MagicCardView from "../MagicCardView";
import "./DeckDetailsGridView.css";

const DeckDetailsGridView: React.FC<{
  structure: any;
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
  return (
    <div id="deck-grid-view">
      {Object.keys(structure).map((key, index) => {
        return (
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
                          size="small"
                        />
                        {card.quantity > 1 && (
                          <div className="amountOverlay">x{card.quantity}</div>
                        )}

                        {addToDeck && updateCardAmount && (
                          <div className="actionButtons">
                            <div
                              className="action"
                              onClick={() => {
                                const zone =
                                  key === "Commanders"
                                    ? "commandZone"
                                    : "mainboard";
                                addToDeck(card.card, zone);
                              }}
                            >
                              +
                            </div>
                            <div
                              className="action"
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
                              -
                            </div>
                            {card.card.reprint && (
                              <div
                                className="action"
                                onClick={() =>
                                  openPrintSelection &&
                                  openPrintSelection(card.card)
                                }
                              >
                                ...
                              </div>
                            )}
                            {card.card.typeLine.includes("Legendary") && (
                              <div
                                className="action"
                                onClick={() => {
                                  if (key === "Commanders") {
                                    moveZone && moveZone(
                                      card.card,
                                      "commandZone",
                                      "mainboard"
                                    );
                                  } else {
                                    moveZone && moveZone(
                                      card.card,
                                      "mainboard",
                                      "commandZone"
                                    );
                                  }
                                }}
                              >
                                C
                              </div>
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
        );
      })}
    </div>
  );
};

export default DeckDetailsGridView;
