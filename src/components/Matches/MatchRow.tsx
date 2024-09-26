import { Match } from "../../models/dtos";
import Button from "../Button";
import DeckPreview from "./DeckPreview";

const MatchRow: React.FC<{
  match: Match;
  onSelectDeck: (match: any, player: number) => void;
  openMatch: (matchId: number) => void;
}> = ({ match, onSelectDeck, openMatch }) => {
  return (
    <tr className="border-b border-lightBlue bg-darkBlue h-16">
      <td className="px-6">{match.id}</td>
      {/* <div className="flex gap-2 flex-1 justify-start items-center"> */}

      <td className="px-6 text-base">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{match.player0.name}</div>
          {match.player0.canSelectDeck && (
            <Button
              title="Select Deck"
              onClick={() => onSelectDeck(match, 0)}
            />
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
      </td>
      {/* <div className="flex gap-2 flex-1 items-center"> */}
      <td className="px-6 text-base">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{match.player1.name}</div>
          {match.player1.canSelectDeck && (
            <Button
              title="Select Deck"
              onClick={() => onSelectDeck(match, 1)}
            />
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
      </td>
      <td className="px-6">
        <Button
          title="Play"
          onClick={() => openMatch(match.id)}
          disabled={!match.player0.deckSelected || !match.player1.deckSelected}
        />
      </td>
    </tr>
  );
};

export default MatchRow;
