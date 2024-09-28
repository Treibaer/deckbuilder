import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ButtonIcon } from "../ButtonIcon";
import { Link } from "react-router-dom";
import MagicHelper from "../../Services/MagicHelper";

const DeckPreview: React.FC<{
  deckId?: number;
  moxfieldId?: string;
  name: string;
  promoId: string;
}> = ({ deckId, moxfieldId, name, promoId }) => {
  const link = deckId
    ? `/decks/my/${deckId}`
    : moxfieldId
    ? `/decks/moxfield/${moxfieldId}`
    : undefined;
  return (
    <div className="flex gap-2 items-center w-full pe-24 select-none">
      {promoId && (
        <img
          src={MagicHelper.artCropUrl(promoId)}
          className="h-12 w-16 object-cover rounded-xl"
        />
      )}
      <div
        title={name}
        className="text-nowrap text-ellipsis overflow-hidden flex-grow"
      >
        {name}
      </div>
      {link && (
        <Link to={link} target="_blank">
          <ButtonIcon>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </ButtonIcon>
        </Link>
      )}
    </div>
  );
};

export default DeckPreview;
