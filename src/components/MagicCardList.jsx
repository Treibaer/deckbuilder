import { useState } from "react";
import CardPeekView from "./CardPeekView";
import Helper from "../Services/Helper";
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
                className={size === s ? "active tb-button" : "tb-button"}
                key={s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
        </div>

        {cards.length > 0 && (
          <div className="title">
            {cards.length} card{cards.length === 1 ? "" : "s"} found
          </div>
        )}
        {style === "list" && (
          <button className="tb-button" onClick={() => setStyle("cards")}>
            Show as cards
          </button>
        )}
        {style === "cards" && (
          <button className="tb-button" onClick={() => setStyle("list")}>
            Show as list
          </button>
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