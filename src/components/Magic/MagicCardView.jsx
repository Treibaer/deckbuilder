import { lazy } from "react";
import "./MagicCardView.css";
import LazyImage from "./LazyImage";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";

function determineImageUrl(card) {
  if (card.image_uris) {
    // if is scryfall card
    return card.image_uris.normal;
  } else if (card.image) {
    // if is treibaer card
    return card.image;
  } else {
    return backside;
  }
}

export default function MagicCardView({
  card = { name: "Loading...", image: backside },
  src = "https://magic.treibaer.de/image/card/normal/0004311b-646a-4df8-a4b4-9171642e9ef4",
  onTap = () => {},
  size = "normal",
}) {
  lazy();
  return (
    <div className={"magicCard " + size}>
      {/* <div className="title">{card.name}</div> */}
      <LazyImage
        src={determineImageUrl(card)}
        title={card.name}
        alt={card.name}
        placeholder={backside}
        onTap={onTap}
      />
      {/* <img src2={backside} loading="lazy" src={determineImageUrl(card)} onClick={onTap} /> */}
    </div>
  );
}
