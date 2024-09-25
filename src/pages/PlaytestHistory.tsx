import { useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import DeckPreview from "../components/Matches/DeckPreview";
import { Playtest } from "../models/dtos";
import PlaytestService from "../Services/PlaytestService";

const playtestService = PlaytestService.shared;

const PlaytestHistory = () => {
  const playtestHistory = useLoaderData() as Playtest[];

  function play(id: number) {
    window.open("/magic-web-js/play.html?matchId=" + id, "_blank");
  }

  return (
    <div className="w-full">
      <div className="text-3xl font-semibold m-2 text-center mb-8">
        Playtest History
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between text-xl w-full">
          <div>Playtest ID</div>
          <div>Preview</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {playtestHistory.map((pt) => (
          <div
            key={pt.id}
            className="flex justify-between border-b border-b-slate-600 items-center h-12"
          >
            <div>{pt.id}</div>
            <div className="">
              {pt.promoId && (
                <DeckPreview
                  moxfieldId={pt.moxfieldId}
                  name={pt.name}
                  promoId={pt.promoId}
                />
              )}
            </div>
            {/* <div className="flex gap-1 overflow-scroll w-[300px]">
              {pt.allScryfallIds.map((scryfallId) => (
                <img
                  className="w-12"
                  key={scryfallId}
                  src={`${MagicHelper.getImageUrl(scryfallId)}`}
                />
              ))}
              ;
            </div> */}
            <div>{new Date(pt.createdAt * 1000).toLocaleDateString()}</div>
            <Button title="Play" onClick={() => play(pt.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaytestHistory;

export const loader = async () => {
  return await playtestService.getAll();
};
