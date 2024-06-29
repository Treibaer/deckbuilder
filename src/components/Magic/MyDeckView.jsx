import { useRef, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import DeckService from "../../Services/DeckService.js";
import MagicHelper from "../../Services/MagicHelper.js";
import DeckGridView from "./DeckViews/DeckGridView.jsx";
import DeckListView from "./DeckViews/DeckListView";
import "./MoxfieldDeckDetailView.css";
import MyDeckViewOverlay from "./MyDeckViewOverlay.jsx";
import MagicCardView from "./MagicCardView.jsx";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";
const viewStyles = ["list", "grid"];

export default function MyDeckView() {
  const data = useLoaderData();

  const [hovered, setHovered] = useState({
    isPreviewCardFromDeck: true,
    id: null,
    faceSide: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultCards, setSearchResultCards] = useState([]);
  const [deck, setDeck] = useState(data);
  const [viewStyle, setViewStyle] = useState("grid");

  async function loadDeck() {
    const response = await DeckService.shared.loadDeck(deck.id);
    setDeck(response);
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
  const image = previewId
    ? MagicHelper.getImageUrl(previewId, "normal", hovered?.faceSide ?? 0)
    : backside;

  let structure = MagicHelper.getDeckStructureFromCards(cards);

  let tokens = []
  cards.forEach((card) => {
    card.all_parts?.forEach((part) => {
      if (part.component === "token") {
        tokens.push(part);
      }
    });
  });
  // filter out with same id
  tokens = tokens.filter((token, index, self) =>
    index === self.findIndex((t) => t.id === token.id)
  );
  // map to compatible format
  tokens.map((token) => {
    token.image = MagicHelper.getImageUrl(token.id);
    return token;
  });

  structure["Tokens"] = tokens;

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

  const searchTimer = useRef();
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
    setHovered({
      isPreviewCardFromDeck: true,
      id: card.id,
      faceSide: faceSide,
    });
  }

  const [cardDetails, setCardDetails] = useState(null);

  function showDetailOverlay(card) {
    setCardDetails(card);
  }

  async function setPrint(card, print) {
    // console.log("setPrint", card, print);
    await DeckService.shared.setPrint(deck, card, print);
    await loadDeck();
    if (card.id === hovered?.id) {
      setPreviewImage(print, 0);
    }
    setCardDetails(print);
    // setCardDetails(null);
  }

  return (
    <div id="magic-deck-view">
      {cardDetails && (
        <MyDeckViewOverlay
          card={cardDetails}
          closeOverlay={() => setCardDetails(null)}
          setPrint={setPrint}
        />
      )}
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
              {s.capitalize()}
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
                  setHovered({
                    isPreviewCardFromDeck: false,
                    id: card.id,
                    faceSide: 0,
                  });
                  // console.log(card);
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
            addToDeck={addToDeck}
            updateCardAmount={updateCardAmount}
            onClick={showDetailOverlay}
          />
        )}
        {viewStyle === "grid" && (
          <DeckGridView
            structure={structure}
            setPreviewImage={setPreviewImage}
            addToDeck={addToDeck}
            updateCardAmount={updateCardAmount}
            openPrintSelection={showDetailOverlay}
          />
        )}
      </div>
    </div>
  );
}

export const loader = async ({ params }) => {
  const response = await DeckService.shared.loadDeck(params.deckId);
  return response;
};
