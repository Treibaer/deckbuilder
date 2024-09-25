import { Link } from "react-router-dom";
import Button from "../Button";
import { Match } from "../../models/dtos";
import DeckPreview from "./DeckPreview";

const MatchRow: React.FC<{
  match: Match;
  onSelectDeck: (match: any, player: number) => void;
  openMatch: (matchId: number) => void;
}> = ({ match, onSelectDeck, openMatch }) => {
  return (
    <div className="flex gap-4 w-full justify-between items-center">
      <div>{match.id}</div>
      <div className="flex gap-2 flex-1 justify-start items-center">
        <Link to={`/users/${match.player0.id}`}>{match.player0.name}</Link>
        {match.player0.canSelectDeck && (
          <Button title="Select Deck" onClick={() => onSelectDeck(match, 0)} />
        )}
        {!match.player0.canSelectDeck && !match.player0.deckSelected && (
          <Button title="Select Deck" disabled={true} />
        )}
        {match.player0.deckSelected && match.player0.playtest.promoId && (
          <DeckPreview
            moxfieldId={match.player0.playtest.moxfieldId}
            name={match.player0.playtest.name}
            promoId={match.player0.playtest.promoId}
          />
        )}
      </div>
      <div className="flex gap-2 flex-1 items-center">
        <Link to={`/users/${match.player1.id}`}>{match.player1.name}</Link>
        {match.player1.canSelectDeck && (
          <Button title="Select Deck" onClick={() => onSelectDeck(match, 1)} />
        )}
        {!match.player1.canSelectDeck && !match.player1.deckSelected && (
          <Button title="Select Deck" disabled={true} />
        )}
        {match.player1.deckSelected && match.player1.playtest.promoId && (
          <DeckPreview
            moxfieldId={match.player1.playtest.moxfieldId}
            name={match.player1.playtest.name}
            promoId={match.player1.playtest.promoId}
          />
        )}
      </div>
      <div className="flex-1 flex justify-center">
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
