import { DeckCard, MagicCard } from "../../models/dtos";
import MagicCardView from "../MagicCardView";
import Button from "../Button";
import { CardSize, DeckStructure } from "../../models/structure";

const DeckDetailsGridView: React.FC<{
  structure: DeckStructure;
  setPreviewImage: (card: MagicCard | null, faceSide?: number) => void;
  addToDeck?: (card: MagicCard, zone: string) => void;
  updateCardAmount?: (card: MagicCard, zone: string, amount: number) => void;
  openPrintSelection?: (card: MagicCard) => void;
  showCardPreview: (card: MagicCard) => void;
  moveZone?: (card: MagicCard, from: string, to: string) => void;
}> = ({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  openPrintSelection,
  showCardPreview,
  moveZone,
}) => {
  function formatTitle(title: string, section: DeckCard[]) {
    const cardAmount = section.reduce((acc, card) => acc + card.quantity, 0);
    if (isNaN(cardAmount) || cardAmount === 0) {
      return title;
    }
    return `${title} (${cardAmount})`;
  }

  const handleAddToDeck = (card: DeckCard, key: string) => {
    const zone = key === "Commanders" ? "commandZone" : "mainboard";
    if (addToDeck) {
      addToDeck(card.card, zone);
    }
  };

  const handleRemoveFromDeck = (card: DeckCard, key: string) => {
    const zone = key === "Commanders" ? "commandZone" : "mainboard";
    if (updateCardAmount) {
      updateCardAmount(card.card, zone, card.quantity - 1);
    }
  };
  const handleMoveZone = (card: MagicCard, key: string) => {
    if (moveZone) {
      const from = key === "Commanders" ? "commandZone" : "mainboard";
      const to = key === "Commanders" ? "mainboard" : "commandZone";
      moveZone(card, from, to);
    }
  };

  const canEdit = addToDeck && updateCardAmount && openPrintSelection;

  return (
    <div className="select-none max-h-[75vh] overflow-y-scroll">
      {Object.keys(structure).map(
        (key, index) =>
          structure[key].length > 0 && (
            <div key={index + 200}>
              {key !== "Hide" && (
                <>
                  <h3>{formatTitle(key, structure[key])}</h3>
                  <div className="flex flex-wrap gap-3">
                    {structure[key].map((card: DeckCard) => (
                      <div className="relative cursor-pointer" key={card.card.scryfallId}>
                        <MagicCardView
                          card={card.card}
                          onTap={() => showCardPreview(card.card)}
                          onMouseOver={(faceSide) => {
                            setPreviewImage(card.card, faceSide);
                          }}
                          size={CardSize.small}
                        />
                        {card.quantity > 1 && (
                          <div className="absolute cursor-default top-6 right-3 bg-mediumBlue py-2 px-3 rounded-md">x{card.quantity}</div>
                        )}

                        {canEdit && (
                          <div className="flex flex-col gap-1 absolute bottom-2 right-2">
                            <Button
                              className="w-10"
                              onClick={() => handleAddToDeck(card, key)}
                              title="+"
                            />
                            <Button
                              className="w-10"
                              title="-"
                              onClick={() => handleRemoveFromDeck(card, key)}
                            />
                            {card.card.reprint && (
                              <Button
                              className="w-10"
                                title="..."
                                onClick={() => openPrintSelection(card.card)}
                              />
                            )}
                            {card.card.typeLine.includes("Legendary") && (
                              <Button
                              className="w-10 h-10"
                                title="C"
                                onClick={() => handleMoveZone(card.card, key)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default DeckDetailsGridView;
