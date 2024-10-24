import { DeckCard, MagicCard } from "../../models/dtos";
import { CardSize, DeckStructure } from "../../models/structure";
import Button from "../Button";
import MagicCardView from "../MagicCardView";
import { motion } from "framer-motion";

const DeckCardGridView: React.FC<{
  structure: DeckStructure;
  setPreviewImage: (card: MagicCard | null, faceSide?: number) => void;
  addToDeck?: (card: MagicCard, zone: string) => void;
  updateCardAmount?: (card: MagicCard, zone: string, amount: number) => void;
  openPrintSelection?: (card: MagicCard) => void;
  showCardPreview: (card: MagicCard) => void;
  moveZone?: (card: MagicCard, from: string, to: string) => void;
  isLocked: boolean;
}> = ({
  structure,
  setPreviewImage,
  addToDeck,
  updateCardAmount,
  openPrintSelection,
  showCardPreview,
  moveZone,
  isLocked,
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

  const canEdit =
    addToDeck && updateCardAmount && openPrintSelection && !isLocked;

  return (
    <div className="select-none overflow-y-scroll h-full w-full flex flex-col gap-2">
      {Object.keys(structure).map(
        (key, index) =>
          structure[key].length > 0 && (
            <div key={index + 200}>
              {key !== "Hide" && (
                <>
                  <div className="text-lg font-semibold text-gray-300">
                    {formatTitle(key, structure[key])}
                  </div>
                  <div className="flex flex-wrap gap-1 w-full">
                    {structure[key].map((card: DeckCard) => (
                      <div
                        className="relative cursor-pointer"
                        key={card.card.scryfallId}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: 0, duration: 0.3 }}
                        >
                          <MagicCardView
                            card={card.card}
                            onTap={() => showCardPreview(card.card)}
                            onMouseOver={(faceSide) => {
                              setPreviewImage(card.card, faceSide);
                            }}
                            size={CardSize.small}
                          />
                        </motion.div>
                        {card.quantity > 1 && (
                          <div className="absolute cursor-default top-6 right-3 bg-mediumBlue py-2 px-3 rounded-md">
                            x{card.quantity}
                          </div>
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
                            {card.card.versions > 1 && (
                              <Button
                                className="w-10"
                                title="P"
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

export default DeckCardGridView;
