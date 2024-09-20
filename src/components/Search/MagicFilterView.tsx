import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Helper from "../../Services/Helper";
import MagicHelper from "../../Services/MagicHelper";
import { CardSet } from "../../models/dtos";
import Button from "../Button";

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

const MagicFilterView: React.FC<{
  sets: CardSet[];
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}> = ({ sets, showFilter, setShowFilter }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const prevFilter = MagicHelper.extractFilterFromQuery(q);

  const [filter, setFilter] = useState(prevFilter);

  const [key, setKey] = useState(Math.floor(Math.random() * 1000000));

  useEffect(() => {
    setFilter(MagicHelper.extractFilterFromQuery(q));
    setKey(Math.floor(Math.random() * 1000000));
  }, [q]);

  function toggleColor(symbol: string) {
    if (filter.colors.includes(symbol)) {
      filter.colors = filter.colors.filter((c) => c !== symbol);
    } else {
      filter.colors.push(symbol);
    }
    setFilter({ ...filter, colors: filter.colors });
  }

  function onSubmit() {
    const url = MagicHelper.createUrlFromFilter(filter);
    navigate(url);
    setShowFilter(false);
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
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="name">Name</label>
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
            <label htmlFor="type">Type</label>
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
            <label htmlFor="manaValue">Mana Value</label>
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
            <label htmlFor="power">Power</label>
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
            <label htmlFor="toughness">Toughness</label>
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
            <label htmlFor="rarity">Rarity</label>
            <select
              className="tb-select bg-mediumBlue w-full"
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
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="set">Set</label>
            <select
              className="tb-select bg-mediumBlue w-full"
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
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="format">Format</label>
            <select
              className="tb-select bg-mediumBlue w-full"
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
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="oracle">Text</label>
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
            <label htmlFor="colors">Colors</label>
            <div className="flex gap-2">
              <div className="radioGroup">
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
              </div>
              <label htmlFor="colorsAnd">And</label>
              <div className="flex">
                {colors.map((symbol) => {
                  return (
                    <div
                      key={symbol}
                      className={
                        filter.colors.includes(symbol) ? "active" : undefined
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
            <label htmlFor="unique">All prints</label>
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
            <label htmlFor="unique">Fullart</label>
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
          <Button title="Submit" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default MagicFilterView;
