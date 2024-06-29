import { useState } from "react";
import MagicHelper from "../../Services/MagicHelper";
import LoadingSpinner from "../Common/LoadingSpinner";
import Helper from "./Helper";
import "./MagicCardList.css";
import MagicCardView from "./MagicCardView";

export default function MagicCardList({ cards }) {
  let [style, setStyle] = useState("cards");
  let [size, setSize] = useState("normal");
  let [selectedCard, setSelectedCard] = useState(null);

  const [faceSide, setFaceSide] = useState(0);

  function changeFaceSide() {
    setFaceSide((faceSide) => (faceSide + 1) % selectedCard.card_faces.length);
  }

  return (
    <div id="magic-card-list">
      {selectedCard && (
        <div
          className={`fullscreenCard`}
        >
          <div
            className="background"
            onClick={() => setSelectedCard(null)}
          ></div>
          <div className="relative-wrapper">
            <div className={`image-wrapper ${faceSide === 0 ? "normal" : "flipped"}`}>
              <img
                src={MagicHelper.determineImageUrl(selectedCard, faceSide)}
                onClick={() => setSelectedCard(null)}
              />
            </div>
            {selectedCard.card_faces && (
              <div className="magicCardRotateButton" onClick={changeFaceSide}>
                R
              </div>
            )}
          </div>
        </div>
      )}
      {["small", "normal", "large"].map((s) => (
        <button
          className={size === s ? "selected" : ""}
          key={s}
          onClick={() => {
            setSize(s);
          }}
        >
          {s}
        </button>
      ))}
      {style === "list" && (
        <button onClick={() => setStyle("cards")}>Show as cards</button>
      )}
      {style === "cards" && (
        <button onClick={() => setStyle("list")}>Show as list</button>
      )}

      {/* <img
        className="manaSymbol"
        src={U}
        onClick={() => {
          handleManaSymbolClick("U");
        }} */}
      {/* /> */}
      {style === "cards" && (
        <div id="card-container">
          {cards.length === 0 && <LoadingSpinner />}
          {style === "cards" &&
            cards.map((card, index) => (
              <MagicCardView
                key={card.id}
                card={card}
                onTap={() => {
                  setSelectedCard(card);
                }}
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
