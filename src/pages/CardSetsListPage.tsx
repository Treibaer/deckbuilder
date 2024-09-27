import { useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import CardSetItem from "../components/CardSetItem";
import { CardSet } from "../models/dtos";
const cardService = CardService.shared;

const CardSetsListPage = () => {
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
          <CardSetItem set={set} key={set.scryfallId} />
        ))}
      </div>
    </>
  );
};

export default CardSetsListPage;

export const loader = async () => {
  return await cardService.getSets();
};
