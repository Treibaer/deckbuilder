import { useEffect, useState } from "react";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import Helper from "../Services/Helper";
import Button from "../components/Button";
import AddToDeckDialog from "../components/CardDetails/AddToDeckDialog";
import CardDetailPrintings from "../components/CardDetails/CardDetailPrintings";
import FullscreenLoadingSpinner from "../components/Common/FullscreenLoadingSpinner";
import MagicCardView from "../components/MagicCardView";
import { CardDetailWithPrintings } from "../models/dtos";
import { CardSize } from "../models/structure";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/outline";
import MoxfieldService from "../Services/MoxfieldService";

const CardDetailView: React.FC<{}> = () => {
  const cardDetails = useLoaderData() as CardDetailWithPrintings;
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToDeck, setShowAddToDeck] = useState(false);
  const [isFavorite, setIsFavorite] = useState(cardDetails.card.isFavorite);

  const card = cardDetails.card;
  const printings = cardDetails.printings;

  async function openAddToCartDialog() {
    setShowAddToDeck(true);
  }

  async function setAsFavorite() {
    setIsFavorite(!isFavorite);
    await MoxfieldService.shared.setFavoriteCard(card.scryfallId, !isFavorite);
    // card.isFavorite = !card.isFavorite;
  }

  useEffect(() => {
    setIsFavorite(cardDetails.card.isFavorite);
  }, [cardDetails.card]);

  // async function toggleFavorite() {
  //   await moxfieldService.setFavoriteDeck(deck.id, !deck.isFavorite);
  //   // reload deck
  //   const newDeck = await moxfieldService.getDeck("" + deck.id);
  //   setDeck(newDeck);
  // }


  return (
    <>
      {isLoading && <FullscreenLoadingSpinner />}
      {showAddToDeck && (
        <AddToDeckDialog
          onClose={() => setShowAddToDeck(false)}
          card={card}
          setIsLoading={setIsLoading}
        />
      )}
      <div className="text-3xl font-semibold text-center mx-auto md:mx-0 max-w-[350px]">
        {card.name}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-2 w-full">
        <div className="mx-auto">
          <MagicCardView
            key={card.scryfallId}
            card={card}
            size={CardSize.large}
          />
        </div>
        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Helper.convertCostsToImgArray(card.manaCost)}
            </div>
            <div>{card.typeLine}</div>
          </div>
          <div className="border border-lightBlue p-2 rounded-lg">
            {card.oracleText}
          </div>
          {printings && <CardDetailPrintings cardDetails={cardDetails} />}
        </div>
        <div className="flex flex-row sm:flex-col gap-2 mb-8">
          <Button onClick={setAsFavorite} className="flex justify-center">
            {isFavorite ? (
              <HeartIcon className="h-6 w-6 text-brightBlue" />
            ) : (
              <HeartIcon2 className="h-6 w-6 text-brightBlue" />
            )}
          </Button>
          <Button title="Add to deck" onClick={openAddToCartDialog} />
          {card.mapping && (
            <Link to={"/decks/moxfield?id=" + card.mapping}>
              <Button title="Find decks with" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default CardDetailView;

export const loader: LoaderFunction<{ cardId: string }> = async ({
  params,
}) => {
  return await CardService.shared.getWithPrintings(params.cardId ?? "");
};
