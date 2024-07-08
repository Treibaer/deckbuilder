import MagicCardView from "../MagicCardView";
import "./DeckGridView.css";

export default function DeckGridView({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  openPrintSelection,
}) {
  function formatTitle(title, section) {
    const cardAmount = section.reduce((acc, card) => acc + card.quantity, 0);
    if (isNaN(cardAmount) || cardAmount === 0) {
      return title;
    }
    return `${title} (${cardAmount})`;
  }
  // console.log(structure);
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
                      <div className="cardWrapper" key={card.id}>
                        <MagicCardView
                          card={card}
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
                                addToDeck(card);
                              }}
                            >
                              +
                            </div>
                            <div
                              className="action"
                              onClick={() => {
                                updateCardAmount(card, card.quantity - 1);
                              }}
                            >
                              -
                            </div>
                            {card.reprint && (
                              <div
                                className="action"
                                onClick={() => {
                                  openPrintSelection(card);
                                }}
                              >
                                ...
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
