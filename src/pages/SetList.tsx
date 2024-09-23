import { Link, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import MagicHelper from "../Services/MagicHelper";
import { CardSet } from "../models/dtos";
const cardService = CardService.shared;

const SetList = () => {
  let sets = useLoaderData() as CardSet[];

  // sort sets by release date
  sets.sort((a, b) => {
    return a.releasedAt > b.releasedAt ? -1 : 1;
  });
  
  return (
    <>
      <h1 className="flex justify-center">Magic Card Sets</h1>
      <div className="flex flex-wrap mt-4 gap-2 justify-center">
        {sets.map((set) => (
          <Link
            to={MagicHelper.createUrlFromFilter({
              set: set.code,
              order: "set",
              colors: [],
            })}
            key={set.scryfallId}
            className="w-48 border border-lightBlue  p-2 rounded-lg bg-mediumBlue text-center flex flex-col hover:bg-lightBlue"
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
    </>
  );
}

export default SetList;

export const loader = async () => {
  return await cardService.getSets();
};
