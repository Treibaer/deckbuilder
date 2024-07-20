import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import "./Matches.css";
import Client from "../Services/Client";
import Dialog from "../components/Common/Dialog";

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
    // wait 2 seconds
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // load users
    // load my decks
    const users = await client.get("/users");
    setUsers(users);
    setEnemyId(users[0].id);
    // const decks = await client.get("/decks");
    // setDecks(decks);

    setIsCreatingMatch(true);
    setIsLoading(false);
  }

  async function createMatch() {
    setIsLoading(true);
    setIsCreatingMatch(false);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = { enemyId: enemyId };
    const match = await client.post("/matches", JSON.stringify(data));
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
    // wait 2 seconds
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // load my decks
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
    await client.post(path, JSON.stringify(data));
    await loadMatches();
    setIsLoading(false);
  }

  function close() {
    setIsCreatingMatch(false);
  }

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {isCreatingMatch && (
        <div className="fullscreenBlurWithLoading">
          <Dialog title="Create Match" onClose={close} onSubmit={createMatch}>
            <div className="formRow">
              <label htmlFor="enemy">Enemy</label>
            </div>
            <div className="formRow">
              <select
                name="enemy"
                onChange={(event) => setEnemyId(event.target.value)}
              >
                {users.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </Dialog>
        </div>
      )}
      {isSelectingDeck && (
        <Dialog title="Select Deck" onClose={close} onSubmit={selectDeck} submitTitle="Select">
          <div className="formRow">
              <label htmlFor="enemy">My Deck</label>
            </div>
            <div className="formRow">
              <select
                name="deck"
                onChange={(event) => setSelectedDeckId(event.target.value)}
              >
                {decks.map((deck, index) => (
                  <option key={index} value={deck.id}>
                    [{deck.id}] {deck.name}
                  </option>
                ))}
              </select>
            </div>
          </Dialog>
      )}
      <div className="header">
        <div className="title">Matches</div>
        <button className="tb-button" onClick={openCreateMatchForm}>
          Create
        </button>
      </div>
      <div className="matches">
        {matches.map((match, index) => (
          <div key={index} className="matchRow">
            <div>{match.id}</div>
            <div>
              <Link to={`/users/${match.player0.id}`}>
                {match.player0.name}
              </Link>
              {match.player0.canSelectDeck && (
                <button
                  className="tb-button"
                  onClick={() => openDeckSelection(match, 0)}
                >
                  Select Deck
                </button>
              )}
              {!match.player0.canSelectDeck && !match.player0.deckSelected && (
                <button className="tb-button" disabled={"disabled"}>
                  Select Deck
                </button>
              )}
            </div>
            <div>
              <Link to={`/users/${match.player1.id}`}>
                {match.player1.name}
              </Link>
              {match.player1.canSelectDeck && (
                <button
                  className="tb-button"
                  onClick={() => openDeckSelection(match, 1)}
                >
                  Select Deck
                </button>
              )}
              {!match.player1.canSelectDeck && !match.player1.deckSelected && (
                <button className="tb-button" disabled={"disabled"}>
                  Select Deck
                </button>
              )}
            </div>

            <div>{match.creationDate}</div>
            <div>
              {match.player0.deckSelected && match.player0.deckSelected && (
                <button className="tb-button" onClick={() => openMatch(match.id)}>Play</button>
              )}
              {(!match.player0.deckSelected || !match.player0.deckSelected) && (
                <button className="tb-button" disabled={"disabled"}>Play</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
