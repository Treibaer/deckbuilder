import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MagicCardView from "../MagicCardView";
import { MagicCard } from "../../pages/deck";
import { CardSize } from "./structure";

const MyDeckPrintSelectionOverlay: React.FC<{
  closeOverlay: () => void;
  card: any;
  setPrint: (card: MagicCard, print: any) => void;
}> = ({ closeOverlay, card, setPrint }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prints, setPrints] = useState<any>([]);

  async function loadPrints() {
    setIsLoading(true);

    const url = card.printsSearchUri.replace("q=", "q=game:paper+");
    const response = await fetch(url);
    let resData = await response.json();

    if (resData.object === "cors") {
      const url = resData.url;
      const response2 = await fetch(url);
      resData = await response2.json();
    }

    for (let i = 0; i < resData.data.length; i++) {
      resData.data[i].cardFaces = resData.data[i].card_faces ?? [];
    }

    setPrints(resData.data);
    setIsLoading(false);
  }
  useEffect(() => {
    if (card.reprint) {
      loadPrints();
    }
  });

  prints.map((print: any) => {
    print.scryfallId = print.id;
    return print;
  });
  return (
    <div className="fullscreenBlurWithLoading">
      <div className="card-detail-overlay">
        <div className="card-detail-overlay-content">
          <div className="card-detail-overlay-header">
            <button className="tb-button" onClick={closeOverlay}>
              Close
            </button>
            <div className="title">{card.name}</div>
            <Link to={`/cards/${card.scryfallId}`} target="_blank">
              <button className="tb-button">Open Card 🔗</button>
            </Link>
          </div>
          {isLoading && <div>Loading...</div>}
          {!isLoading && (
            <div className="card-detail-overlay-prints">
              {prints.map((print: any) => {
                return (
                  <div
                    key={print.scryfallId}
                    className={
                      card.scryfallId === print.scryfallId
                        ? "selected"
                        : undefined
                    }
                  >
                    <h4 title={print.set_name}>{print.set_name}</h4>
                    <MagicCardView card={print} size={CardSize.small} />
                    {card.scryfallId !== print.scryfallId && (
                      <button
                        className="tb-button"
                        onClick={() => setPrint(card, print)}
                      >
                        Select
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDeckPrintSelectionOverlay;
