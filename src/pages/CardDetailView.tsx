import { useState } from "react";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import Helper from "../Services/Helper";
import AddToDeckDialog from "../components/CardDetails/AddToDeckDialog";
import CardDetailPrintings from "../components/CardDetails/CardDetailPrintings";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Button from "../components/Decks/Button";
import { CardSize } from "../models/structure";
import MagicCardView from "../components/MagicCardView";
import { CardDetailWithPrintings } from "../models/dtos";
import "./CardDetailView.css";

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
      {isLoading && <LoadingSpinner />}
      {showAddToDeck && (
        <AddToDeckDialog
          onClose={() => setShowAddToDeck(false)}
          card={card}
          setIsLoading={setIsLoading}
        />
      )}
      <h1> {card.name}</h1>
      <div className="card-content">
        <MagicCardView card={card} size={CardSize.large} />
        <div className="card-details">
          <div className="card-headline">
            <div>{Helper.convertCostsToImgArray(card.manaCost)}</div>
          </div>
          <div>{card.typeLine}</div>
          <div>{card.oracleText}</div>
          {printings && <CardDetailPrintings cardDetails={cardDetails} />}
        </div>
        <div className="actionButtons">
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

export const loader: LoaderFunction<{ cardId: string }> = async ({
  params,
}) => {
  return await CardService.shared.getWithPrintings(params.cardId ?? "");
};

export default CardDetailView;
