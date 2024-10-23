import { useState } from "react";
import { CardSize, CardStyle } from "../models/structure";
import Helper from "../Services/Helper";
import Button from "./Button";
import CardPeekView from "./Card/CardPeekView";
import MagicCardView from "./MagicCardView";
import { AnimatePresence } from "framer-motion";
const MagicCardList: React.FC<{ cards: any[] }> = ({ cards }) => {
  let [style, setStyle] = useState(CardStyle.cards);
  let [size, setSize] = useState(CardSize.normal);
  let [selectedCard, setSelectedCard] = useState(null);

  return (
    <div id="magic-card-list" className="flex flex-col items-center">
      <AnimatePresence>
      {selectedCard && (
          <CardPeekView
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
      )}
      </AnimatePresence>
      <div className="styleSelection gap-24 items-center mt-2 flex">
        <div className="w-64 gap-2 hidden md:flex">
          {style === CardStyle.cards &&
            [CardSize.small, CardSize.normal, CardSize.large].map((s) => (
              <Button
                active={size === s}
                key={s}
                onClick={() => setSize(s)}
                title={s}
              />
            ))}
        </div>

        {cards.length > 0 && (
          <div className="text-xl font-semibold">
            {cards.length} card{cards.length === 1 ? "" : "s"} found
          </div>
        )}
        <div className="w-64 hidden md:flex justify-end">
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
        <div
          id="card-container"
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
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
        <div className="w-full select-none">
          {cards.map((card, index) => (
            <div
              className="grid grid-cols-5 items-center gap-4 w-full py-2"
              key={index}
            >
              <div className="text-start col-span-1">{card.name}</div>
              <div className="col-span-1">{card.rarity}</div>
              <div className="col-span-1 flex">
                {Helper.convertCostsToImgArray(card.mana_cost)}
              </div>
              <div className="col-span-1">{card.type_line}</div>
              <div className="col-span-1 flex">
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
