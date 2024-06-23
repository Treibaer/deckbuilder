import { useState } from "react";
import "./MagicCardSet.css";

export default function MagicCardSet() {
  const [sets, setSets] = useState(null);
  function loadSets() {
    fetch("https://magic.treibaer.de/sets")
      .then((response) => response.json())
      .then((data) => {
        setSets(data.reverse());
        console.log(data);
      });
  }
  if (!sets) {
    loadSets();
  }
  return (
    <div>
      <h1>Magic Card Sets</h1>
      <div id="set-wrapper">
        {sets &&
          sets.map((set, index) => (
            <div key={index}>
                <div>
                {set.name}
                </div>
              <img src={set.iconSvgUri} />
            </div>
          ))}
      </div>
    </div>
  );
}
