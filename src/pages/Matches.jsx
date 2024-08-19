import { useEffect, useState } from "react";
import Client from "../Services/Client";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import CreateMatchDialog from "../components/Matches/CreateMatchDialog";
import MatchRow from "../components/Matches/MatchRow";
import SelectDeckDialog from "../components/Matches/SelectDeckDialog";
import "./Matches.css";

const client = Client.shared;

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isSelectingDeck, setIsSelectingDeck] = useState(false);
  const [users, setUsers] = useState([]);
  const [enemyId, setEnemyId] = useState(0);
  const [decks, setDecks] = useState([]);

  // vars for deck selection
  const [selectedPlayerPosition, setSelectedPlayerPosition] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState(0);

  async function loadMatches() {
    const matches = await client.get("/matches");
    setMatches(matches);
  }
  useEffect(() => {
    loadMatches();
  }, []);

  async function openCreateMatchForm() {
    setIsLoading(true);
    const users = await client.get("/users");
    setUsers(users);
    setEnemyId(users[0].id);

    setIsCreatingMatch(true);
    setIsLoading(false);
  }

  async function createMatch() {
    setIsLoading(true);
    setIsCreatingMatch(false);

    const data = { enemyId: enemyId };
    await client.post("/matches", data);
    await loadMatches();
    setIsLoading(false);
  }

  async function openMatch(matchId) {
    window.open("/magic-web-js/duo3.html?mId=" + matchId, "_blank").focus();
  }

  async function openDeckSelection(match, playerIndex) {
    setIsLoading(true);
    
    setSelectedPlayerPosition(playerIndex);
    setSelectedMatch(match);
    const decks = await client.get("/decks");
    if (decks.length > 0) {
      setSelectedDeckId(decks[0].id);
    }
    setDecks(decks);

    setIsSelectingDeck(true);
    setIsLoading(false);
  }

  async function selectDeck() {
    setIsLoading(true);
    setIsSelectingDeck(false);
    const path = `/matches/${selectedMatch.id}/selectDeck`;
    const data = {
      deckId: selectedDeckId,
      playerIndex: selectedPlayerPosition,
    };
    await client.post(path, data);
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
        <SelectDeckDialog decks={decks} onClose={close} onSubmit={selectDeck} setSelectedDeckId={setSelectedDeckId} />
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
}
