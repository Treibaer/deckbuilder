import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import CardPeekView from "../components/Card/CardPeekView";
import DeckCardGridView from "../components/Deck/DeckCardGridView";
import DeckCardListView from "../components/Deck/DeckCardListView";
import DeckPrintSelectionOverlay from "../components/Deck/DeckPrintSelectionOverlay";
import DeckUpdateDialog from "../components/Deck/DeckUpdateDialog";
import EditButton from "../components/EditButton";
import { Deck, DeckFolder, MagicCard } from "../models/dtos";
import Constants from "../Services/Constants";
import DeckService from "../Services/DeckService";
import MagicHelper from "../Services/MagicHelper";
import PlaytestService from "../Services/PlaytestService";
import Sandbox from "./Sandbox";
import { useSocket } from "../hooks/useSocket";
import { EmitFunction } from "../models/websocket";
import { AnimatePresence } from "framer-motion";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;
const viewStyles = ["list", "grid"];

type HoveredType = {
  isPreviewCardFromDeck: boolean;
  scryfallId: string | null;
  faceSide: number;
};

const CustomDeckDetailPage = () => {
  const initialDeck = useLoaderData() as Deck;

  const [hovered, setHovered] = useState<HoveredType>({
    isPreviewCardFromDeck: true,
    scryfallId: null,
    faceSide: 0,
  });
  const [viewStyle, setViewStyle] = useState("grid");
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [deck, setDeck] = useState(initialDeck);
  const [cardPreview, setCardPreview] = useState<MagicCard | null>(null);
  const [cardDetails, setCardDetails] = useState<MagicCard | null>(null);
  const [folders, setFolders] = useState<DeckFolder[]>([]);

  const event = `update_${deck.id}`;
  let update: EmitFunction = () => {};

  if (Constants.deckLiveUpdatesEnabled) {
    const { listenOn, listenOff, emit } = useSocket();
    update = emit;
    useEffect(() => {
      listenOn("matches", event, (_) => {
        loadDeck();
      });
      return () => {
        listenOff("matches", event);
      };
    }, []);
  }

  async function refresh() {
    await loadDeck();
    if (Constants.deckLiveUpdatesEnabled) {
      update("matches", event, {});
    }
  }

  useEffect(() => {
    if (showSandbox && deck.isLocked) {
      setShowSandbox(false);
    }
  }, [deck.isLocked]);

  useEffect(() => {
    async function loadFolders() {
      const folders = await DeckService.shared.getFolders();
      setFolders(folders);
    }
    loadFolders();
  }, []);

  const previewId = hovered?.scryfallId ?? deck.promoId;
  const image = previewId
    ? MagicHelper.getImageUrl(previewId, { faceSide: hovered.faceSide ?? 0 })
    : backside;

  let cards = deck.mainboard;
  let structure = MagicHelper.getDeckStructureFromCards(cards);
  structure.Commanders = deck.commanders;

  async function loadDeck() {
    const response = await DeckService.shared.get(deck.id);
    setDeck(response);
  }

  async function addToDeck(card: MagicCard, zone: string) {
    await DeckService.shared.addCardToDeck(deck, card.scryfallId, zone);
    await refresh();
  }

  async function updateCardAmount(
    card: MagicCard,
    zone: string,
    amount: number
  ) {
    await DeckService.shared.updateCardAmount(
      deck,
      card.scryfallId,
      zone,
      amount
    );
    await refresh();
    if (hovered.scryfallId === card.scryfallId && amount === 0) {
      setPreviewImage(null, 0);
    }
  }

  async function setPromoId(scryfallId: string) {
    await DeckService.shared.setPromoId(deck, scryfallId);
    await refresh();
  }

  function setPreviewImage(card: MagicCard | null, faceSide: number = 0) {
    setHovered({
      isPreviewCardFromDeck: true,
      scryfallId: card?.scryfallId ?? null,
      faceSide: faceSide,
    });
  }

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
    await refresh();
  }

  async function setPrint(card: MagicCard, print: MagicCard) {
    await DeckService.shared.setPrint(deck, card, print);
    await refresh();
    if (card.scryfallId === hovered?.scryfallId) {
      setPreviewImage(print, 0);
    }
    setCardDetails(print);
  }

  async function didTapPlay() {
    const response = await PlaytestService.shared.create(deck.id);
    window.open(`/playtests/${response.id}`, "_blank")?.focus();
  }

  async function toggleLock() {
    await DeckService.shared.toggleLock(deck);
    await refresh();
  }

  return (
    <div
      className={
        showSandbox
          ? "flex fixed top-0 left-0 w-full h-[calc(100%-80px)] mt-20"
          : undefined
      }
    >
      {showSandbox && (
        <div className="top-0 left-0 py-4 px-2 z-10 w-1/2 h-full overflow-scroll border-r border-r-lightBlue">
          <Sandbox deck={deck} refresh={refresh} />
        </div>
      )}
      <div
        className={showSandbox ? "w-1/2 h-full p-2 overflow-scroll" : "w-full"}
      >
        <AnimatePresence>
          {cardPreview && (
            <CardPeekView
              card={cardPreview}
              onClose={() => setCardPreview(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cardDetails && (
            <DeckPrintSelectionOverlay
              card={cardDetails}
              closeOverlay={setCardDetails.bind(null, null)}
              setPrint={setPrint}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showUpdateDialog && (
            <DeckUpdateDialog
              deck={deck}
              folders={folders}
              onClose={() => setShowUpdateDialog(false)}
              refresh={refresh}
            />
          )}
        </AnimatePresence>
        <div className="deck-details-header flex flex-col sm:flex-row justify-center sm:justify-between mb-4">
          <div className="flex gap-2">
            <Link to=".." relative="path" title="Back">
              <Button>
                <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
              </Button>
            </Link>
            <Button
              title="Sandbox"
              onClick={() => setShowSandbox(!showSandbox)}
              disabled={deck.isLocked}
              className="hidden lg:block"
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
          <div className="flex gap-2">
            <div className="font-semibold text-lg select-none">{deck.name}</div>
            <div className="w-8">
              {!deck.isLocked && (
                <EditButton onClick={() => setShowUpdateDialog(true)} />
              )}
            </div>
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
        <div className="flex gap-4 relative">
          <div
            className={`image-stats hidden flex-shrink-0 ${
              showSandbox ? "2xl:block" : "sm:block"
            }`}
          >
            <img
              className="backside absolute magicCard large"
              src={backside}
              alt=" "
            />
            <img
              className="magicCard large"
              style={{ zIndex: 1 }}
              src={image}
              alt=" "
            />
            <div>Cards: {deck.cardCount}</div>
            <p>Valid: {DeckService.shared.isValid(deck) ? "yes" : "no"}</p>
            {deck.promoId !== previewId &&
              hovered.isPreviewCardFromDeck &&
              !deck.isLocked && (
                <Button
                  onClick={() => {
                    setPromoId(previewId);
                  }}
                  title="Set Promo"
                />
              )}
          </div>

          {cards.length === 0 && <p>No cards in deck</p>}
          {viewStyle === "list" && (
            <DeckCardListView
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
            <div className="w-full md:max-h-[85vh]">
              <DeckCardGridView
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
    </div>
  );
};

export default CustomDeckDetailPage;

export const loader: LoaderFunction<{ deckId: number }> = async ({
  params,
}) => {
  return await DeckService.shared.get(Number(params.deckId));
};
