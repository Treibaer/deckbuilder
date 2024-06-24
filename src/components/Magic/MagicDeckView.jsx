import { useEffect, useState } from "react";
import "./MagicDeckView.css";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import Helper from "./Helper.jsx";
import Client from "../../Services/Client.js";
import MagicHelper from "../../Services/MagicHelper.js";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";
const client = Client.shared;

export default function MagicDeckView({ deck, children }) {
  const [cards, setCards] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    client.getDeck(deck.publicId).then((cards) => {
      setCards(cards);
    });
  }, []);

  let image = previewImage || cards[0]?.image || backside;

  let structure = MagicHelper.getDeckStructureFromCards(cards);

  return (
    <div id="magic-deck-view">
      <div className="deck-details-header">
        <div>
          {children}
          <button
            className="play-button"
            onClick={() => {
              window
                .open(
                  "http://127.0.0.1:5502/play3.html?deck=" + deck.publicId,
                  "_blank"
                )
                .focus();
            }}
          >
            Play
          </button>
        </div>
        <h1>{deck.name}</h1>
      </div>
      <div id="deck-detail">
        <img src={image} alt={deck.name} />

        {cards.length === 0 && <LoadingSpinner />}
        <div className="stacked">
          {Object.keys(structure).map((key, index) => {
            return (
              structure[key].length > 0 && (
                <div key={index + 200}>
                  {key !== "Hide" && (
                    <>
                      <h3>{key}</h3>
                      <div className="deck-details-list">
                        {structure[key].map((card, index2) => (
                          <div
                            key={index2}
                            onMouseOver={() => {
                              setPreviewImage(card.image);
                            }}
                          >
                            <div>
                              {card.quantity} x {card.name}
                            </div>
                            <div>
                              {Helper.convertCostsToImgArray(card.manaCost)}
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
      </div>
      {/* {cards.length === 0 && <LoadingSpinner />}
      {cards.length && (
        <div>
          <h2>{deck.name}</h2>
          <h3>Cards</h3>
          <ul>
            <div className="card-container">
              {cards.map((card) => (
                <MagicCard key={card.id} card={card} onTap={() => {}} />
              ))}
            </div>
          </ul>
        </div>
      )} */}
    </div>
  );
}
