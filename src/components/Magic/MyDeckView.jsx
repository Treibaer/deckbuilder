import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeckService from "../../Services/DeckService.js";
import MagicHelper from "../../Services/MagicHelper.js";
import LoadingSpinner from "../Common/LoadingSpinner.jsx";
import DeckGridView from "./DeckViews/DeckGridView.jsx";
import DeckListView from "./DeckViews/DeckListView";
import Helper from "./Helper.jsx";
import "./MoxfieldDeckDetailView.css";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";
const viewStyles = ["deck", "list", "visualSpoiler"];

export default function MyDeckView() {
  const [hovered, setHovered] = useState({
    isPreviewCardFromDeck: true,
    id: null,
    faceSide: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultCards, setSearchResultCards] = useState([]);
  const [deck, setDeck] = useState(null);
  const [viewStyle, setViewStyle] = useState("visualSpoiler");

  // get deck id from url
  const params = useParams();
  const deckId = params.deckId;

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

  const previewId = hovered?.id ?? deck.promoId;
  const image = previewId ? MagicHelper.getImageUrl(previewId, "normal", hovered?.faceSide ?? 0) : backside;

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

  async function setPromoId(scryfallId) {
    deck.promoId = scryfallId;
    await DeckService.shared.createDeck(deck);
    await loadDeck();
  }

  async function removeFromDeck(card) {
    await DeckService.shared.removeCardFromDeck(deck, card);
    await loadDeck();
  }

  function setPreviewImage(card, faceSide) {
    setHovered({ isPreviewCardFromDeck: true, id: card.id, faceSide: faceSide });
  }

  return (
    <div id="magic-deck-view">
      <div className="deck-details-header">
        <Link to=".." relative="path">
          <button>Back</button>
        </Link>
        <button
          className="play-button"
          onClick={() => {
            window
              .open(
                "http://127.0.0.1:5502/play3.html?deckId=" +
                  deck.id +
                  "&gameId=" +
                  Math.floor(new Date().getTime() / 1000),
                "_blank"
              )
              .focus();
          }}
        >
          Play
        </button>
        <input type="text" value={searchTerm} onChange={handleChange} />
        <div className="title">{deck.name}</div>

        <div>
          {viewStyles.map((s) => (
            <button
              className={viewStyle === s ? "selected" : ""}
              key={s}
              onClick={() => {
                setViewStyle(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
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
              <img
                onMouseEnter={() => {
                  setHovered({ isPreviewCardFromDeck: false, id: card.id, faceSide: 0 });
                  console.log(card);
                }}
                onClick={() => {
                  addToDeck(card);
                }}
                style={{
                  width: "120px",
                  borderRadius: "12px",
                  height: "167px",
                }}
                src={MagicHelper.getImageUrl(card.id, "normal")}
                alt=" "
              />
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
          {deck.promoId !== previewId && hovered.isPreviewCardFromDeck && (
            <button
              onClick={() => {
                setPromoId(previewId);
              }}
            >
              Set Promo
            </button>
          )}
        </div>

        {cards.length === 0 && <p>No cards in deck</p>}
        {viewStyle === "list" && (
          <DeckListView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}
        {viewStyle === "visualSpoiler" && (
          <DeckGridView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}

        {false && (
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
                                setHovered({
                                  isPreviewCardFromDeck: true,
                                  id: card.id,
                                  faceSide: 0,
                                });
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
        )}
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
