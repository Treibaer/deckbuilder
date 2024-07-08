import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import "./Matches.css";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [users, setUsers] = useState([]);
  const [decks, setDecks] = useState([]);

  async function loadMatches() {
    const response = await fetch("http://localhost:3456/api/matches");
    const matches = await response.json();
    setMatches(matches);
  }
  useEffect(() => {
    loadMatches();
  }, []);

  async function openCreateMatchForm() {
    setIsLoading(true);
    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // load users
    // load my decks
    const response = await fetch("http://localhost:3456/api/users");
    const users = await response.json();
    setUsers(users);
    const response2 = await fetch("http://localhost:3456/api/decks");
    const decks = await response2.json();
    setDecks(decks);

    setIsCreatingMatch(true);
    setIsLoading(false);
  }

  async function createMatch() {
    setIsLoading(true);
    setIsCreatingMatch(false);
    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // load users
    // load my decks
    const response = await fetch("http://localhost:3456/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        deckId: 1,
      }),
    });
    const match = await response.json();
    await loadMatches();
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading && (
        <div className="fullscreenBlurWithLoading">
          <LoadingSpinner />
        </div>
      )}
      {isCreatingMatch && (
        <div className="fullscreenBlurWithLoading">
          <div className="new-match-form new-deck-for1m">
            {/* {error && <ErrorView message={error.message} />} */}
            <h2>Create Match</h2>
            <div className="formRow">
              <label htmlFor="enemy">Enemy</label>
              <label htmlFor="deck">Select Deck</label>
            </div>
            <div className="formRow">
              <select name="enemy">
                {users.map((user, index) => (
                  <option key={index} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <select name="deck">
                {decks.map((deck, index) => (
                  <option key={index} value={deck.id}>
                    [{deck.id}] {deck.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={createMatch}>Create</button>
          </div>
        </div>
      )}
      <div className="header">
        <div className="title">Matches</div>
        <button onClick={openCreateMatchForm}>Create</button>
      </div>
      <div className="matches">
        {matches.map((match, index) => (
          <div key={index} className="matchRow">
            <div>{match.id}</div>
            {match.players.map((player, index) => (
              <div key={index}>
                  <Link to={`/users/${player.id}`}>{player.name}</Link>
              </div>
            ))}
            <div>{match.creationDate}</div>
            <div>
              <button onClick={() => startMatch()}>Play</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
