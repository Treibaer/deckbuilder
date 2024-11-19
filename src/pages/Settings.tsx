import { Link } from "react-router-dom";
import Constants from "../Services/Constants";
import Button from "../components/Button";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  return (
    <div className="mx-auto">
      <Helmet title="Settings" />
      <div className="text-3xl font-semibold m-2 text-center mb-4">
        Settings
      </div>
      <div className="flex gap-4">
        {Constants.playModeEnabled && (
          <Link to="/playtests">
            <Button title="Playtest History" />
          </Link>
        )}
        <Link to="/imports">
          <Button title="Imports" />
        </Link>
        <Link to="/logout">
          <Button title="Logout" />
        </Link>
      </div>
    </div>
  );
};

export default Settings;
