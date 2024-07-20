import { useState } from "react";
import { Link } from "react-router-dom";
import rotateImage from "../assets/rotate.svg";
import MagicHelper from "../Services/MagicHelper";
import "./CardPeekView.css";

export default function CardPeekView({ card, onClose }) {
  const [faceSide, setFaceSide] = useState(0);

  // be compatible with scryfall api
  if (card.card_faces && card.card_faces.length > 0) {
    card.cardFaces = card.card_faces;
  }
  if (!card.cardFaces) {
    card.cardFaces = [];
  }
  if (card.image_uris) {
    card.cardFaces = [];
  }

  function changeFaceSide() {
    setFaceSide((faceSide) => (faceSide + 1) % card.cardFaces.length);
  }

  return (
    <div id="peekCardView">
      <Link to={"/cards/" + card.scryfallId} target="_blank">
        <button className="tb-button">Card details</button>
      </Link>
      <div className="background" onClick={onClose}></div>
      <div className="relative-wrapper">
        <div
          className={`image-wrapper ${faceSide === 0 ? "normal" : "flipped"}`}
        >
          <img
            src={MagicHelper.determineImageUrl(card, faceSide)}
            onClick={onClose}
          />
        </div>
        {card.cardFaces.length > 0 && (
          <img
            src={rotateImage}
            alt="R"
            className="magicCardRotateButton"
            onClick={changeFaceSide}
          />
        )}
      </div>
    </div>
  );
}
