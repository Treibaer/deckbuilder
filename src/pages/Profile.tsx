import { Link } from "react-router-dom";
import Constants from "../Services/Constants";
import Button from "../components/Decks/Button";

const Profile = () => {
  return (
    <div>
      <h1>Profile</h1>
      {Constants.playModeEnabled && (
        <Link to="/profile/playtests">
          <Button title="Playtest History" />
        </Link>
      )}
    </div>
  );
};

export default Profile;
