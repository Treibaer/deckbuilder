import { Link } from "react-router-dom";

const MatchRow: React.FC<{
  match: any;
  onSelectDeck: (match: any, player: number) => void;
  openMatch: (matchId: number) => void;
}> = ({ match, onSelectDeck, openMatch }) => {
  return (
    <div className="matchRow">
      <div>{match.id}</div>
      <div>
        <Link to={`/users/${match.player0.id}`}>{match.player0.name}</Link>
        {match.player0.canSelectDeck && (
          <button className="tb-button" onClick={() => onSelectDeck(match, 0)}>
            Select Deck
          </button>
        )}
        {!match.player0.canSelectDeck && !match.player0.deckSelected && (
          <button className="tb-button" disabled={true}>
            Select Deck
          </button>
        )}
      </div>
      <div>
        <Link to={`/users/${match.player1.id}`}>{match.player1.name}</Link>
        {match.player1.canSelectDeck && (
          <button className="tb-button" onClick={() => onSelectDeck(match, 1)}>
            Select Deck
          </button>
        )}
        {!match.player1.canSelectDeck && !match.player1.deckSelected && (
          <button className="tb-button" disabled={true}>
            Select Deck
          </button>
        )}
      </div>

      <div>{match.creationDate}</div>
      <div>
        {match.player0.deckSelected && match.player0.deckSelected && (
          <button className="tb-button" onClick={() => openMatch(match.id)}>
            Play
          </button>
        )}
        {(!match.player0.deckSelected || !match.player0.deckSelected) && (
          <button className="tb-button" disabled={true}>
            Play
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchRow;
