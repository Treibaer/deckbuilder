import { Link, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import MagicHelper from "../Services/MagicHelper";
import "./MagicSetList.css";

const cardService = CardService.shared;

export default function MagicSetList() {
  const sets = useLoaderData();

  return (
    <div>
      <h1>Magic Card Sets</h1>
      <div id="set-wrapper">
        {sets.map((set, index) => (
          <Link
            to={MagicHelper.createUrlFromFilter({
              set: set.code,
              order: "set",
            })}
            key={index}
          >
            <div>{set.name}</div>
            <img src={set.iconSvgUri} />
            <div className="footer">
              <div>{set.releasedAt}</div>
              <div>{set.cardCount}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const loader = async () => {
  return await cardService.getSets();
};
