import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import CardService from "../Services/CardService";
import CardSetItem from "../components/CardSetItem";
import { CardSet } from "../models/dtos";
import Select from "../components/Select";
import { Helmet } from "react-helmet-async";
const cardService = CardService.shared;

const CardSetsListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setType = searchParams.get("setType") ?? "default";
  let sets = useLoaderData() as CardSet[];

  function switchSetType(setType: string) {
    let url = `?setType=${setType}`;
    navigate(url);
  }

  return (
    <>
      <Helmet title="Magic Card Sets" />
      <div className="flex justify-center gap-5 m-2">
        <div className="text-3xl font-semibold items-center">
          Magic Card Sets
        </div>
        <div>
          <Select
            defaultValue={setType}
            onChange={(event) => {
              switchSetType(event.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="default">Default</option>
            <option value="core">Core</option>
            <option value="expansion">Expansion</option>
            <option value="commander">Commander</option>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap mt-4 gap-2 justify-center">
        {sets.map((set) => (
          <CardSetItem set={set} key={set.code} />
        ))}
      </div>
    </>
  );
};

export default CardSetsListPage;

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  let setType = queryParameters.get("setType") ?? "default";

  return await cardService.getSets(setType);
};
