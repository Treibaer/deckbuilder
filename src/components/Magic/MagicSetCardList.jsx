import { useEffect, useState } from "react";
import MagicCard from "./MagicCard";
import "./MagicSetCardList.css";
import U from "../../assets/card-symbols/U.svg";
import B from "../../assets/card-symbols/B.svg";
import G from "../../assets/card-symbols/G.svg";
import R from "../../assets/card-symbols/R.svg";
import W from "../../assets/card-symbols/W.svg";
import LoadingSpinner from "./LoadingSpinner";
import symbolMap from "../../assets/symbolmap.js";

export default function MagicSetCardList() {
  let [cards, setCards] = useState([]);
  let [size, setSize] = useState("normal");
  let [style, setStyle] = useState("cards");

  let setCode = "mh3";
//   setCode = "ons";
  let url = `https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${setCode}&unique=prints`;
  //   url = `https://api.scryfall.com/cards/search?q=s%3A${setCode}+color%3D%28B+OR+U%29`
  //   url = "https://api.scryfall.com/cards/search?order=cmc&q=c%3Arg+pow%3D3&page=1"

  function loadCards(term) {
    setCards([]);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let cards = data.data;

        setCards(cards);
      });
  }

  function replaceColorSymbolsByImage(symbol) {
    let image;
    switch (symbol) {
      case "U":
        image = U;
        break;
      case "B":
        image = B;
        break;
      case "G":
        image = G;
        break;
      case "R":
        image = R;
        break;
      case "W":
        image = W;
        break;
      default:
        image = "";
    }
    return <img key={symbol} className="manaSymbol" src={image} />;
  }

  function handleManaSymbolClick() {
    setFilter({ ...filter, u: !filter.u });
  }

  useEffect(() => {
    loadCards("");
  }, []);

  console.log("MagicSetCardList.jsx");

  function mapCosts(costs) {
    let result = [];
    let cost = costs;
    while (cost.length > 0) {
      let index = cost.indexOf("{");
      if (index === -1) {
        result.push(cost);
        break;
      }
      if (index > 0) {
        result.push(cost.substring(0, index));
      }
      let endIndex = cost.indexOf("}");
      result.push(cost.substring(index, endIndex + 1));
      cost = cost.substring(endIndex + 1);
    }
    let out = [];
    for (let i = 0; i < result.length; i++) {
        out.push(<img className="manaSymbol" src={symbolMap[result[i]]} />);
    }
    return out;
  }



  return (
    <>
      <h1>Magic Card Sets</h1>
      {["small", "normal", "large"].map((s) => (
        <button
          className={size === s ? "selected" : ""}
          key={s}
          onClick={() => {
            setSize(s);
          }}
        >
          {s}
        </button>
      ))}
      {/* <img
        className="manaSymbol"
        src={U}
        onClick={() => {
          handleManaSymbolClick("U");
        }} */}
      {/* /> */}
      {/* {style === "list" && (
        <button onClick={() => setStyle("cards")}>Show as cards</button>
      )}
      {style === "cards" && (
        <button onClick={() => setStyle("list")}>Show as list</button>
      )} */}
      {style === "cards" && (
        <div className="card-container">
          {cards.length === 0 && <LoadingSpinner />}
          {style === "cards" &&
            cards.map((card, index) => (
              <MagicCard key={index} card={card} onTap={() => {}} size={size} />
            ))}
        </div>
      )}
      {style === "list" && (
        <div id="card-list-container">
          {cards.map((card, index) => (
            <div key={index}>
              <div>{card.name}</div>
              <div>{card.rarity}</div>
              <div>{mapCosts(card.mana_cost)}</div>
              <div>{card.type_line}</div>
              <div>
                {card.colors.map((color) => replaceColorSymbolsByImage(color))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
