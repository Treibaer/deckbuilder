import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Client from "../../Services/Client.js";
import MagicHelper from "../../Services/MagicHelper.js";
import DeckGridView from "./DeckViews/DeckGridView.jsx";
import DeckListView from "./DeckViews/DeckListView.jsx";
import "./MoxfieldDeckDetailView.css";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";
const client = Client.shared;
const viewStyles = ["deck", "list", "visualSpoiler"];

export default function MoxfieldDeckDetailView() {
  const [hovered, setHovered] = useState({
    isPreviewCardFromDeck: true,
    id: null,
    faceSide: 0,
  });

  const [viewStyle, setViewStyle] = useState("visualSpoiler");

  const deck = useLoaderData();

  const previewId = hovered.id ?? deck.cards[0]?.id;
  const image = previewId ? MagicHelper.getImageUrl(previewId, "normal", hovered.faceSide ?? 0) : backside;
  // console.log(hovered);
  // console.log(previewId);
  // console.log(deck.cards);

  const structure = MagicHelper.getDeckStructureFromCards(deck.cards);

  const navigate = useNavigate();

  function setPreviewImage(card, faceSide) {
    setHovered({ isPreviewCardFromDeck: true, id: card.id, faceSide: faceSide });
  }

  deck.cards = deck.cards.map((card) => {
    card.isMoxy = true;
    return card;
  });

  return (
    <div id="magic-deck-view">
      <div className="deck-details-header">
        <div>
          <Link to=".." relative="path">
            <button>Back</button>
          </Link>
          <div>
            <button
              onClick={() => {
                navigate(-1);
              }}
            >
              Back2
            </button>
          </div>
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
              {s}
            </button>
          ))}
        </div>
      </div>

      <div id="deck-detail">
        <div className="image-stats">
          <img className="backside" src={backside} alt=" " />
          <img src={image} alt=" " />
        </div>
        {viewStyle === "list" && (
          <DeckListView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}
        {viewStyle === "visualSpoiler" && (
          <DeckGridView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}
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

export const loader = async ({ params }) => {
  const response = await client.getDeck(params.publicId);
  return response;
};
