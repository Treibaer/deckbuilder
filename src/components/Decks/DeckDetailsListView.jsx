import Helper from "../../Services/Helper";
import "./DeckDetailsListView.css";

export default function DeckDetailsListView({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  showCardPreview,
  openPrintSelection,
  moveZone,
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
                        <div onClick={() => showCardPreview(card)}>
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
                                  const zone =
                                    key === "Commanders"
                                      ? "commandZone"
                                      : "mainboard";
                                  addToDeck(card, zone);
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
                                    card,
                                    zone,
                                    card.quantity - 1
                                  );
                                }}
                              >
                                ➖
                              </span>
                              {card.reprint && (
                                <span onClick={() => openPrintSelection(card)}>
                                  ...
                                </span>
                              )}
                              {card.typeLine.includes("Legendary") && (
                                <span
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
