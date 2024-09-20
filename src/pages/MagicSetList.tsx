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
    <div >
      <h1>Magic Card Sets</h1>
      <div className="flex flex-wrap mt-4">
        {sets.map((set, index) => (
          <Link
            to={MagicHelper.createUrlFromFilter({
              set: set.code,
              order: "set",
              colors: [],
            })}
            key={index}
            className="w-48 border border-lightBlue m-2 p-2 rounded-lg bg-mediumBlue text-center flex flex-col hover:bg-lightBlue"
          >
            <div className="flex-1">{set.name}</div>
            <img className="w-6 h-6 mx-auto my-2 invert" src={set.iconSvgUri} alt="" />
            <div>
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
