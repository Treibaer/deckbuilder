import { Link } from "react-router-dom";
import Constants from "../Services/Constants";

const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
      {Constants.playModeEnabled && (
        <Link to="/profile/playtests">
          <button className="tb-button">Playtest History</button>
        </Link>
      )}
    </div>
  );
};

export default Profile;
