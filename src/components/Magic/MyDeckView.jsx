import { useEffect, useRef, useState } from "react";
import "./MagicDeckView.css";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import Helper from "./Helper.jsx";
import Client from "../../Services/Client.js";
import MagicHelper from "../../Services/MagicHelper.js";
import DeckService from "../../Services/DeckService.js";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";
const client = Client.shared;

export default function MyDeckView({ deckId, children }) {
  //   const [cards, setCards] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultCards, setSearchResultCards] = useState([]);
  const [deck, setDeck] = useState(null);

  const searchTimer = useRef();

  async function loadDeck() {
    const deck = await DeckService.shared.loadDeck(deckId);
    setDeck(deck);
  }

  useEffect(() => {
    loadDeck();
  }, []);

  // load deck data later
  if (!deck) {
    return <LoadingSpinner />;
  }

  let cards = deck.mainboard
    .map((card) => {
      let newCard = card.card;
      newCard.type = MagicHelper.determineCardType(newCard);
      newCard.quantity = card.amount;
      return newCard;
    })
    .filter((card) => {
      return card !== null;
    });

  let image =
    previewImage || cards[0]?.image || cards[0]?.image_uris?.normal || backside;

  let structure = MagicHelper.getDeckStructureFromCards(cards);

  async function loadCards(term) {
    if (term === "") {
      setSearchResultCards([]);
      return;
    }
    let url = `https://api.scryfall.com/cards/search?q=${term}`;

    const response = await fetch(url);
    const resData = await response.json();
    if (!response.ok) {
      console.log("Error loading cards");
      return;
    }
    setSearchResultCards(resData.data);
  }

  function handleChange(event) {
    setSearchTerm(event.target.value);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      loadCards(event.target.value);
    }, 500);
  }

  async function addToDeck(card) {
    await DeckService.shared.addCardToDeck(deck, card);
    await loadDeck();
  }

  async function updateCardAmount(card, amount) {
    await DeckService.shared.updateCardAmount(deck, card, amount);
    await loadDeck();
  }

  async function removeFromDeck(card) {
    await DeckService.shared.removeCardFromDeck(deck, card);
    await loadDeck();
  }

  return (
    <div id="magic-deck-view">
      <div className="deck-details-header">
        <div>{children}</div>
        <button
          className="play-button"
          onClick={() => {
            window
              .open(
                "http://127.0.0.1:5502/play3.html?deckId=" + deck.id + "&gameId=" + Math.floor(new Date().getTime() / 1000),
                "_blank"
              )
              .focus();
          }}
        >
          Play
        </button>
        <input type="text" value={searchTerm} onChange={handleChange} />
        <div className="title">{deck.name}</div>
      </div>
      <div>{deck.publicId}</div>

      <div>Results</div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px",
          border: "1px solid black",
          height: "200px",
          overflowY: "scroll",
          marginTop: "10px",
          marginBottom: "40px",
        }}
      >
        {searchResultCards.map((card) => {
          return (
            <div key={card.id}>
              {/* {card.name} */}
              <img
                onMouseEnter={() => {
                  setPreviewImage(card.image ?? card.image_uris?.normal);
                }}
                onClick={() => {
                  addToDeck(card);
                }}
                style={{
                  width: "120px",
                  borderRadius: "12px",
                  height: "167px",
                }}
                src={card.image_uris?.normal}
                alt=" "
              />
              {/* {card.type_line} */}
            </div>
          );
        })}
      </div>

      <div id="deck-detail">
        <div className="image-stats">
          <img className="backside" src={backside} alt=" " />
          <img style={{ zIndex: 1 }} src={image} alt=" " />
          <div>Cards: {DeckService.shared.cardCount(deck)}</div>
          <div>Worth: {DeckService.shared.calculateWorth(deck)}€</div>
          <p>Valid: {DeckService.shared.isValid(deck) ? "yes" : "no"}</p>
        </div>

        {cards.length === 0 && <p>No cards in deck</p>}
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
                            onMouseEnter={() => {
                              setPreviewImage(
                                card.image ?? card.image_uris?.normal
                              );
                            }}
                          >
                            <div>
                              {card.quantity} x {card.name}
                            </div>
                            <div>
                              {Helper.convertCostsToImgArray(
                                card.manaCost ?? card.mana_cost
                              )}
                              <span className="actions">
                                <span
                                  onClick={() => {
                                    addToDeck(card);
                                  }}
                                >
                                  ➕
                                </span>
                                <span
                                  onClick={() => {
                                    // removeFromDeck(card);
                                    updateCardAmount(card, card.amount - 1);
                                  }}
                                >
                                  ➖
                                </span>
                              </span>
                            </div>
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
