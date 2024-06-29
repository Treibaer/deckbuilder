import Helper from "../Helper";
import "./DeckListView.css";

export default function DeckListView({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  onClick,
}) {
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
                    {structure[key].map((card, index2) => (
                      <div
                        key={index2}
                        onMouseOver={() => {
                          setPreviewImage(card);
                        }}
                      >
                        <div onClick={() => onClick(card)}>
                          {card.quantity} x {card.name}
                        </div>
                        <div>
                          {Helper.convertCostsToImgArray(
                            card.manaCost ?? card.mana_cost
                          )}
                          {addToDeck && updateCardAmount && (
                            <span className="actions">
                              <span
                                onClick={() => {
                                  addToDeck(card);
                                }}
                              >
                                ➕
                              </span>
                              <span
                                onClick={() => {
                                  updateCardAmount(card, card.amount - 1);
                                }}
                              >
                                ➖
                              </span>
                              {card.reprint && (
                                <span
                                  onClick={() => {
                                    onClick(card);
                                  }}
                                >
                                  ...
                                </span>
                              )}
                              {!card.reprint && <span> </span>}
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
}
