import { useRef, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import chevronLeftImage from "../assets/chevron-left.svg";
import deleteImage from "../assets/delete.svg";
import playgameImage from "../assets/playgame.svg";
import CardPeekView from "../components/CardPeekView";
import Confirmation from "../components/Common/Confirmation";
import DeckDetailsGridView from "../components/Decks/DeckDetailsGridView";
import DeckDetailsListView from "../components/Decks/DeckDetailsListView";
import MyDeckPrintSelectionOverlay from "../components/Decks/MyDeckPrintSelectionOverlay";
import Constants from "../Services/Constants";
import DeckService from "../Services/DeckService";
import MagicHelper from "../Services/MagicHelper";
import PlaytestService from "../Services/PlaytestService";
import { Deck, MagicCard } from "./deck";
import "./MoxfieldDeckDetailView.css";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;
const viewStyles = ["list", "grid"];

type HoveredType = {
  isPreviewCardFromDeck: boolean;
  scryfallId: string | null;
  faceSide: number;
};

const MyDeckDetailView = () => {
  const navigator = useNavigate();
  const data = useLoaderData() as Deck;

  const [hovered, setHovered] = useState<HoveredType>({
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

  const [cardPreview, setCardPreview] = useState<MagicCard | null>(null);

  async function loadDeck() {
    const response = await DeckService.shared.get(deck.id);
    setDeck(response);
  }

  let cards = deck.mainboard;

  const previewId = hovered?.scryfallId ?? deck.promoId;
  const image = previewId
    ? MagicHelper.getImageUrl(previewId, "normal", hovered?.faceSide ?? 0)
    : backside;

  let structure = MagicHelper.getDeckStructureFromCards(cards);

  structure.Commanders = deck.commanders;

  // let tokens: MagicCard[] = [];
  // cards.forEach((card) => {
  //   card.all_parts?.forEach((part) => {
  //     if (part.component === "token") {
  //       tokens.push(part);
  //     }
  //   });
  // });
  // filter out with same id
  // tokens = tokens.filter(
  //   (token, index, self) =>
  //     index === self.findIndex((t) => t.scryfallId === token.scryfallId)
  // );
  // map to compatible format
  // tokens.map((token) => {
  //   token.image = MagicHelper.getImageUrl(token.id);
  //   return token;
  // });

  // structure["Tokens"] = tokens;

  async function loadCards(term: string) {
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
    const cards = resData.data.map((card: any) => {
      card.scryfallId = card.id;
      return card;
    });
    setSearchResultCards(cards);
  }

  const searchTimer = useRef<any>();
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      loadCards(event.target.value);
    }, 500);
  }

  async function addToDeck(card: MagicCard, zone: string) {
    await DeckService.shared.addCardToDeck(deck, card, zone);
    await loadDeck();
  }

  async function updateCardAmount(
    card: MagicCard,
    zone: string,
    amount: number
  ) {
    await DeckService.shared.updateCardAmount(deck, card, zone, amount);
    await loadDeck();
    if (hovered.scryfallId === card.scryfallId && amount === 0) {
      setPreviewImage(null, 0);
    }
  }

  async function setPromoId(scryfallId: string) {
    await DeckService.shared.setPromoId(deck, scryfallId);
    await loadDeck();
  }

  function setPreviewImage(card: MagicCard | null, faceSide: number = 0) {
    setHovered({
      isPreviewCardFromDeck: true,
      scryfallId: card?.scryfallId ?? null,
      faceSide: faceSide,
    });
  }

  const [cardDetails, setCardDetails] = useState<MagicCard | null>(null);

  function showDetailOverlay(card: MagicCard) {
    setCardDetails(card);
  }

  function showCardPreview(card: MagicCard) {
    setCardPreview(card);
  }

  async function moveZone(
    card: MagicCard,
    originZone: string,
    destinationZone: string
  ) {
    await DeckService.shared.moveZone(deck, card, originZone, destinationZone);
    await loadDeck();
  }

  async function setPrint(card: MagicCard, print: MagicCard) {
    await DeckService.shared.setPrint(deck, card, print);
    await loadDeck();
    if (card.scryfallId === hovered?.scryfallId) {
      setPreviewImage(print, 0);
    }
    setCardDetails(print);
  }
  async function deleteDeck() {
    await DeckService.shared.deleteDeck(deck);
    navigator("/decks/my");
  }

  async function didTapPlay() {
    const response = await PlaytestService.shared.create(deck.id);
    window
      .open("/magic-web-js/play.html?mId=" + response.id, "_blank")
      ?.focus();
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
          closeOverlay={setCardDetails.bind(null, null)}
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
            onClick={setShowDeletionConfirmation.bind(null, true)}
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
              {s}
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
        {searchResultCards.map((card: any) => {
          return (
            <div key={card.scryfallId}>
              <img
                onMouseEnter={() => {
                  setHovered({
                    isPreviewCardFromDeck: false,
                    scryfallId: card.scryfallId,
                    faceSide: 0,
                  });
                }}
                onClick={() => {
                  addToDeck(card, "mainboard");
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
};

export const loader = async ({ params }: any) => {
  return await DeckService.shared.get(params.deckId);
};

export default MyDeckDetailView;
