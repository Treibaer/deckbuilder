import { useState } from "react";
import Dialog from "./Common/Dialog";
import "./DraftCreateView.css";

export default function DraftCreateView({ closeDialog, onSubmit, sets }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [players, setPlayers] = useState(8);
  const [booster, setBooster] = useState([]);
  const [key, setKey] = useState(Math.floor(Math.random() * 1000000));
  sets.sort((a, b) => a.name.localeCompare(b.name));

  function addBooster() {
    const newValue = booster.length > 0 ? booster[booster.length - 1] : "";
    setBooster([...booster, newValue]);
  }

  function selectBooster(index, value) {
    const newBooster = [...booster];
    newBooster[index] = value;
    setBooster((oldValue) => newBooster);
  }

  function removeBooster(index) {
    const newBooster = [...booster];
    newBooster.splice(index, 1);
    setBooster((oldValue) => newBooster);
    // force re-render
    setKey(Math.floor(Math.random() * 1000000));
  }

  return (
    <Dialog
      title="Create Draft"
      onClose={closeDialog}
      onSubmit={() => {}}
      error={null}
    >
      <label htmlFor="name">Name</label>
      <input type="text" name="name" />
      <label htmlFor="players">Players</label>
      <input
        type="number"
        name="players"
        defaultValue={players}
        onChange={(event) => {
          setPlayers(event.target.value);
        }}
      />
      <div className="draft-content">
        Booster
        <button className="tb-button" onClick={addBooster}>
          Add
        </button>
        <ul key={key}>
          {booster.map((_, index) => (
            <li key={index}>
              <div className="booster-row">
                <select
                  name="booster"
                  defaultValue={booster[index]}
                  onChange={(event) => {
                    selectBooster(index, event.target.value);
                  }}
                >
                  <option value="">Select a set</option>
                  {sets.map((set) => (
                    <option key={set.code} value={set.code}>
                      {set.name}
                    </option>
                  ))}
                </select>
                <button
                  className="tb-button"
                  onClick={() => {
                    removeBooster(index);
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
