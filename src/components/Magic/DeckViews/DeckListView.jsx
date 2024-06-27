import Helper from "../Helper";
import "./DeckListView.css";

export default function DeckListView({ structure, setPreviewImage }) {
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
                        <div>
                          {card.quantity} x {card.name}
                        </div>
                        <div>
                          {Helper.convertCostsToImgArray(
                            card.manaCost ?? card.mana_cost
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
