import backside from "../../assets/backside.jpg";
import "./MagicCard.css";

export default function MagicCard({
  card = { name: "Loading...", image: backside },
  src = "https://magic.treibaer.de/image/card/normal/0004311b-646a-4df8-a4b4-9171642e9ef4",
  onTap = () => {},
}) {
  return (
    <div className="magicCard">
      <div className="title">{card.name}</div>
      <img data-src={backside} src={card.image} onClick={onTap} />
    </div>
  );
}
