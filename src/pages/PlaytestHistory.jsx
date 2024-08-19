import { useEffect, useState } from "react";
import Client from "../Services/Client";
import "./PlaytestHistory.css";

const client = Client.shared;

export default function PlaytestHistory() {
  const [playtestHistory, setPlaytestHistory] = useState([]);

  async function getPlaytestHistory() {
    const pt = await client.get("/playtests");
    setPlaytestHistory(pt);
  }
  useEffect(() => {
    getPlaytestHistory();
  }, []);

  // convert unix timestamp to human readable date
  playtestHistory.forEach((pt) => {
    pt.createdAt = new Date(pt.createdAt * 1000).toLocaleDateString();
  });

  function play(id) {
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
            <p>{pt.createdAt}</p>
            <p>
              <button className="tb-button" onClick={() => play(pt.id)}>Play</button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
