import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Client from "../../Services/Client.js";
import MagicHelper from "../../Services/MagicHelper.js";
import DeckGridView from "./DeckViews/DeckGridView.jsx";
import DeckListView from "./DeckViews/DeckListView.jsx";
import "./MoxfieldDeckDetailView.css";
import DeckService from "../../Services/DeckService.js";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";
const client = Client.shared;
const deckService = DeckService.shared;
const viewStyles = ["list", "grid"];

export default function MoxfieldDeckDetailView() {
  const navigator = useNavigate();
  const deck = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);

  const [hovered, setHovered] = useState({
    isPreviewCardFromDeck: true,
    id: null,
    faceSide: 0,
  });
  const [viewStyle, setViewStyle] = useState("grid");

  // merge 2 card arrays
  function mergeCards(cards1, cards2) {
    let merged = [];
    cards1.forEach((card1) => {
      let card2 = cards2.find((c) => c.id === card1.id);
      if (card2) {
        card1.quantity += card2.quantity;
        merged.push(card1);
      } else {
        merged.push(card1);
      }
    });
    cards2.forEach((card2) => {
      let card1 = cards1.find((c) => c.id === card2.id);
      if (!card1) {
        merged.push(card2);
      }
    });
    return merged;
  }

  let cards = mergeCards(deck.mainboard, deck.commanders)
    .map((card) => {
      let newCard = card.card;
      newCard.type = MagicHelper.determineCardType(newCard);
      newCard.quantity = card.quantity;
      return newCard;
    })
    .filter((card) => {
      return card !== null;
    });


  const previewId = hovered.id ?? deck.promoId;

  const image = previewId
    ? MagicHelper.getImageUrl(previewId, "normal", hovered.faceSide ?? 0)
    : backside;
  const structure = MagicHelper.getDeckStructureFromCards(cards);

  function setPreviewImage(card, faceSide) {
    setHovered({
      isPreviewCardFromDeck: true,
      id: card.id,
      faceSide: faceSide,
    });
  }

  async function clone() {
    setIsLoading(true);
    const newDeck = await deckService.cloneMoxfieldDeck(deck.id);
    // wait 1 seconds for the deck to be created
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // setIsLoading(true);
    navigator("/decks/my/" + newDeck.id);
  }

  return (
    <div id="magic-deck-view">
      {isLoading && (
        <div className="fullscreenBlurWithLoading">
          <LoadingSpinner />
        </div>
      )}
      <div className="deck-details-header">
        <div>
          <Link to=".." relative="path">
            <button>Back</button>
          </Link>

          <button onClick={clone}>Clone</button>
          <button
            className="play-button"
            onClick={() => {
              window
                .open(
                  "http://127.0.0.1:5502/play3.html?moxFieldId=" +
                    deck.publicId +
                    "&gameId=" +
                    Math.floor(new Date().getTime() / 1000),
                  "_blank"
                )
                .focus();
            }}
          >
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
