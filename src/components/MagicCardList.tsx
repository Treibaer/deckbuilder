import { useState } from "react";
import Helper from "../Services/Helper";
import CardPeekView from "./CardPeekView";
import "./MagicCardList.css";
import MagicCardView from "./MagicCardView";
import Button from "./Decks/Button";
import { CardSize, CardStyle } from "../models/structure";

const MagicCardList: React.FC<{ cards: any[] }> = ({ cards }) => {
  let [style, setStyle] = useState(CardStyle.cards);
  let [size, setSize] = useState(CardSize.normal);
  let [selectedCard, setSelectedCard] = useState(null);

  return (
    <div id="magic-card-list" className="flex flex-col items-center">
      {selectedCard && (
        <CardPeekView
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
      <div className="styleSelection flex gap-24 items-center mt-2">
        <div className="w-64">
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
          <div className="text-xl font-semibold">
            {cards.length} card{cards.length === 1 ? "" : "s"} found
          </div>
        )}
        <div className="w-64 flex justify-end">
          {style === CardStyle.list && (
            <Button
              title="Card View"
              onClick={() => setStyle(CardStyle.cards)}
            />
          )}
          {style === CardStyle.cards && (
            <Button
              title="List View"
              onClick={() => setStyle(CardStyle.list)}
            />
          )}
        </div>
      </div>

      {style === CardStyle.cards && (
        <div id="card-container" className="flex flex-wrap gap-2 mt-4">
          {cards.map((card, _) => (
            <MagicCardView
              key={card.scryfallId}
              size={size}
              card={card}
              onTap={() => setSelectedCard(card)}
              hoverable={true}
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
