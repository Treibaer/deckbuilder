import { Link, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import MagicHelper from "../Services/MagicHelper";
import "./MagicSetList.css";
import { CardSet } from "../models/dtos";
const cardService = CardService.shared;

const MagicSetList = () => {
  let sets = useLoaderData() as CardSet[];

  // sort sets by release date
  sets.sort((a, b) => {
    return a.releasedAt > b.releasedAt ? -1 : 1;
  });
  
  return (
    <div>
      <h1>Magic Card Sets</h1>
      <div id="set-wrapper">
        {sets.map((set, index) => (
          <Link
            to={MagicHelper.createUrlFromFilter({
              set: set.code,
              order: "set",
              colors: [],
            })}
            key={index}
          >
            <div>{set.name}</div>
            <img src={set.iconSvgUri} alt="" />
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

export default MagicSetList;

export const loader = async () => {
  return await cardService.getSets();
};
