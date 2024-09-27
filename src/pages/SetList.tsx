import { useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import { CardSet } from "../models/dtos";
import SetSingleView from "./SetSingleView";
const cardService = CardService.shared;

const SetList = () => {
  let sets = useLoaderData() as CardSet[];

  // sort sets by release date
  sets.sort((a, b) => {
    return a.releasedAt > b.releasedAt ? -1 : 1;
  });

  return (
    <>
      <div className="flex justify-center text-3xl font-semibold m-2">
        Magic Card Sets
      </div>
      <div className="flex flex-wrap mt-4 gap-2 justify-center">
        {sets.map((set) => (
          <SetSingleView set={set} key={set.scryfallId} />
        ))}
      </div>
    </>
  );
};

export default SetList;

export const loader = async () => {
  return await cardService.getSets();
};
