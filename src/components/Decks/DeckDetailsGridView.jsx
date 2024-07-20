import MagicCardView from "../MagicCardView";
import "./DeckDetailsGridView.css";

export default function DeckDetailsGridView({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  openPrintSelection,
  showCardPreview,
  moveZone,
}) {
  function formatTitle(title, section) {
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
                    {structure[key].map((card, index2) => (
                      <div className="cardWrapper" key={card.scryfallId}>
                        <MagicCardView
                          card={card}
                          onTap={() => showCardPreview(card)}
                          onMouseOver={(faceSide) => {
                            setPreviewImage(card, faceSide);
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
                                addToDeck(card, zone);
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
                                updateCardAmount(card, zone, card.quantity - 1);
                              }}
                            >
                              -
                            </div>
                            {card.reprint && (
                              <div
                                className="action"
                                onClick={() => openPrintSelection(card)}
                              >
                                ...
                              </div>
                            )}
                            {card.typeLine.includes("Legendary") && (
                              <div
                                className="action"
                                onClick={() => {
                                  if (key === "Commanders") {
                                    moveZone(card, "commandZone", "mainboard");
                                  } else {
                                    moveZone(card, "mainboard", "commandZone");
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
}
