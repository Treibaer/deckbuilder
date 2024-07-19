import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <Link to="/profile/playtests">
        <button className="tb-button">Playtest History</button>
      </Link>
    </div>
  );
}
