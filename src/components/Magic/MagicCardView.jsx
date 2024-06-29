import { lazy, useRef, useState } from "react";
import MagicHelper from "../../Services/MagicHelper";
import LazyImage from "./LazyImage";
import "./MagicCardView.css";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";

export default function MagicCardView({
  card = { name: "Loading...", image: backside, card_faces: []},
  onTap = () => {},
  onMouseOver = (faceSide) => {},
  size = "normal",
}) {
  const [image, setImage] = useState(MagicHelper.determineImageUrl(card));
  const faceSide = useRef(0);

  function changeFaceSide() {
    faceSide.current = (faceSide.current + 1) % card.card_faces.length;
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
      {card.card_faces && (
        <div className="magicCardRotateButton" onClick={changeFaceSide}>
          R
        </div>
      )}
    </div>
  );
}
