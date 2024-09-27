import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import {
  Link,
  LoaderFunction,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import Button from "../components/Button";
import CardPeekView from "../components/CardPeekView";
import Confirmation from "../components/Common/Confirmation";
import Dialog from "../components/Common/Dialog";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import DeckDetailsGridView from "../components/Decks/DeckDetailsGridView";
import DeckDetailsListView from "../components/Decks/DeckDetailsListView";
import MyDeckPrintSelectionOverlay from "../components/Decks/MyDeckPrintSelectionOverlay";
import { Deck, MagicCard } from "../models/dtos";
import Constants from "../Services/Constants";
import DeckService from "../Services/DeckService";
import MagicHelper from "../Services/MagicHelper";
import PlaytestService from "../Services/PlaytestService";
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
  const initialDeck = useLoaderData() as Deck;

  const [hovered, setHovered] = useState<HoveredType>({
    isPreviewCardFromDeck: true,
    scryfallId: null,
    faceSide: 0,
  });
  const [viewStyle, setViewStyle] = useState("grid");

  // edit name / title
  const [editName, setEditName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  async function handleUpdateName() {
    const name = nameInputRef.current?.value;
    if (name && editName) {
      try {
        await DeckService.shared.setName(deck, name);
        setEditName(false);
        await loadDeck();
      } catch (error: Error | any) {
        setError(error.message);
      }
    } else {
      setError("Title is required");
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultCards, setSearchResultCards] = useState([]);
  const [deck, setDeck] = useState(initialDeck);
  const [isLoading, setIsLoading] = useState(false);
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
    ? MagicHelper.getImageUrl(previewId, { faceSide: hovered.faceSide ?? 0 })
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

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const response = await fetch(url);
    const resData = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      console.log("Error loading cards");
      setSearchResultCards([]);
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
    window.open(`/play/${response.id}`, "_blank")?.focus();
  }

  async function toggleLock() {
    await DeckService.shared.toggleLock(deck);
    await loadDeck();
  }

  const showResults = !deck.isLocked && searchResultCards.length > 0;
  return (
    <div id="magic-deck-view" className="h-[400px]">
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
      {editName && (
        <Dialog
          title="Update Deck name"
          submitTitle="Update"
          onClose={() => setEditName(false)}
          onSubmit={handleUpdateName}
          error={error}
        >
          <input
            type="text"
            placeholder="Deck name"
            className="tb-input mb-10"
            defaultValue={initialDeck.name}
            ref={nameInputRef}
          />
        </Dialog>
      )}
      <div className="deck-details-header flex flex-col sm:flex-row justify-center sm:justify-between mb-4">
        <div className="flex gap-2">
          <Link to=".." relative="path">
            <Button title="Back" />
          </Link>
          <Button
            onClick={setShowDeletionConfirmation.bind(null, true)}
            title="Delete"
            disabled={deck.isLocked}
          />
          {Constants.playModeEnabled && (
            <Button onClick={didTapPlay} title="Play" />
          )}
          <Button onClick={toggleLock}>
            {deck.isLocked ? (
              <LockClosedIcon className="h-6 w-6 text-gray-400" />
            ) : (
              <LockOpenIcon className="h-6 w-6 text-gray-400" />
            )}
          </Button>{" "}
        </div>
        <div className="flex gap-4">
          <input
            className="tb-input"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            disabled={deck.isLocked}
          />
          <div className="w-10">{isLoading && <LoadingSpinner inline />}</div>
        </div>
        <div
          className="font-semibold text-lg select-none cursor-pointer"
          onClick={() => !deck.isLocked && setEditName(true)}
        >
          {deck.name}
        </div>

        <div className="flex gap-2">
          {viewStyles.map((s) => (
            <Button
              active={viewStyle === s}
              key={s}
              onClick={() => {
                setViewStyle(s);
              }}
              title={s}
            />
          ))}
        </div>
      </div>
      {showResults && (
        <div
          className={`flex flex-wrap gap-1 border border-black h-[200px] sm:h-[400px] overflow-y-scroll`}
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
                  src={MagicHelper.getImageUrl(card.scryfallId)}
                  alt=" "
                />
              </div>
            );
          })}
        </div>
      )}

      <div id="deck-detail">
        <div className="image-stats hidden sm:block">
          <img className="backside" src={backside} alt=" " />
          <img style={{ zIndex: 1 }} src={image} alt=" " />
          <div>Cards: {deck.cardCount}</div>
          <p>Valid: {DeckService.shared.isValid(deck) ? "yes" : "no"}</p>
          {deck.promoId !== previewId && hovered.isPreviewCardFromDeck && (
            <Button
              onClick={() => {
                setPromoId(previewId);
              }}
              title="Set Promo"
              disabled={deck.isLocked}
            />
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
          <div
            className={`w-full ${
              showResults ? "md:max-h-[55vh]" : "md:max-h-[85vh]"
            }`}
          >
            <DeckDetailsGridView
              structure={structure}
              setPreviewImage={setPreviewImage}
              addToDeck={addToDeck}
              updateCardAmount={updateCardAmount}
              openPrintSelection={showDetailOverlay}
              showCardPreview={showCardPreview}
              moveZone={moveZone}
              isLocked={deck.isLocked}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const loader: LoaderFunction<{ deckId: number }> = async ({
  params,
}) => {
  return await DeckService.shared.get(Number(params.deckId));
};

export default MyDeckDetailView;
