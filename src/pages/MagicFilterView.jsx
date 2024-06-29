import { useEffect, useState } from "react";
import Helper from "../components/Magic/Helper";
import "./MagicFilterView.css";
import { useNavigate } from "react-router-dom";
import MagicHelper from "../Services/MagicHelper";

export default function MagicFilterView({
  showFilter,
  setShowFilter,
  setSearchTerm,
}) {
  const navigate = useNavigate();

  const queryParameters = new URLSearchParams(window.location.search);
  const q = queryParameters.get("q");

  const prevFilter = MagicHelper.extractFilterFromQuery(q);

  const [filter, setFilter] = useState(prevFilter);

  console.log(filter);

  useEffect(() => {
    setFilter(MagicHelper.extractFilterFromQuery(q));
  }, [q]);

  function toggleColor(symbol) {
    if (filter.colors.includes(symbol)) {
      filter.colors = filter.colors.filter((c) => c !== symbol);
    } else {
      filter.colors.push(symbol);
    }
    console.log(filter.colors);
    setFilter({ ...filter, colors: filter.colors });
  }

  return (
    <div className={`filterBlurBackground ${showFilter ? "active" : ""}`}>
      <div className={`filter `}>
        <div className="closeButton" onClick={() => setShowFilter(false)}>
          X
        </div>
        <h2>Filter</h2>
        <div className="filterList">
          <div className="inputGroup">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              key={filter.cardName}
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
              key={filter.type}
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
              key={filter.manaValue}
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
              key={filter.power}
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
              key={filter.toughness}
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
            <input type="text" key={filter.set} name="set" />
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
              key={filter.oracle}
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
          <button
            onClick={() => {
              const filters = [];
              // build url
              let q = "";
              if (filter.cardName) {
                q += ` name:${filter.cardName}`;
                // filters.push(`name=${filter.name}`);
              }
              if (filter.type) {
                q += ` type:${filter.type}`;
                // filters.push(`type=${filter.type}`);
              }
              if (filter.manaValue) {
                q += ` mv:${filter.manaValue}`;
              }

              if (filter.rarity) {
                q += ` rarity:${filter.rarity}`;
              }

              if (filter.power) {
                q += ` power:${filter.power}`;
              }
              if (filter.toughness) {
                q += ` toughness:${filter.toughness}`;
              }
              if (filter.loyalty) {
                q += ` loyalty:${filter.loyalty}`;
              }
              if (filter.set) {
                q += ` set:${filter.set}`;
              }
              if (filter.format) {
                q += ` format:${filter.format}`;
              }
              if (filter.oracle) {
                q += ` oracle:${filter.oracle}`;
              }
              if (filter.colors.length > 0) {
                q += ` color:${filter.colors.join("")}`;
              }
              q = q.trim().toLowerCase();
              // let url = `/magicCardSearch?${filters.join("&")}`;
              let url = `/magicCardSearch?q=${q}`;
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
