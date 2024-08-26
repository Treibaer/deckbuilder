import { useRef, useState } from "react";
import Constants from "../Services/Constants";
import MagicHelper from "../Services/MagicHelper";
import rotateImage from "../assets/rotate.svg";
import { MagicCard } from "../pages/deck";
import LazyImage from "./Common/LazyImage";
import "./MagicCardView.css";
import { CardSize } from "./Decks/structure";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;

const MagicCardView: React.FC<{
  card: MagicCard;
  onTap?: () => void;
  onMouseOver?: (faceSide: number) => void;
  size?: CardSize;
}> = ({
  card,
  onTap = () => {},
  onMouseOver = (faceSide) => {},
  size = "normal",
}) => {
  // be compatible with scryfall api
  const card2: any = card;
  if (card2.card_faces && card2.card_faces.length > 0) {
    card.cardFaces = card2.card_faces;
  }
  if (!card.cardFaces) {
    card.cardFaces = [];
  }
  if (card2.image_uris) {
    card.cardFaces = [];
  }
  const [image, setImage] = useState(MagicHelper.determineImageUrl(card));
  const faceSide = useRef(0);

  function changeFaceSide() {
    faceSide.current = (faceSide.current + 1) % card.cardFaces.length;
    setImage(MagicHelper.determineImageUrl(card, faceSide.current));
    onMouseOver(faceSide.current);
  }

  // lazy();

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
          onMouseOver={() => {
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
};

export default MagicCardView;
