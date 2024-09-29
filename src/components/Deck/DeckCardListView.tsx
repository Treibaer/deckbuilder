import { DeckCard, MagicCard } from "../../models/dtos";
import { DeckStructure } from "../../models/structure";
import Button from "../Button";

const DeckCardListView: React.FC<{
  structure: DeckStructure;
  setPreviewImage: (card: MagicCard, faceSide?: number) => void;
  addToDeck?: (card: MagicCard, zone: string) => void;
  updateCardAmount?: (card: MagicCard, zone: string, amount: number) => void;
  showCardPreview?: (card: MagicCard) => void;
  openPrintSelection?: (card: MagicCard) => void;
  moveZone?: (card: MagicCard, from: string, to: string) => void;
}> = ({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  showCardPreview,
  openPrintSelection,
  moveZone,
}) => {
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
    <div className="flex flex-wrap gap-2 select-none">
      {Object.keys(structure).map((key, index) => {
        return (
          structure[key].length > 0 && (
            <div
              key={index + 200}
              className="flex flex-col gap-1 sm:w-[48%] mx-auto w-full"
            >
              {key !== "Hide" && (
                <>
                  <div className="text-lg font-semibold text-gray-300">{key}</div>
                  <div className="flex flex-col gap-1 ">
                    {structure[key].map((card: DeckCard) => (
                      <div
                        key={card.card.scryfallId}
                        onMouseOver={() => {
                          setPreviewImage(card.card);
                        }}
                        className="flex justify-between"
                      >
                        <div
                          onClick={() =>
                            showCardPreview && showCardPreview(card.card)
                          }
                        >
                          {card.quantity} x {card.card.name}
                        </div>
                        <div>
                          {/* {Helper.convertCostsToImgArray(
                            card.card.manaCost ?? card.card.mana_cost
                          )} */}
                          {canEdit && (
                            <div className="flex gap-1">
                              <Button
                                className="w-10"
                                onClick={() => {
                                  handleAddToDeck(card, key);
                                }}
                                title="+"
                              />
                              <Button
                                className="w-10"
                                onClick={() => handleRemoveFromDeck(card, key)}
                                title="-"
                              />
                              {card.card.versions > 1 && (
                                <Button
                                  className="w-10"
                                  onClick={() => openPrintSelection(card.card)}
                                  title="..."
                                />
                              )}
                              {card.card.typeLine.includes("Legendary") &&
                                moveZone && (
                                  <Button
                                    className="w-10"
                                    onClick={() => {
                                      handleMoveZone(card.card, key);
                                    }}
                                    title="C"
                                  />
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        );
      })}
    </div>
  );
};

export default DeckCardListView;
