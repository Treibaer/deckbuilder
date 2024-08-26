import { useLoaderData } from "react-router-dom";
import PlaytestService from "../Services/PlaytestService";
import "./PlaytestHistory.css";
import { Playtest } from "./deck";

const playtestService = PlaytestService.shared;

const PlaytestHistory = () => {
  const playtestHistory = useLoaderData() as Playtest[];

  function play(id: number) {
    window.open("/magic-web-js/play.html?mId=" + id, "_blank");
  }

  return (
    <div>
      <h1>Playtest History</h1>
      <ul>
        <li className="playtest-row">
          <p>Playtest ID</p>
          <p>Date</p>
          <p>Actions</p>
        </li>
        {playtestHistory.reverse().map((pt) => (
          <li key={pt.id} className="playtest-row">
            <p>{pt.id}</p>
            <p>{new Date(pt.createdAt * 1000).toLocaleDateString()}</p>
            <p>
              <button className="tb-button" onClick={() => play(pt.id)}>
                Play
              </button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaytestHistory;

export const loader = async () => {
  return await playtestService.getAll();
};
