import { useEffect, useState } from "react";
import { MagicCard } from "../../models/dtos";
import { CardSize } from "../../models/structure";
import Button from "../Button";
import MagicCardView from "../MagicCardView";

const DeckPrintSelectionOverlay: React.FC<{
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
      resData.data[i].scryfallId = resData.data[i].id;
      resData.data[i].oracleId = resData.data[i].oracle_id;
      resData.data[i].printsSearchUri = resData.data[i].prints_search_uri;
    }

    setPrints(resData.data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (card.versions > 1) {
      loadPrints();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  prints.map((print: any) => {
    print.scryfallId = print.id;
    return print;
  });

  return (
    <div className="blurredBackground" onClick={closeOverlay}>
      <div
        className="backdrop-blur-xl bg-transparent w-full sm:w-[calc(100vw-16px)] border border-lightBlue overflow-y-scroll max-h-[calc(100%-32px)] max-w-[500px] sm:max-w-[500px] md:max-w-[1024px] sm:p-2 rounded shadow-lg absolute top-4 left-1/2 transform -translate-x-1/2"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-end absolute right-1 top-1 z-10">
          <Button onClick={closeOverlay} title="X" />
        </div>
        <div className="flex flex-col h-full overflow-y-scroll">
          {isLoading && <div>Loading...</div>}
          {!isLoading && (
            <div className="card-detail-overlay-prints flex flex-wrap gap-2 justify-center mt-2 sm:mx-8">
              {prints.map((print: any) => (
                <div
                  key={print.scryfallId}
                  className={
                    card.scryfallId === print.scryfallId
                      ? "selected"
                      : undefined
                  }
                >
                  <div className="flex justify-between mb-1 items-center">
                    <div
                      className="text-nowrap w-32 overflow-hidden text-ellipsis h-8"
                      title={print.set_name}
                    >
                      {print.set_name}
                    </div>
                    {card.scryfallId !== print.scryfallId && (
                      <Button
                        title="Select"
                        onClick={() => setPrint(card, print)}
                      />
                    )}
                  </div>
                  <MagicCardView card={print} size={CardSize.small} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckPrintSelectionOverlay;
