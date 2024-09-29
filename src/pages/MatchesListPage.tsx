import { useEffect, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import DeckService from "../Services/DeckService";
import MatchService from "../Services/MatchService";
import DelayedLoadingSpinner from "../components/Common/DelayedLoadingSpinner";
import TitleView from "../components/Common/TitleView";
import DeckSelectionDialog from "../components/Matches/DeckSelectionDialog";
import MatchCreationDialog from "../components/Matches/MatchCreationDialog";
import MatchListItem from "../components/Matches/MatchListItem";
import { Deck, Match, User } from "../models/dtos";
import { useSocket } from "../hooks/useSocket";

const matchService = MatchService.shared;
const deckService = DeckService.shared;

const MatchesListPage = () => {
  const [matches, setMatches] = useState<Match[]>(useLoaderData() as Match[]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [isSelectingDeck, setIsSelectingDeck] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [enemyId, setEnemyId] = useState(0);
  const [decks, setDecks] = useState<Deck[]>([]);

  const { listenOn, listenOff, emit } = useSocket();

  useEffect(() => {
    listenOn("matches", "update", (_) => {
      loadMatches();
    });
    return () => {
      listenOff("matches", "update");
    };
  }, []);

  async function refresh() {
    await loadMatches();
    emit("matches", "update", {});
  }


  // vars for deck selection
  const [selectedPlayerPosition, setSelectedPlayerPosition] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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
    await refresh();
    setIsLoading(false);
  }

  async function openMatch(matchId: number) {
    window.open(`/matches/${matchId}`, "_blank")?.focus();
  }

  async function openDeckSelection(match: Match, playerIndex: number) {
    setIsLoading(true);

    setSelectedPlayerPosition(playerIndex);
    setSelectedMatch(match);
    const decks = await deckService.getAll();
    setDecks(decks);

    setIsSelectingDeck(true);
    setIsLoading(false);
  }

  async function selectDeck(deckId?: number, moxfieldId?: string) {
    if (selectedMatch == null) {
      return;
    }
    setIsLoading(true);
    setIsSelectingDeck(false);
    await matchService.selectDeck(
      selectedMatch,
      selectedPlayerPosition,
      deckId?.toString(),
      moxfieldId
    );
    await refresh();
    setIsLoading(false);
  }

  function close() {
    setIsCreatingMatch(false);
    setIsSelectingDeck(false);
  }

  return (
    <div className="mb-8 mx-auto">
      {isLoading && <DelayedLoadingSpinner />}
      {isCreatingMatch && (
        <MatchCreationDialog
          users={users}
          onClose={close}
          onSubmit={createMatch}
          setEnemyId={setEnemyId}
        />
      )}
      {isSelectingDeck && (
        <DeckSelectionDialog
          decks={decks}
          onClose={close}
          onSubmit={selectDeck}
        />
      )}
      <TitleView title="Matches" openDialog={openCreateMatchForm} />
      <table className="mt-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 select-none">
        <thead className="text-xs text-gray-700 uppercase bg-mediumBlue dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Player 0
            </th>
            <th scope="col" className="px-6 py-3">
              Player 1
            </th>
            <th scope="col" className="px-6 py-3">
              Play
            </th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, _) => (
            <MatchListItem
              key={match.id}
              match={match}
              openMatch={openMatch}
              onSelectDeck={openDeckSelection}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchesListPage;

export const loader: LoaderFunction = async () => {
  return await matchService.getAll();
};
