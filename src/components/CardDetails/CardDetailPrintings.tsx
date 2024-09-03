import { useState } from "react";
import { Link } from "react-router-dom";
import { useMousePosition } from "../../hooks/useMousePosition";
import { CardDetailWithPrintings } from "../../models/dtos";

const CardDetailPrintings: React.FC<{
  cardDetails: CardDetailWithPrintings;
}> = ({ cardDetails }) => {
  const mousePosition = useMousePosition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
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
        {cardDetails.printings.map((print: any, index: number) => {
          const isSelected = cardDetails.card.scryfallId === print.scryfallId;
          return (
            <li key={index} className={isSelected ? "selected" : undefined}>
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
  );
};

export default CardDetailPrintings;
