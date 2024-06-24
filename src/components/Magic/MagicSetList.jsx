import { useState } from "react";
import Client from "../../Services/Client";
import "./MagicSetList.css";

const client = Client.shared;

export default function MagicSetList() {
  const [sets, setSets] = useState([]);

  function loadSets() {
    client.loadSets().then((data) => {
      setSets(data);
    });
  }

  if (!sets.length) {
    loadSets();
  }

  function openUrlWithSetCode(setCode) {
    window.open(`/magicSetCardList?setCode=${setCode}`, "_self");
  }

  return (
    <div>
      <h1>Magic Card Sets</h1>
      <div id="set-wrapper">
        {sets.map((set, index) => (
          <div key={index} onClick={() => openUrlWithSetCode(set.code)}>
            <div>{set.name}</div>
            <img src={set.iconSvgUri} />
          </div>
        ))}
      </div>
    </div>
  );
}
