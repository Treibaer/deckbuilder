import { lazy, useRef, useState } from "react";
import "./MagicCardView.css";
import LazyImage from "./LazyImage";
import MagicHelper from "../../Services/MagicHelper";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";

export default function MagicCardView({
  card = { name: "Loading...", image: backside },
  onTap = () => {},
  onMouseOver = (faceSide) => {},
  size = "normal",
}) {
  const [image, setImage] = useState(MagicHelper.determineImageUrl(card));
  const faceSide = useRef(0);

  function changeFaceSide() {
    faceSide.current = (faceSide.current + 1) % card.card_faces.length;
    setImage(MagicHelper.determineImageUrl(card, faceSide.current));
    onMouseOver(faceSide.current)
  }

  lazy();

  return (
    <div className={"magicCard " + size}>
      {/* <div className="title">{card.name}</div> */}
      <div className={`image-wrapper ${faceSide.current % 2 === 1 ? "flipped" : ""}`}>
        <LazyImage
          src={image}
          title={card.name}
          alt={card.name}
          placeholder={backside}
          onTap={onTap}
          onMouseOver={(card) => {onMouseOver(faceSide.current)}}
          // onFlip={onFlip}
        />
      </div>
      {card.card_faces && (
        <div className="magicCardRotateButton" onClick={changeFaceSide}>
          R
        </div>
      )}
      {/* <img src2={backside} loading="lazy" src={determineImageUrl(card)} onClick={onTap} /> */}
    </div>
  );
}
