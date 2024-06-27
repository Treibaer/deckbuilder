import MagicCardView from "../MagicCardView";
import "./DeckGridView.css";

export default function DeckGridView({ structure, setPreviewImage }) {
  return (
    <div id="deck-grid-view">
      {Object.keys(structure).map((key, index) => {
        return (
          structure[key].length > 0 && (
            <div key={index + 200}>
              {key !== "Hide" && (
                <>
                  <h3>
                    {key} {`(${structure[key].length})`}
                  </h3>
                  <div className="deck-grid-view-section">
                    {structure[key].map((card, index2) => (
                      <div key={index2}>
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
