import { useState } from "react";
import Dialog from "./Common/Dialog";
import "./DraftCreateView.css";

const DraftCreateView: React.FC<{
  closeDialog: () => void;
  sets: any[];
}> = ({ closeDialog, sets }) => {
  const [players, setPlayers] = useState(8);
  const [booster, setBooster] = useState<any>([]);
  const [key, setKey] = useState(Math.floor(Math.random() * 1000000));
  sets.sort((a, b) => a.name.localeCompare(b.name));

  function addBooster() {
    const newValue = booster.length > 0 ? booster[booster.length - 1] : "";
    setBooster([...booster, newValue]);
  }

  function selectBooster(index: number, value: any) {
    const newBooster: any = [...booster];
    newBooster[index] = value;
    setBooster((oldValue: any) => newBooster);
  }

  function removeBooster(index: number) {
    const newBooster = [...booster];
    newBooster.splice(index, 1);
    setBooster((oldValue: any) => newBooster);
    // force re-render
    setKey(Math.floor(Math.random() * 1000000));
  }

  return (
    <Dialog
      title="Create Draft"
      onClose={closeDialog}
      onSubmit={() => {}}
    >
      <label htmlFor="name">Name</label>
      <input type="text" name="name" />
      <label htmlFor="players">Players</label>
      <input
        type="number"
        name="players"
        defaultValue={players}
        onChange={(event) => {
          setPlayers(parseInt(event.target.value));
        }}
      />
      <div className="draft-content">
        Booster
        <button className="tb-button" onClick={addBooster}>
          Add
        </button>
        <ul key={key}>
          {booster.map((_: any, index: number) => (
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
};

export default DraftCreateView;
