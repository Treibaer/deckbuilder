import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Client from "../Services/Client.js";
import Constants from "../Services/Constants.js";
import DeckService from "../Services/DeckService.js";
import MagicHelper from "../Services/MagicHelper.js";
import cardStackImage from "../assets/cardstack.svg";
import chevronLeftImage from "../assets/chevron-left.svg";
import playgameImage from "../assets/playgame.svg";
import LoadingSpinner from "../components/Common/LoadingSpinner.jsx";
import CardPeekView from "../components/CardPeekView.jsx";
import DeckDetailsGridView from "../components/Decks/DeckDetailsGridView.jsx";
import DeckDetailsListView from "../components/Decks/DeckDetailsListView.jsx";
import "./MoxfieldDeckDetailView.css";

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
        <div className="tb-button-group">
          <button
            className="tb-button"
            onClick={() => {
              navigator(-1);
            }}
          >
            <img src={chevronLeftImage} className="icon" alt=" " />
            Back
          </button>
          <button className="tb-button" onClick={clone}>
            <img src={cardStackImage} className="icon" alt=" " />
            Clone
          </button>
          <button className="tb-button" onClick={didTapPlay}>
            <img src={playgameImage} className="icon" alt=" " />
            Play
          </button>
        </div>
        <h2>{deck.name}</h2>
        <div className="tb-button-group">
          {viewStyles.map((s) => (
            <button
              className={viewStyle === s ? "active tb-button" : "tb-button"}
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
          <DeckDetailsListView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}
        {viewStyle === "grid" && (
          <DeckDetailsGridView
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