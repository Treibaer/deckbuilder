import { createRef, useEffect, useState } from "react";
import Helper from "../../Services/Helper";
import MagicHelper from "../../Services/MagicHelper";
import { CardSet } from "../../models/dtos";
import Button from "../Button";
import Select from "../Select";

const formats = [
  "",
  "standard",
  "modern",
  "legacy",
  "vintage",
  "commander",
  "pauper",
  "pioneer",
  "historic",
  "penny",
  "brawl",
  "duel",
  "oldschool",
  "premodern",
  "frontier",
  "future",
];
const colors = ["w", "u", "b", "r", "g", "c"];

const CardSearchFilter: React.FC<{
  query: string;
  sets: CardSet[];
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  onSubmit: (query: string) => void;
}> = ({ query, sets, showFilter, setShowFilter, onSubmit }) => {
  const prevFilter = MagicHelper.extractFilterFromQuery(query);

  const [filter, setFilter] = useState(prevFilter);

  const [key, setKey] = useState(Math.floor(Math.random() * 1000000));

  useEffect(() => {
    setFilter(MagicHelper.extractFilterFromQuery(query));
    setKey(Math.floor(Math.random() * 1000000));
  }, [query]);

  function toggleColor(symbol: string) {
    if (filter.colors.includes(symbol)) {
      filter.colors = filter.colors.filter((c) => c !== symbol);
    } else {
      filter.colors.push(symbol);
    }
    setFilter({ ...filter, colors: filter.colors });
  }

  function handleSubmit() {
    const query = MagicHelper.createQueryFromFilter(filter);
    onSubmit(query);
  }

  const formRef = createRef<HTMLFormElement>();

  function handleReset() {
    formRef.current?.reset();
    setFilter({
      cardName: "",
      type: "",
      manaValue: "",
      power: "",
      toughness: "",
      rarity: "",
      set: "",
      format: "",
      oracle: "",
      colors: [],
      unique: undefined,
      is: undefined,
      order: "name",
    });
  }

  return (
    <div
      className={`blurredBackground filterView ${showFilter ? "active" : ""}`}
      onClick={() => setShowFilter(false)}
    >
      <div
        className={`backdrop-blur-xl bg-[rgba(32,33,46,0.8)] w-[calc(100vw-16px)] border border-lightBlue max-w-[80%] max-h-[80%] overflow-y-scroll sm:max-w-[500px] md:max-w-[600px] p-2 rounded shadow-lg absolute top-1/2 sm:top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 `}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between">
          <div className="text-xl">Filter</div>
          <Button onClick={() => setShowFilter(false)} title="X" />
        </div>
        <form className="flex flex-col gap-2 mt-4" ref={formRef}>
          <div className="flex items-center gap-2">
            <label htmlFor="name" className="w-40">
              Name
            </label>
            <input
              className="tb-input"
              type="text"
              name="name"
              placeholder="Name"
              key={`name_${key}`}
              defaultValue={filter.cardName}
              onChange={(event) => {
                setFilter({ ...filter, cardName: event.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="type" className="w-40">
              Type
            </label>
            <input
              className="tb-input"
              type="text"
              name="type"
              key={`type_${key}`}
              placeholder="Type"
              defaultValue={filter.type}
              onChange={(event) => {
                setFilter({ ...filter, type: event.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="manaValue" className="w-40">
              Mana Value
            </label>
            <input
              className="tb-input"
              type="number"
              name="manaValue"
              key={`manaValue_${key}`}
              defaultValue={filter.manaValue}
              onChange={(event) => {
                setFilter({ ...filter, manaValue: event.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="power" className="w-40">
              Power
            </label>
            <input
              className="tb-input"
              type="number"
              name="power"
              key={`power_${key}`}
              defaultValue={filter.power}
              onChange={(event) => {
                setFilter({ ...filter, power: event.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="toughness" className="w-40">
              Toughness
            </label>
            <input
              className="tb-input"
              type="number"
              name="toughness"
              key={`toughness_${key}`}
              defaultValue={filter.toughness}
              onChange={(event) => {
                setFilter({ ...filter, toughness: event.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rarity" className="w-40">
              Rarity
            </label>
            <Select
              name="rarity"
              defaultValue={filter.rarity}
              onChange={(event) => {
                setFilter({ ...filter, rarity: event.target.value });
              }}
            >
              {["", "common", "uncommon", "rare", "mythic"].map((rarity) => {
                return (
                  <option value={rarity} key={rarity}>
                    {rarity}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="set" className="w-40">
              Set
            </label>
            <Select
              name="set"
              key={`set_${key}`}
              defaultValue={filter.set}
              onChange={(event) => {
                setFilter({ ...filter, set: event.target.value });
              }}
            >
              <option value="">All</option>
              {sets.map((set) => {
                return (
                  <option value={set.code} key={set.code}>
                    {set.name}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="format" className="w-40">
              Format
            </label>
            <Select
              name="format"
              onChange={(event) => {
                setFilter({ ...filter, format: event.target.value });
              }}
              defaultValue={filter.format}
            >
              {formats.map((format) => {
                return (
                  <option value={format} key={format}>
                    {format}
                  </option>
                );
              })}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="oracle" className="w-40">
              Text
            </label>
            <textarea
              className="tb-input"
              name="oracle"
              key={`oracle_${key}`}
              defaultValue={filter.oracle}
              onChange={(event) => {
                setFilter({ ...filter, oracle: event.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="colors" className="w-40">
              Colors
            </label>
            <div className="flex gap-4">
              <div className="radioGroup flex gap-2">
                <input
                  type="radio"
                  id="colorsOr"
                  name="colorsLogic"
                  value="Or"
                  defaultChecked
                />
                <label htmlFor="colorsOr">Or</label>
                <input
                  type="radio"
                  id="colorsAnd"
                  name="colorsLogic"
                  value="And"
                />
                <label htmlFor="colorsAnd">And</label>
              </div>
              <div className="flex">
                {colors.map((symbol) => {
                  return (
                    <div
                      key={symbol}
                      className={
                        filter.colors.includes(symbol)
                          ? "border border-brightBlue rounded-xl"
                          : undefined
                      }
                      onClick={() => {
                        toggleColor(symbol);
                      }}
                    >
                      {Helper.replaceColorSymbolsByImage(symbol.toUpperCase())}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="unique" className="w-40">
              All prints
            </label>
            <input
              type="checkbox"
              name="unique"
              key={`unique_${key}`}
              checked={filter.unique === "prints"}
              onChange={(event) => {
                setFilter({
                  ...filter,
                  unique: event.target.checked ? "prints" : undefined,
                });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="unique" className="w-40">
              Fullart
            </label>
            <input
              type="checkbox"
              name="fullart"
              key={`fullart_${key}`}
              checked={filter.is === "fullart"}
              onChange={(event) => {
                setFilter({
                  ...filter,
                  is: event.target.checked ? "fullart" : undefined,
                });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="w-40">
              Sort by
            </label>
            <Select
              onChange={(event) => {
                setFilter({ ...filter, order: event.target.value });
              }}
              defaultValue={filter.order}
            >
              <option value="name">Name</option>
              <option value="set">Set</option>
              <option value="rarity">Rarity</option>
              <option value="color">Color</option>
              <option value="released">Released</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button title="Reset" onClick={handleReset} />
            <Button title="Submit" onClick={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardSearchFilter;
