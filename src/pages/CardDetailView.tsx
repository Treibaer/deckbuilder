import { useState } from "react";
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

const CardDetailView: React.FC<{}> = () => {
  const cardDetails = useLoaderData() as CardDetailWithPrintings;
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToDeck, setShowAddToDeck] = useState(false);

  const card = cardDetails.card;
  const printings = cardDetails.printings;

  async function openAddToCartDialog() {
    setShowAddToDeck(true);
  }

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
      <h1>{card.name}</h1>
      <div className="flex gap-4 justify-between mt-8 w-full">
        <MagicCardView
          key={card.scryfallId}
          card={card}
          size={CardSize.large}
        />
        <div className="flex flex-col gap-4 flex-grow">
          <div>
            <div>{Helper.convertCostsToImgArray(card.manaCost)}</div>
          </div>
          <div>{card.typeLine}</div>
          <div>{card.oracleText}</div>
          {printings && <CardDetailPrintings cardDetails={cardDetails} />}
        </div>
        <div className="flex flex-col gap-2">
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
