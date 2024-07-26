import { useRef, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import chevronLeftImage from "../assets/chevron-left.svg";
import deleteImage from "../assets/delete.svg";
import playgameImage from "../assets/playgame.svg";
import Client from "../Services/Client.js";
import Constants from "../Services/Constants.js";
import DeckService from "../Services/DeckService.js";
import MagicHelper from "../Services/MagicHelper.js";
import Confirmation from "../components/Common/Confirmation.jsx";
import CardPeekView from "../components/CardPeekView.jsx";
import DeckDetailsGridView from "../components/Decks/DeckDetailsGridView.jsx";
import DeckDetailsListView from "../components/Decks/DeckDetailsListView.jsx";
import "./MoxfieldDeckDetailView.css";
import MyDeckPrintSelectionOverlay from "../components/Decks/MyDeckPrintSelectionOverlay.jsx";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;
const viewStyles = ["list", "grid"];

export default function MyDeckView() {
  const navigator = useNavigate();
  const data = useLoaderData();

  const [hovered, setHovered] = useState({
    isPreviewCardFromDeck: true,
    scryfallId: null,
    faceSide: 0,
  });
  const [viewStyle, setViewStyle] = useState("grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultCards, setSearchResultCards] = useState([]);
  const [deck, setDeck] = useState(data);
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);

  const [cardPreview, setCardPreview] = useState(false);

  async function loadDeck() {
    const response = await DeckService.shared.loadDeck(deck.id);
    setDeck(response);
  }

  let cards = deck.mainboard
    .map((card) => {
      let newCard = card.card;
      newCard.type = MagicHelper.determineCardType(newCard);
      newCard.quantity = card.quantity;
      return newCard;
    })
    .filter((card) => {
      return card !== null;
    });

  const previewId = hovered?.scryfallId ?? deck.promoId;
  const image = previewId
    ? MagicHelper.getImageUrl(previewId, "normal", hovered?.faceSide ?? 0)
    : backside;

  let structure = MagicHelper.getDeckStructureFromCards(cards);

  structure["Commanders"] = deck.commanders.map((card) => {
    let newCard = card.card;
    newCard.type = MagicHelper.determineCardType(newCard);
    newCard.quantity = card.quantity;
    return newCard;
  });

  let tokens = [];
  cards.forEach((card) => {
    card.all_parts?.forEach((part) => {
      if (part.component === "token") {
        tokens.push(part);
      }
    });
  });
  // filter out with same id
  tokens = tokens.filter(
    (token, index, self) =>
      index === self.findIndex((t) => t.scryfallId === token.scryfallId)
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
    const cards = resData.data.map((card) => {
      card.scryfallId = card.id;
      return card;
    });
    setSearchResultCards(cards);
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

  async function addToDeck(card, zone) {
    await DeckService.shared.addCardToDeck(deck, card, zone);
    await loadDeck();
  }

  async function updateCardAmount(card, zone, amount) {
    await DeckService.shared.updateCardAmount(deck, card, zone, amount);
    await loadDeck();
    if (hovered.scryfallId === card.scryfallId && amount === 0) {
      setPreviewImage(null, 0);
    }
  }

  async function setPromoId(scryfallId) {
    await DeckService.shared.setPromoId(deck, scryfallId);
    await loadDeck();
  }

  function setPreviewImage(card, faceSide) {
    setHovered({
      isPreviewCardFromDeck: true,
      scryfallId: card?.scryfallId,
      faceSide: faceSide,
    });
  }

  const [cardDetails, setCardDetails] = useState(null);

  function showDetailOverlay(card) {
    setCardDetails(card);
  }

  function showCardPreview(card) {
    setCardPreview(card);
  }

  async function moveZone(card, originZone, destinationZone) {
    await DeckService.shared.moveZone(deck, card, originZone, destinationZone);
    await loadDeck();
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
  async function deleteDeck() {
    await DeckService.shared.deleteDeck(deck);
    navigator("/decks/my");
  }

  async function didTapPlay() {
    const path = `/playtests`;
    const data = {
      deckId: deck.id,
    };
    const response = await Client.shared.post(path, JSON.stringify(data));

    window
      .open("/magic-web-js/play3.html?mId=" + response.id, "_blank")
      .focus();
  }

  return (
    <div id="magic-deck-view">
      {cardPreview && (
        <CardPeekView card={cardPreview} onClose={() => setCardPreview(null)} />
      )}

      {showDeletionConfirmation && (
        <div className="fullscreenBlurWithLoading">
          <Confirmation
            onCancel={() => setShowDeletionConfirmation(false)}
            onConfirm={deleteDeck}
          />
        </div>
      )}
      {cardDetails && (
        <MyDeckPrintSelectionOverlay
          card={cardDetails}
          closeOverlay={() => setCardDetails(null)}
          setPrint={setPrint}
        />
      )}
      <div className="deck-details-header">
        <div className="tb-button-group">
          <Link to=".." relative="path">
            <button className="tb-button">
              <img src={chevronLeftImage} className="icon" alt=" " />
              Back
            </button>
          </Link>
          <button
            className="tb-button"
            onClick={() => setShowDeletionConfirmation(true)}
          >
            <img src={deleteImage} className="icon" alt=" " />
            Delete
          </button>
          {Constants.playModeEnabled && (
            <button className="tb-button" onClick={didTapPlay}>
              <img src={playgameImage} className="icon" alt=" " />
              Play
            </button>
          )}
        </div>
        <input type="text" value={searchTerm} onChange={handleChange} />
        <div className="title">{deck.name}</div>

        <div className="tb-button-group">
          {viewStyles.map((s) => (
            <button
              className={viewStyle === s ? "active tb-button" : "tb-button"}
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

      <div>Results</div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px",
          border: "1px solid black",
          height: "100px",
          overflowY: "scroll",
          marginTop: "10px",
          marginBottom: "40px",
        }}
      >
        {searchResultCards.map((card) => {
          return (
            <div key={card.scryfallId}>
              <img
                onMouseEnter={() => {
                  setHovered({
                    isPreviewCardFromDeck: false,
                    id: card.scryfallId,
                    faceSide: 0,
                  });
                }}
                onClick={() => {
                  addToDeck(card);
                }}
                style={{
                  width: "120px",
                  borderRadius: "12px",
                  height: "167px",
                }}
                src={MagicHelper.getImageUrl(card.scryfallId, "normal")}
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
          <div>Cards: {deck.cardCount}</div>
          <div>Worth: {DeckService.shared.calculateWorth(deck)}€</div>
          <p>Valid: {DeckService.shared.isValid(deck) ? "yes" : "no"}</p>
          {deck.promoId !== previewId && hovered.isPreviewCardFromDeck && (
            <button
              className="tb-button"
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
          <DeckDetailsListView
            structure={structure}
            setPreviewImage={setPreviewImage}
            addToDeck={addToDeck}
            updateCardAmount={updateCardAmount}
            openPrintSelection={showDetailOverlay}
            showCardPreview={showCardPreview}
            moveZone={moveZone}
          />
        )}
        {viewStyle === "grid" && (
          <DeckDetailsGridView
            structure={structure}
            setPreviewImage={setPreviewImage}
            addToDeck={addToDeck}
            updateCardAmount={updateCardAmount}
            openPrintSelection={showDetailOverlay}
            showCardPreview={showCardPreview}
            moveZone={moveZone}
          />
        )}
      </div>
    </div>
  );
}

export const loader = async ({ params }) => {
  return await DeckService.shared.loadDeck(params.deckId);
};
