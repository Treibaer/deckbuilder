import { LoaderFunction } from "react-router-dom";
import DraftService from "../Services/DraftService";
import MagicHelper from "../Services/MagicHelper";
import { useState } from "react";

type Draft = {
  id: number;
  name: string;
  format: string;
  createdAt: number;
  updatedAt: number;
  packs: DraftPack[];
  packsCount: number;
  currentPackNumber: number;
};

type DraftPack = {
  id: number;
  draftId: number;
  packNumber: number;
  cards: DraftCard[];
};

type DraftCard = {
  scryfallId: string;
  pickedBy?: number;
};

const DraftDetailView = () => {
  const draftPack0: DraftCard[] = [
    {
      scryfallId: "6f1a7590-3eee-4803-b192-d4fb771e6a86",
    },
    {
      scryfallId: "8e2fae80-60af-44cf-95b4-177837435d1a",
    },
    {
      scryfallId: "dfe36901-5841-4942-8b61-c273111f715e",
    },
  ];
  const draftPack1: DraftCard[] = [
    {
      scryfallId: "e4f6a399-a5af-4f8a-ac57-c26fd3fb033b",
    },
    {
      scryfallId: "d501527c-1bf5-4b59-9bff-e4562181a096",
    },
    {
      scryfallId: "42ca7627-965e-4594-a871-d8d137d6b9a9",
    },
  ];
  const draftPacks: DraftPack[] = [
    {
      id: 1,
      draftId: 1,
      packNumber: 1,
      cards: draftPack0,
    },
    {
      id: 2,
      draftId: 1,
      packNumber: 2,
      cards: draftPack1,
    },
  ];
  // const draft = useLoaderData() as Draft;
  const draft: Draft = {
    id: 1,
    name: "Draft",
    format: "Standard",
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
    packs: draftPacks,
    packsCount: 2,
    currentPackNumber: 1,
  };

  const draftState = {
    draft,
    currentPackNumber: 1,
    currentRound: 1,
    started: false,
    picked: [0],
    players: [
      {
        id: 1,
        name: "Player 1",
        cards: [],
      },
    ],
  };

  const [state, setState] = useState(draftState);
  const pack = state.draft.packs.find(
    (pack) => pack.packNumber === state.currentPackNumber
  )!;

  function clickOn(card: DraftCard) {
    const myId = 1;
    let round = state.currentRound;
    let packNumber = state.currentPackNumber;


    card.pickedBy = myId;

    state.picked.push(myId);

    let hasPickedThisRound = state.picked.includes(myId);
    let allPlayersPicked = hasPickedThisRound; // state.players.every((player) => player.cards.length);

    if (allPlayersPicked) {
      round++;
      // packNumber++;
      state.picked = [];
    }
    setState({
      ...state,
      currentRound: round,
      currentPackNumber: packNumber,
    });
    console.log(card);
  }

  console.log(pack.cards);

  return (
    <div>
      <div>
        <div>Draft Detail View {draft.id}</div>
        <div> Current round {state.currentRound}</div>
        <div> Current pack {state.currentPackNumber}</div>
        <div>Pack #{pack.packNumber}</div>
        <div className="flex flex-wrap gap-2">
          {pack.cards
            .filter((card) => card.pickedBy === undefined)
            .map((card) => (
              <div key={card.scryfallId}>
                <img
                  className="magicCard small"
                  src={MagicHelper.getImageUrl(card.scryfallId)}
                  onClick={() => clickOn(card)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default DraftDetailView;

export const loader: LoaderFunction<{ draftId: number }> = async ({
  params,
}) => {
  return await DraftService.shared.get(Number(params.draftId));
};
