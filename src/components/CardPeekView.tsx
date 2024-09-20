import { useState } from "react";
import { Link } from "react-router-dom";
import rotateImage from "../assets/rotate.svg";
import MagicHelper from "../Services/MagicHelper";
import "./CardPeekView.css";
import { MagicCard } from "../models/dtos";
import Button from "./Button";

const CardPeekView: React.FC<{
  card: MagicCard;
  onClose: () => void;
}> = ({ card, onClose }) => {
  const [faceSide, setFaceSide] = useState(0);

  const card2: any = card;
  // be compatible with scryfall api
  if (card2.card_faces && card2.card_faces.length > 0) {
    card.cardFaces = card2.card_faces;
  }
  if (!card.cardFaces) {
    card.cardFaces = [];
  }
  if (card2.image_uris) {
    card.cardFaces = [];
  }

  function changeFaceSide() {
    setFaceSide((faceSide) => (faceSide + 1) % card.cardFaces.length);
  }

  return (
    <div id="peekCardView">
      <Link to={"/cards/" + card.scryfallId} target="_blank">
        <Button title="Card details" />
      </Link>
      <div className="background" onClick={onClose}></div>
      <div className="relative-wrapper">
        <div
          className={`image-wrapper ${faceSide === 0 ? "normal" : "flipped"}`}
        >
          <img
            src={MagicHelper.determineImageUrl(card, faceSide)}
            onClick={onClose}
            alt={card.name}
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
};

export default CardPeekView;
