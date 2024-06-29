import { Link, useLoaderData } from "react-router-dom";
import Client from "../../Services/Client";
import "./MagicSetList.css";

export default function MagicSetList() {
  const sets = useLoaderData();

  return (
    <div>
      <h1>Magic Card Sets</h1>
      <div id="set-wrapper">
        {sets.map((set, index) => (
          <Link to={`/sets/${set.code}`} key={index}>
            <div>{set.name}</div>
            <img src={set.iconSvgUri} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export const loader = async () => {
  const response = await Client.shared.loadSets()
  return response;
}
