import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CardSetItem from "../components/CardSetItem";
import DeckPreview from "../components/Deck/DeckPreview";
import DecksListWrapper from "../components/Deck/DecksListWrapper";
import SearchBar from "../components/Search/SearchBar";
import { Deck, Playtest } from "../models/dtos";
import CardService from "../Services/CardService";
import DeckService from "../Services/DeckService";
import PlaytestService from "../Services/PlaytestService";
import Constants from "../Services/Constants";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
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
      decks.length = decks.length > 3 ? 3 : decks.length;
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
      <Helmet title="Home" />
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
          <CardSetItem set={set} key={set.scryfallId} />
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
            <DecksListWrapper decks={myDecks} type="custom" />
          </div>
        </>
      )}
      {Constants.beta && playtests.length > 0 && (
        <>
          <div className="flex justify-center items-center gap-4 my-4">
            <div className="cursor-default text-3xl font-semibold m-2 text-center">
              Recent Playtests
            </div>
            <Link to="/playtests">
              <Button title="View All" />
            </Link>
          </div>
          <div className="flex flex-col mt-4 gap-2 sm:items-center">
            {playtests.map((playtest) => (
              <div className="sm:w-[400px]" key={playtest.id}>
                <DeckPreview
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

export default HomePage;
