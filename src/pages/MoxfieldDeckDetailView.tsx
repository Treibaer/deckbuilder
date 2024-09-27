import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Constants from "../Services/Constants";
import MagicHelper from "../Services/MagicHelper";
import MoxfieldService from "../Services/MoxfieldService";
import PlaytestService from "../Services/PlaytestService";
import Button from "../components/Button";
import CardPeekView from "../components/CardPeekView";
import FullscreenLoadingSpinner from "../components/Common/FullscreenLoadingSpinner";
import DeckDetailsGridView from "../components/Decks/DeckDetailsGridView";
import DeckDetailsListView from "../components/Decks/DeckDetailsListView";
import { Deck, MagicCard } from "../models/dtos";
import "./MoxfieldDeckDetailView.css";

const backside = `${Constants.backendUrl}/image/card/backside.jpg`;
const moxfieldService = MoxfieldService.shared;
const viewStyles = ["list", "grid"];

type HoveredType = {
  isPreviewCardFromDeck: boolean;
  scryfallId: string | null;
  faceSide: number;
};

const MoxfieldDeckDetailView = () => {
  const navigator = useNavigate();
  const data = useLoaderData() as Deck;
  const [deck, setDeck] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const [cardPreview, setCardPreview] = useState<MagicCard | null>(null);
  const [hovered, setHovered] = useState<HoveredType>({
    isPreviewCardFromDeck: true,
    scryfallId: null,
    faceSide: 0,
  });
  const [viewStyle, setViewStyle] = useState("grid");

  const previewId = hovered.scryfallId ?? deck.promoId;

  const image = previewId
    ? MagicHelper.getImageUrl(previewId, { faceSide: hovered.faceSide ?? 0 })
    : backside;
  const structure = MagicHelper.getDeckStructureFromCards(deck.mainboard);

  structure.Commanders = deck.commanders;

  function setPreviewImage(card: MagicCard | null, faceSide: number = 0) {
    setHovered({
      isPreviewCardFromDeck: true,
      scryfallId: card?.scryfallId ?? null,
      faceSide: faceSide,
    });
  }

  async function clone() {
    setIsLoading(true);
    const newDeck = await moxfieldService.clone("" + deck.id);
    // wait 1 seconds for the deck to be created, otherwise, it's too fast and you don't see that a deck is created
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigator("/decks/my/" + newDeck.id);
  }

  function showCardPreview(card: MagicCard) {
    setCardPreview(card);
  }

  async function didTapPlay() {
    // TODO: deck.id is string instead of number for moxfield decks
    const response = await PlaytestService.shared.createFromMoxfieldDeck(
      deck.id
    );
    window.open(`/play/${response.id}`, "_blank")?.focus();
  }

  async function toggleFavorite() {
    await moxfieldService.setFavoriteDeck(deck.id, !deck.isFavorite);
    // reload deck
    const newDeck = await moxfieldService.getDeck("" + deck.id);
    setDeck(newDeck);
  }

  return (
    <div id="magic-deck-view">
      {isLoading && <FullscreenLoadingSpinner />}

      {cardPreview && (
        <CardPeekView
          card={cardPreview}
          onClose={setCardPreview.bind(null, null)}
        />
      )}
      <div className="deck-details-header flex flex-col sm:flex-row justify-center sm:justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Button
            title="Back"
            onClick={() => {
              navigator(-1);
            }}
          />
          <Button onClick={clone} title="Clone" />
          {Constants.playModeEnabled && (
            <Button title="Play" onClick={didTapPlay} />
          )}
          <Button onClick={toggleFavorite}>
            {deck.isFavorite ? (
              <HeartIcon className="h-6 w-6 text-brightBlue" />
            ) : (
              <HeartIcon2 className="h-6 w-6 text-brightBlue" />
            )}
          </Button>
        </div>
        <h2>{deck.name}</h2>
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

      <div id="deck-detail">
        <div className="image-stats hidden sm:block">
          <img className="backside" src={backside} alt=" " />
          <img src={image} alt=" " />
          <div>Cards: {deck.cardCount}</div>
        </div>
        {viewStyle === "list" && (
          <DeckDetailsListView
            structure={structure}
            setPreviewImage={setPreviewImage}
          />
        )}
        {viewStyle === "grid" && (
          <div className={`w-full md:max-h-[85vh]`}>
            <DeckDetailsGridView
              structure={structure}
              setPreviewImage={setPreviewImage}
              showCardPreview={showCardPreview}
              isLocked={deck.isLocked}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MoxfieldDeckDetailView;

export const loader = async ({ params }: any) => {
  return await moxfieldService.getDeck(params.publicId);
};
