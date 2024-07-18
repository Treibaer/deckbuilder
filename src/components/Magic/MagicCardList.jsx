import { useState } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import CardPeekView from "./CardPeekView";
import Helper from "./Helper";
import "./MagicCardList.css";
import MagicCardView from "./MagicCardView";

export default function MagicCardList({ cards }) {
  let [style, setStyle] = useState("cards");
  let [size, setSize] = useState("normal");
  let [selectedCard, setSelectedCard] = useState(null);

  return (
    <div id="magic-card-list">
      {selectedCard && (
        <CardPeekView
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
      <div className="styleSelection">
        <div>
          {style === "cards" &&
            ["small", "normal", "large"].map((s) => (
              <button
                className={size === s ? "selected" : ""}
                key={s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
        </div>
        {style === "list" && (
          <button onClick={() => setStyle("cards")}>Show as cards</button>
        )}
        {style === "cards" && (
          <button onClick={() => setStyle("list")}>Show as list</button>
        )}
      </div>

      {style === "cards" && (
        <div id="card-container">
          {style === "cards" &&
            cards.map((card, index) => (
              <MagicCardView
                key={card.scryfallId}
                card={card}
                onTap={() => setSelectedCard(card)}
                size={size}
              />
            ))}
        </div>
      )}
      {style === "list" && (
        <div id="card-list-container">
          {cards.map((card, index) => (
            <div key={index}>
              <div>{card.name}</div>
              <div>{card.rarity}</div>
              <div>{Helper.convertCostsToImgArray(card.mana_cost)}</div>
              <div>{card.type_line}</div>
              <div>
                {card.colors &&
                  card.colors.map((color) =>
                    Helper.replaceColorSymbolsByImage(color)
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
