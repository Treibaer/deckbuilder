import { useEffect, useState } from "react";
import "./PlaytestHistory.css";
import { Playtest } from "./deck";
import PlaytestService from "../Services/PlaytestService";

const playtestService = PlaytestService.shared;

const PlaytestHistory = () => {
  const [playtestHistory, setPlaytestHistory] = useState<Playtest[]>([]);

  async function getPlaytestHistory() {
    const pt = await playtestService.getAll();
    setPlaytestHistory(pt);
  }
  useEffect(() => {
    getPlaytestHistory();
  }, []);

  // convert unix timestamp to human readable date
  playtestHistory.forEach((pt) => {
    pt.createdAtString = new Date(pt.createdAt * 1000).toLocaleDateString();
  });

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
            <p>{pt.createdAtString}</p>
            <p>
              <button className="tb-button" onClick={() => play(pt.id)}>Play</button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaytestHistory;
