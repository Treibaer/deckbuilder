import { lazy, useRef, useState } from "react";
import Constants from "../Services/Constants";
import MagicHelper from "../Services/MagicHelper";
import rotateImage from "../assets/rotate.svg";
import LazyImage from "./Common/LazyImage";
import "./MagicCardView.css";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;

export default function MagicCardView({
  card = { name: "Loading...", image: backside, cardFaces: [] },
  onTap = () => {},
  onMouseOver = (faceSide) => {},
  size = "normal",
}) {
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
  const [image, setImage] = useState(MagicHelper.determineImageUrl(card));
  const faceSide = useRef(0);

  function changeFaceSide() {
    faceSide.current = (faceSide.current + 1) % card.cardFaces.length;
    setImage(MagicHelper.determineImageUrl(card, faceSide.current));
    onMouseOver(faceSide.current);
  }

  lazy();

  return (
    <div className={"magicCard " + size}>
      <div
        className={`image-wrapper ${
          faceSide.current % 2 === 1 ? "flipped" : ""
        }`}
      >
        <LazyImage
          src={image}
          title={card.name}
          alt={card.name}
          placeholder={backside}
          onTap={onTap}
          onMouseOver={(card) => {
            onMouseOver(faceSide.current);
          }}
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
  );
}
