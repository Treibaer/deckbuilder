import { Link } from "react-router-dom";
import { CardSet } from "../models/dtos";
import MagicHelper from "../Services/MagicHelper";

const SetSingleView: React.FC<{ set: CardSet }> = ({ set }) => {
  const query = MagicHelper.createQueryFromFilter({
    set: set.code,
    order: "set",
    colors: [],
  });
  return (
    <Link
      to={`/search?q=${query}`}
      key={set.scryfallId}
      className="w-48 border border-lightBlue  p-2 rounded-lg bg-mediumBlue text-center flex flex-col hover:bg-lightBlue"
    >
      <div className="flex-1">{set.name}</div>
      <img
        className="w-6 h-6 mx-auto my-2 invert"
        src={set.iconSvgUri}
        alt=""
      />
      <div>
        <div>{set.releasedAt}</div>
        <div>{set.cardCount}</div>
      </div>
    </Link>
  );
};

export default SetSingleView;
