import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import Helper from "../Services/Helper";
import AddToDeckDialog from "../components/CardDetails/AddToDeckDialog";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MagicCardView from "../components/MagicCardView";
import { useMousePosition } from "../hooks/useMousePosition";
import "./CardDetailView.css";

const CardDetailView: React.FC<{}> = () => {
  const mousePosition = useMousePosition();
  const cardDetails = useLoaderData() as any;
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const card = cardDetails?.card;
  const printings = cardDetails?.printings ?? [];

  const [showAddToDeck, setShowAddToDeck] = useState(false);

  async function openAddToCartDialog() {
    setShowAddToDeck(true);
  }

  function close() {
    setShowAddToDeck(false);
  }

  return (
    <div key={card?.scryfallId}>
      {isLoading && <LoadingSpinner />}
      {showAddToDeck && (
        <AddToDeckDialog
          onClose={close}
          card={card}
          setIsLoading={setIsLoading}
        />
      )}
      <h1> {card.name}</h1>
      {card && (
        <div className="card-content">
          <MagicCardView card={card} size="large" />
          <div className="card-details">
            <div className="card-headline">
              <div>
                {Helper.convertCostsToImgArray(card.manaCost ?? card.mana_cost)}
              </div>
            </div>
            <div>{card.typeLine}</div>
            <div>{card.oracleText}</div>
            {printings && (
              <>
                <h2>Printings</h2>
                {previewImage && mousePosition.x && mousePosition.y && (
                  <div
                    className="printingsPreview"
                    style={{
                      position: "absolute",
                      top: mousePosition.y + 10,
                      left: mousePosition.x + 10,
                    }}
                  >
                    <img src={previewImage} alt="preview" />
                  </div>
                )}
                <ul className="printings">
                  {printings.map((print: any, index: number) => {
                    const isSelected = card.scryfallId === print.scryfallId;
                    return (
                      <li
                        key={index}
                        className={isSelected ? "selected" : undefined}
                      >
                        {isSelected && (
                          <div key={print.id} className="print">
                            <div title={print.setName}>{print.setName}</div>
                          </div>
                        )}
                        {!isSelected && (
                          <Link
                            to={`/cards/${print.scryfallId}`}
                            key={print.scryfallId}
                            onMouseEnter={() => setPreviewImage(print.image)}
                            onMouseLeave={() => setPreviewImage(null)}
                            onClick={() => setPreviewImage(null)}
                          >
                            <div className="print">
                              <div title={print.setName}>{print.setName}</div>
                            </div>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
          <div>
            <div className="actionButtons">
              <button className="tb-button" onClick={openAddToCartDialog}>
                Add to deck
              </button>
              <button className="tb-button">Save for later</button>
              {card.mapping && (
                <Link to={"/decks/moxfield?id=" + card.mapping}>
                  <button className="tb-button">Find decks with</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const loader: any = async ({ params }: { params: any }) => {
  return await CardService.shared.getCardById(params.cardId);
};

export default CardDetailView;
