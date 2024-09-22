import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Deck } from "../../models/dtos";
import MagicHelper from "../../Services/MagicHelper";
import { ButtonIcon } from "../ButtonIcon";

const SelectDeckDialogDeckPreview: React.FC<{
  deck: Deck;
  type: "myDeck" | "moxfield" | "favorites";
}> = ({ deck, type }) => {
  const link =
    type !== "myDeck"
      ? `/decks/moxfield/${deck.id}`
      : `/decks/my/${deck.id}`;
  return (
    <div className="flex gap-2 items-center justify-between w-full pe-24">
      <img
        src={MagicHelper.artCropUrl(deck.promoId)}
        className="h-12 rounded-xl"
      />
      <div
        title={deck.name}
        className="text-nowrap text-ellipsis overflow-hidden flex-grow"
      >
        {deck.name}
      </div>
      <Link to={link} target="_blank">
        <ButtonIcon>
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </ButtonIcon>
      </Link>
    </div>
  );
};

export default SelectDeckDialogDeckPreview;
