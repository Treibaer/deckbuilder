import { Link, useLoaderData } from "react-router-dom";
import Client from "../../Services/Client";
import MagicHelper from "../../Services/MagicHelper";
import "./MagicSetList.css";

export default function MagicSetList() {
  const sets = useLoaderData();

  return (
    <div>
      <h1>Magic Card Sets</h1>
      <div id="set-wrapper">
        {sets.map((set, index) => (
          <Link to={MagicHelper.createUrlFromFilter({set: set.code, order: "set"})} key={index}>
            <div>{set.name}</div>
            <img src={set.iconSvgUri} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export const loader = async () => {
  // wait 10 minutes
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await Client.shared.loadSets();
  return response;
};
