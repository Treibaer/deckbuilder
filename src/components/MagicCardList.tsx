import { useState } from "react";
import Helper from "../Services/Helper";
import CardPeekView from "./CardPeekView";
import "./MagicCardList.css";
import MagicCardView from "./MagicCardView";
import { Button } from "./Decks/Button";
import { CardSize, CardStyle } from "./Decks/structure";

const MagicCardList: React.FC<{ cards: any[] }> = ({ cards }) => {
  let [style, setStyle] = useState(CardStyle.cards);
  let [size, setSize] = useState(CardSize.normal);
  let [selectedCard, setSelectedCard] = useState(null);

  return (
    <div id="magic-card-list">
      {selectedCard && (
        <CardPeekView
          card={selectedCard}
          onClose={setSelectedCard.bind(null, null)}
        />
      )}
      <div className="styleSelection">
        <div>
          {style === CardStyle.cards &&
            [CardSize.small, CardSize.normal, CardSize.large].map((s) => (
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
        {style === CardStyle.list && (
          <Button title="Card View" onClick={() => setStyle(CardStyle.cards)} />
        )}
        {style === CardStyle.cards && (
          <Button title="List View" onClick={() => setStyle(CardStyle.list)} />
        )}
      </div>

      {style === CardStyle.cards && (
        <div id="card-container">
          {cards.map((card, _) => (
            <MagicCardView
              key={card.scryfallId}
              card={card}
              onTap={() => setSelectedCard(card)}
            />
          ))}
        </div>
      )}
      {style === CardStyle.list && (
        <div id="card-list-container">
          {cards.map((card, index) => (
            <div key={index}>
              <div>{card.name}</div>
              <div>{card.rarity}</div>
              <div>{Helper.convertCostsToImgArray(card.mana_cost)}</div>
              <div>{card.type_line}</div>
              <div>
                {card.colors &&
                  card.colors.map((color: string) =>
                    Helper.replaceColorSymbolsByImage(color)
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MagicCardList;
