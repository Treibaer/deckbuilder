import { useEffect, useState } from "react";
import MatchService from "../Services/MatchService";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import CreateMatchDialog from "../components/Matches/CreateMatchDialog";
import MatchRow from "../components/Matches/MatchRow";
import SelectDeckDialog from "../components/Matches/SelectDeckDialog";
import "./Matches.css";
import { Deck, Match, User } from "./deck";
import DeckService from "../Services/DeckService";

const matchService = MatchService.shared;
const deckService = DeckService.shared;

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isSelectingDeck, setIsSelectingDeck] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [enemyId, setEnemyId] = useState(0);
  const [decks, setDecks] = useState<Deck[]>([]);

  // vars for deck selection
  const [selectedPlayerPosition, setSelectedPlayerPosition] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState(0);

  async function loadMatches() {
    const matches = await matchService.getAll();
    setMatches(matches);
  }
  useEffect(() => {
    loadMatches();
  }, []);

  async function openCreateMatchForm() {
    setIsLoading(true);
    const users = await matchService.getUsers();
    setUsers(users);
    setEnemyId(users[0].id);

    setIsCreatingMatch(true);
    setIsLoading(false);
  }

  async function createMatch() {
    setIsLoading(true);
    setIsCreatingMatch(false);

    await matchService.create(enemyId);
    await loadMatches();
    setIsLoading(false);
  }

  async function openMatch(matchId: number) {
    window.open("/magic-web-js/duo3.html?mId=" + matchId, "_blank")?.focus();
  }

  async function openDeckSelection(match: Match, playerIndex: number) {
    setIsLoading(true);

    setSelectedPlayerPosition(playerIndex);
    setSelectedMatch(match);
    const decks = await deckService.getAll();
    if (decks.length > 0) {
      setSelectedDeckId(decks[0].id);
    }
    setDecks(decks);

    setIsSelectingDeck(true);
    setIsLoading(false);
  }

  async function selectDeck() {
    if (selectedMatch == null) {
      return;
    }
    setIsLoading(true);
    setIsSelectingDeck(false);
    await matchService.selectDeck(selectedMatch, selectedPlayerPosition, selectedDeckId);
    await loadMatches();
    setIsLoading(false);
  }

  function close() {
    setIsCreatingMatch(false);
    setIsSelectingDeck(false);
  }

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {isCreatingMatch && (
        <CreateMatchDialog
          users={users}
          onClose={close}
          onSubmit={createMatch}
          setEnemyId={setEnemyId}
        />
      )}
      {isSelectingDeck && (
        <SelectDeckDialog
          decks={decks}
          onClose={close}
          onSubmit={selectDeck}
          setSelectedDeckId={setSelectedDeckId}
        />
      )}
      <div className="header">
        <div className="title">Matches</div>
        <button className="tb-button" onClick={openCreateMatchForm}>
          Create
        </button>
      </div>
      <div className="matches">
        {matches.map((match, _) => (
          <MatchRow
            match={match}
            openMatch={openMatch}
            onSelectDeck={openDeckSelection}
          />
        ))}
      </div>
    </div>
  );
};

export default Matches;
