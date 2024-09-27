import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import DecksList from "../components/Decks/DecksList";
import SearchBar from "../components/Search/SearchBar";
import { Deck, Playtest } from "../models/dtos";
import CardService from "../Services/CardService";
import DeckService from "../Services/DeckService";
import SetSingleView from "./SetSingleView";
import PlaytestService from "../Services/PlaytestService";
import DeckPreview from "../components/Matches/DeckPreview";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [myDecks, setMyDecks] = useState<Deck[]>([]);
  const [sets, setSets] = useState<any[]>([]);
  const [playtests, setPlaytests] = useState<Playtest[]>([]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleSearch() {
    navigate(`/search?q=${searchTerm}`);
  }

  useEffect(() => {
    async function fetchDecks() {
      const decks = await DeckService.shared.getAll();
      decks.sort((a, b) => {
        return a.updatedAt > b.updatedAt ? -1 : 1;
      });
      decks.length = 3;
      setMyDecks(decks);
    }
    async function fetchSets() {
      const sets = await CardService.shared.getSets();
      sets.length = 5;
      setSets(sets);
    }
    async function fetchPlaytests() {
      const playtests = await PlaytestService.shared.getAll();
      playtests.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
      playtests.length = 3;
      setPlaytests(playtests);
    }
    fetchDecks();
    fetchSets();
    fetchPlaytests();
  }, []);

  return (
    <div className="mx-auto w-full select-none">
      <div className="cursor-default text-3xl font-semibold m-2 text-center">
        Welcome!
      </div>

      <SearchBar
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        handleChange={handleChange}
      />

      <div className="flex justify-center items-center gap-4 my-4">
        <div className="cursor-default text-3xl font-semibold m-2 text-center">
          Newest Sets
        </div>
        <Link to="/sets">
          <Button title="View All" />
        </Link>
      </div>

      <div className="flex flex-wrap mt-4 gap-2 justify-center">
        {sets.map((set) => (
          <SetSingleView set={set} key={set.scryfallId} />
        ))}
      </div>
      {myDecks.length > 0 && (
        <>
          <div className="flex justify-center items-center gap-4 my-4">
            <div className="cursor-default text-3xl font-semibold m-2 text-center">
              My Decks
            </div>
            <Link to="/decks/my">
              <Button title="View All" />
            </Link>
          </div>
          <div>
            <DecksList decks={myDecks} type="custom" />
          </div>
        </>
      )}
      {playtests.length > 0 && (
        <>
          <div className="flex justify-center items-center gap-4 my-4">
            <div className="cursor-default text-3xl font-semibold m-2 text-center">
              Recent Playtests
            </div>
            <Link to="/playtests">
              <Button title="View All" />
            </Link>
          </div>
          <div className="flex flex-col mt-4 gap-2 items-center">
            {playtests.map((playtest) => (
              <div className="w-[600px]">
                <DeckPreview
                  key={playtest.id}
                  name={playtest.name}
                  promoId={playtest.promoId}
                  moxfieldId={playtest.moxfieldId}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
