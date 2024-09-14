import { useLoaderData } from "react-router-dom";
import { Playtest } from "../models/dtos";
import PlaytestService from "../Services/PlaytestService";

const playtestService = PlaytestService.shared;

const PlaytestHistory = () => {
  const playtestHistory = useLoaderData() as Playtest[];

  function play(id: number) {
    window.open("/magic-web-js/play.html?mId=" + id, "_blank");
  }

  return (
    <div>
      <h1 className="mb-4">Playtest History</h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xl">
          <p>Playtest ID</p>
          <p>Date</p>
          <p>Actions</p>
        </div>
        {playtestHistory.reverse().map((pt) => (
          <div
            key={pt.id}
            className="flex justify-between gap border-b border-b-slate-600"
          >
            <p>{pt.id}</p>
            <p>{new Date(pt.createdAt * 1000).toLocaleDateString()}</p>
            <p>
              <button className="tb-button" onClick={() => play(pt.id)}>
                Play
              </button>
            </p>
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
