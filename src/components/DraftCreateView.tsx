import { useState } from "react";
import Button from "./Button";
import Dialog from "./Common/Dialog";

const DraftCreateView: React.FC<{
  closeDialog: () => void;
  sets: any[];
}> = ({ closeDialog, sets }) => {
  const [players, setPlayers] = useState(8);
  const [booster, setBooster] = useState<string[]>([]);
  const [key, setKey] = useState(Math.floor(Math.random() * 1000000));
  sets.sort((a, b) => a.name.localeCompare(b.name));

  function addBooster() {
    const newValue = booster.length > 0 ? booster[booster.length - 1] : "";
    setBooster([...booster, newValue]);
  }

  function selectBooster(index: number, value: any) {
    const newBooster: any = [...booster];
    newBooster[index] = value;
    setBooster((_: any) => newBooster);
  }

  function removeBooster(index: number) {
    const newBooster = [...booster];
    newBooster.splice(index, 1);
    setBooster((_: any) => newBooster);
    // force re-render
    setKey(Math.floor(Math.random() * 1000000));
  }

  return (
    <Dialog title="Create Draft" onClose={closeDialog} onSubmit={() => {}}>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" className="tb-input" />
      <label htmlFor="players">Players</label>
      <input
        className="tb-input"
        type="number"
        name="players"
        defaultValue={players}
        onChange={(event) => {
          setPlayers(parseInt(event.target.value));
        }}
      />
      <div className="select-none">
        <div className="flex gap-2 items-center mb-2">
          <div>Booster</div>
          <Button onClick={addBooster} title="Add" />
        </div>
        <ul key={key} className="mb-10">
          {booster.map((_: any, index: number) => (
            <li key={index}>
              <div className="flex gap-4 items-center">
                <select
                  // className="bg-mediumBlue border border-lightBlue text-white rounded-md p-2"
                  className="tb-select w-full bg-transparent"
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
                <Button
                  onClick={() => {
                    removeBooster(index);
                  }}
                  title="Remove"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
};

export default DraftCreateView;
