import { useEffect, useState } from "react";
import "./MagicDeckView.css";
import symbolMap from "../../assets/symbolmap.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";

function addStructureToDeck(cards) {
  // filter out lands
  let commanders = cards.filter((card) => card.isCommander);
  cards = cards.filter((card) => !card.isCommander);
  let lands = cards.filter((card) => card.type.includes("Land"));
  // sort by type
  let creatures = cards.filter((card) => card.type.includes("Creature"));
  let sorceries = cards.filter((card) => card.type.includes("Sorcery"));
  let instants = cards.filter((card) => card.type.includes("Instant"));
  let artifacts = cards.filter((card) => card.type.includes("Artifact"));
  let enchantments = cards.filter((card) => card.type.includes("Enchantment"));
  let planeswalkers = cards.filter((card) =>
    card.type.includes("Planeswalker")
  );
  // filter out remaining cards

  let remaingCards = cards.filter(
    (card) =>
      !card.type.includes("Land") &&
      !card.type.includes("Creature") &&
      !card.type.includes("Sorcery") &&
      !card.type.includes("Instant") &&
      !card.type.includes("Artifact") &&
      !card.type.includes("Enchantment") &&
      !card.type.includes("Planeswalker")
  );

  return {
    Commanders: commanders,
    Hide: commanders,
    Lands: lands,
    Creatures: creatures,
    Sorceries: sorceries,
    Instants: instants,
    Artifacts: artifacts,
    Enchantments: enchantments,
    Planeswalkers: planeswalkers,
    // "": remaingCards,
  };
}

function mapCosts(costs) {
  if (!costs) {
    return [];
  }
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
    out.push(<img key={i} className="manaSymbol" src={symbolMap[result[i]]} />);
  }
  return out;
}

export default function MagicDeckView({ deck, children }) {
  const [cards, setCards] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    fetch(`https://magic.treibaer.de/decks/${deck.publicId}`)
      .then((response) => response.json())
      .then((data) => {
        let index = 1;
        let cards = [];

        for (let card of Object.values(data.commanders)) {
          cards.push({
            id: index,
            isCommander: true,
            name: card.card.name,
            quantity: card.quantity,
            type: card.card.type_line,
            colors: card.card.colors,
            manaCost: card.card.mana_cost,
            image:
              "https://magic.treibaer.de/image/card/normal/" +
              card.card.scryfall_id,
          });
          index++;
        }

        for (let card of Object.values(data.mainboard)) {
          cards.push({
            id: index,
            isCommander: false,
            name: card.card.name,
            quantity: card.quantity,
            type: card.card.type_line,
            colors: card.card.colors,
            manaCost: card.card.mana_cost,
            image:
              "https://magic.treibaer.de/image/card/normal/" +
              card.card.scryfall_id,
          });
          index++;
        }
        setCards(cards);
      });
  }, []);

  let image = previewImage || cards[0]?.image || backside;

  let structure = addStructureToDeck(cards);

  return (
    <div>
      <div className="deck-details-header">
        <div>
          {children}
          <button className="play-button"
            onClick={() => {
              window
                .open(
                  "http://127.0.0.1:5502/play3.html?deck=" + deck.publicId,
                  "_blank"
                )
                .focus();
            }}
          >
            Play
          </button>
        </div>
        <h1>{deck.name}</h1>
      </div>
      <div id="deck-detail">
        <img src={image} alt={deck.name} />

        {cards.length === 0 && <LoadingSpinner />}
        <div className="stacked">
          {Object.keys(structure).map((key, index) => {
            return (
              structure[key].length > 0 && (
                <div key={index + 200}>
                  {key !== "Hide" && (
                    <>
                      <h3>{key}</h3>
                      <div className="deck-details-list">
                        {structure[key].map((card, index2) => (
                          <div
                            key={index2}
                            onMouseOver={() => {
                              setPreviewImage(card.image);
                            }}
                          >
                            <div>
                              {card.quantity} x {card.name}
                            </div>
                            <div>{mapCosts(card.manaCost)}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            );
          })}
        </div>
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
