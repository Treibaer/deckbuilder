import { useLoaderData } from "react-router-dom";
import { Playtest } from "../models/dtos";
import PlaytestService from "../Services/PlaytestService";
import Button from "../components/Button";

const playtestService = PlaytestService.shared;

const PlaytestHistory = () => {
  const playtestHistory = useLoaderData() as Playtest[];

  function play(id: number) {
    window.open("/magic-web-js/play.html?matchId=" + id, "_blank");
  }

  return (
    <div className="w-full">
      <h1 className="mb-4">Playtest History</h1>
      <div className="flex flex-col w-full">
        <div className="flex justify-between text-xl w-full">
          <div>Playtest ID</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {playtestHistory.map((pt) => (
          <div
            key={pt.id}
            className="flex justify-between border-b border-b-slate-600 items-center h-12"
          >
            <div>{pt.id}</div>
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
