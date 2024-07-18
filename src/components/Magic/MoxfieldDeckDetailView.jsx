import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Client from "../../Services/Client.js";
import DeckService from "../../Services/DeckService.js";
import MagicHelper from "../../Services/MagicHelper.js";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import CardPeekView from "./CardPeekView.jsx";
import DeckGridView from "./DeckViews/DeckGridView.jsx";
import DeckListView from "./DeckViews/DeckListView.jsx";
import "./MoxfieldDeckDetailView.css";
import Constants from "../../Services/Constants.js";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;
const client = Client.shared;
const deckService = DeckService.shared;
const viewStyles = ["list", "grid"];

export default function MoxfieldDeckDetailView() {
  const navigator = useNavigate();
  const deck = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);

  const [cardPreview, setCardPreview] = useState(false);
  const [hovered, setHovered] = useState({
    isPreviewCardFromDeck: true,
    scryfallId: null,
    faceSide: 0,
  });
  const [viewStyle, setViewStyle] = useState("grid");

  let cards = deck.mainboard
    .map((card) => {
      let newCard = card.card;
      newCard.type = MagicHelper.determineCardType(newCard);
      newCard.quantity = card.quantity;
      return newCard;
    })
    .filter((card) => {
      return card !== null;
    });

  const previewId = hovered.scryfallId ?? deck.promoId;

  const image = previewId
    ? MagicHelper.getImageUrl(previewId, "normal", hovered.faceSide ?? 0)
    : backside;
    console.log(image);
  const structure = MagicHelper.getDeckStructureFromCards(cards);

  structure["Commanders"] = deck.commanders.map((card) => {
    let newCard = card.card;
    newCard.type = MagicHelper.determineCardType(newCard);
    newCard.quantity = card.quantity;
    return newCard;
  });

  function setPreviewImage(card, faceSide) {
    setHovered({
      isPreviewCardFromDeck: true,
      scryfallId: card.scryfallId,
      faceSide: faceSide,
    });
  }

  async function clone() {
    setIsLoading(true);
    const newDeck = await deckService.cloneMoxfieldDeck(deck.id);
    // wait 1 seconds for the deck to be created, otherwise, it's too fast and you don't see that a deck is created
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigator("/decks/my/" + newDeck.id);
  }

  function showCardPreview(card) {
    setCardPreview(card);
  }

  async function didTapPlay() {
    const path = `/playtests`;
    const data = {
      moxFieldDeckId: deck.id,
    };
    const response = await Client.shared.post(path, JSON.stringify(data));
    window
      .open("/magic-web-js/play3.html?mId=" + response.id, "_blank")
      .focus();
  }

  return (
    <div id="magic-deck-view">
      {isLoading && <LoadingSpinner />}

      {cardPreview && (
        <CardPeekView card={cardPreview} onClose={() => setCardPreview(null)} />
      )}
      <div className="deck-details-header">
        <div>
          <button
            onClick={() => {
              navigator(-1);
            }}
          >
            Back
          </button>

          <button onClick={clone}>Clone</button>
          <button className="play-button" onClick={didTapPlay}>
            Play
          </button>
        </div>
        <h2>{deck.name}</h2>
        <div>
          {viewStyles.map((s) => (
            <button
              className={viewStyle === s ? "selected" : ""}
              key={s}
              onClick={() => {
                setViewStyle(s);
              }}
            >
              {s.capitalize()}
            </button>
          ))}
        </div>
      </div>

      <div id="deck-detail">
        <div className="image-stats">
          <img className="backside" src={backside} alt=" " />
          <img src={image} alt=" " />
          <div>Cards: {deck.cardCount}</div>
        </div>
        {viewStyle === "list" && (
          <DeckListView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}
        {viewStyle === "grid" && (
          <DeckGridView
            structure={structure}
            setPreviewImage={setPreviewImage}
            showCardPreview={showCardPreview}
          />
        )}
      </div>
    </div>
  );
}

export const loader = async ({ params }) => {
  const response = await client.getDeck(params.publicId);
  return response;
};
