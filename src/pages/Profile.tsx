import { Link } from "react-router-dom";
import Constants from "../Services/Constants";
import Button from "../components/Button";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  return (
    <div className="mx-auto">
      <Helmet title="Profile" />
      <h1 className="mb-8">Profile</h1>
      <div className="flex gap-4">
        {Constants.playModeEnabled && (
          <Link to="/playtests">
            <Button title="Playtest History" />
          </Link>
        )}
        <Link to="/logout">
          <Button title="Logout" />
        </Link>
      </div>
    </div>
  );
};

export default Profile;
