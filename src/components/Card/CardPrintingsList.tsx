import { useState } from "react";
import { Link } from "react-router-dom";
import { useMousePosition } from "../../hooks/useMousePosition";
import { CardDetailWithPrintings } from "../../models/dtos";

const CardPrintingsList: React.FC<{
  cardDetails: CardDetailWithPrintings;
}> = ({ cardDetails }) => {
  const mousePosition = useMousePosition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
    <>
      <div className="text-xl font-semibold">Printings</div>
      {previewImage && mousePosition.x && mousePosition.y && (
        <div
          className="w-[250px] h-[350px] absolute"
          style={{
            top: mousePosition.y + 10,
            left: mousePosition.x + 10,
          }}
        >
          <img src={previewImage} className="rounded-xl" alt="preview" />
        </div>
      )}

      <ul className="max-h-[300px] overflow-y-scroll flex flex-col gap-1">
        {cardDetails.printings.map((print: any, index: number) => {
          const isSelected = cardDetails.card.scryfallId === print.scryfallId;
          return (
            <li key={index} className="">
              {isSelected && (
                <div key={print.id} className="py-2 bg-lightBlue select-none px-2 rounded">
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
                  <div className="py-2 bg-mediumBlue px-2 rounded">
                    <div title={print.setName}>{print.setName}</div>
                  </div>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CardPrintingsList;
