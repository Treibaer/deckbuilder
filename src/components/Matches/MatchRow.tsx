import { Link } from "react-router-dom";
import Button from "../Decks/Button";
import { Match } from "../../models/dtos";

const MatchRow: React.FC<{
  match: Match;
  onSelectDeck: (match: any, player: number) => void;
  openMatch: (matchId: number) => void;
}> = ({ match, onSelectDeck, openMatch }) => {
  return (
    <div className="matchRow">
      <div>{match.id}</div>
      <div>
        <Link to={`/users/${match.player0.id}`}>{match.player0.name}</Link>
        {match.player0.canSelectDeck && (
          <Button title="Select Deck" onClick={() => onSelectDeck(match, 0)} />
        )}
        {!match.player0.canSelectDeck && !match.player0.deckSelected && (
          <Button title="Select Deck" disabled={true} />
        )}
      </div>
      <div>
        <Link to={`/users/${match.player1.id}`}>{match.player1.name}</Link>
        {match.player1.canSelectDeck && (
          <Button title="Select Deck" onClick={() => onSelectDeck(match, 1)} />
        )}
        {!match.player1.canSelectDeck && !match.player1.deckSelected && (
          <Button title="Select Deck" disabled={true} />
        )}
      </div>
      <div>
        <Button
          title="Play"
          onClick={() => openMatch(match.id)}
          disabled={!match.player0.deckSelected || !match.player1.deckSelected}
        />
      </div>
    </div>
  );
};

export default MatchRow;