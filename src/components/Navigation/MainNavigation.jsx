import Constants from "../../Services/Constants";
import classes from "./MainNavigation.module.css";
import NavigationLink from "./NavigationLink";

export default function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <NavigationLink to="/" title="Home" />
          <NavigationLink to="/search" title="Search" />
          <NavigationLink to="/sets" title="Sets" />
          <NavigationLink to="/decks/moxfield" title="Moxfield Decks" />
          <NavigationLink to="/decks/my" title="My Decks" />
          <NavigationLink to="/drafts" title="Drafter" />

          {Constants.beta && <NavigationLink to="/users" title="Users" />}
          {Constants.playModeEnabled && (
            <NavigationLink to="/matches" title="Matches" />
          )}
          <NavigationLink to="/profile" title="Profile" />
          {Constants.beta && <NavigationLink to="/settings" title="Settings" />}
        </ul>
      </nav>
    </header>
  );
}
