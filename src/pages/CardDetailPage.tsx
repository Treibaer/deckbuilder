import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import Helper from "../Services/Helper";
import MoxfieldService from "../Services/MoxfieldService";
import Button from "../components/Button";
import AddCardToDeckDialog from "../components/Card/AddCardToDeckDialog";
import CardPrintingsList from "../components/Card/CardPrintingsList";
import FullscreenLoadingSpinner from "../components/Common/FullscreenLoadingSpinner";
import MagicCardView from "../components/MagicCardView";
import { CardDetailWithPrintings } from "../models/dtos";
import { CardSize } from "../models/structure";
import { AnimatePresence } from "framer-motion";

const CardDetailPage: React.FC<{}> = () => {
  const { card, printings } = useLoaderData() as CardDetailWithPrintings;
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToDeck, setShowAddToDeck] = useState(false);
  const [isFavorite, setIsFavorite] = useState(card.isFavorite);

  async function openAddToDeckDialog() {
    setShowAddToDeck(true);
  }

  async function toggleFavorite() {
    setIsFavorite(!isFavorite);
    await MoxfieldService.shared.setFavoriteCard(card.scryfallId, !isFavorite);
  }

  useEffect(() => {
    setIsFavorite(card.isFavorite);
  }, [card]);

  return (
    <>
      {isLoading && <FullscreenLoadingSpinner />}
      <AnimatePresence>
        {showAddToDeck && (
          <AddCardToDeckDialog
            onClose={() => setShowAddToDeck(false)}
            card={card}
            setIsLoading={setIsLoading}
          />
        )}
      </AnimatePresence>
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
          {printings && <CardPrintingsList cardDetails={{ card, printings }} />}
        </div>
        <div className="flex flex-row sm:flex-col gap-2 mb-8">
          <Button onClick={toggleFavorite} className="flex justify-center">
            {isFavorite ? (
              <HeartFilledIcon className="h-6 w-6 text-brightBlue" />
            ) : (
              <HeartIcon className="h-6 w-6 text-brightBlue" />
            )}
          </Button>
          <Button title="Add to deck" onClick={openAddToDeckDialog} />
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

export default CardDetailPage;

export const loader: LoaderFunction<{ cardId: string }> = async ({
  params,
}) => {
  return await CardService.shared.getWithPrintings(params.cardId ?? "");
};
