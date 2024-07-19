import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Helper from "../components/Magic/Helper";
import MagicHelper from "../Services/MagicHelper";
import "./MagicFilterView.css";

export default function MagicFilterView({ sets, showFilter, setShowFilter }) {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const q = searchParams.get("q");

  const prevFilter = MagicHelper.extractFilterFromQuery(q);

  const [filter, setFilter] = useState(prevFilter);

  const [key, setKey] = useState(Math.floor(Math.random() * 1000000));

  useEffect(() => {
    setFilter(MagicHelper.extractFilterFromQuery(q));
    setKey(Math.floor(Math.random() * 1000000));
  }, [q]);

  function toggleColor(symbol) {
    if (filter.colors.includes(symbol)) {
      filter.colors = filter.colors.filter((c) => c !== symbol);
    } else {
      filter.colors.push(symbol);
    }
    setFilter({ ...filter, colors: filter.colors });
  }

  return (
    <div className={`filterBlurBackground ${showFilter ? "active" : ""}`}>
      <div className={`filter `}>
        <div className="titleBar">
          <h2>Filter</h2>
          <button className="tb-button" onClick={() => setShowFilter(false)}>
            X
          </button>
        </div>
        <div className="filterList">
          <div className="inputGroup">
            <label htmlFor="name">Name</label>
            <input
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
          <div className="inputGroup">
            <label htmlFor="type">Type</label>
            <input
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
          <div className="inputGroup">
            <label htmlFor="manaValue">Mana Value</label>
            <input
              type="number"
              name="manaValue"
              key={`manaValue_${key}`}
              defaultValue={filter.manaValue}
              onChange={(event) => {
                setFilter({ ...filter, manaValue: event.target.value });
              }}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="power">Power</label>
            <input
              type="number"
              name="power"
              key={`power_${key}`}
              defaultValue={filter.power}
              onChange={(event) => {
                setFilter({ ...filter, power: event.target.value });
              }}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="toughness">Toughness</label>
            <input
              type="number"
              name="toughness"
              key={`toughness_${key}`}
              defaultValue={filter.toughness}
              onChange={(event) => {
                setFilter({ ...filter, toughness: event.target.value });
              }}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="rarity">Rarity</label>
            <select
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
          <div className="inputGroup">
            <label htmlFor="set">Set</label>
            {/* <input type="text" key={`set_${key}`} name="set" /> */}
            <select
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
          <div className="inputGroup">
            <label htmlFor="format">Format</label>
            <select
              name="format"
              onChange={(event) => {
                setFilter({ ...filter, format: event.target.value });
              }}
            >
              {[
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
              ].map((format) => {
                return (
                  <option
                    value={format}
                    key={format}
                    selected={filter.format === format ? "selected" : undefined}
                  >
                    {format.capitalize()}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="inputGroup">
            <label htmlFor="oracle">Text</label>
            <textarea
              type="text"
              name="oracle"
              key={`oracle_${key}`}
              defaultValue={filter.oracle}
              onChange={(event) => {
                setFilter({ ...filter, oracle: event.target.value });
              }}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="colors">Colors</label>
            <div className="colorSection">
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
              <div className="colors">
                {["w", "u", "b", "r", "g", "c"].map((symbol) => {
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
          <div className="inputGroup">
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
          <div className="inputGroup">
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
          <button
            className="tb-button"
            onClick={() => {
              const url = MagicHelper.createUrlFromFilter(filter);
              navigate(url);
              setShowFilter(false);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
