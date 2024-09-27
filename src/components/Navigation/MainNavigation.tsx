import Constants from "../../Services/Constants";
import NavigationLink from "./NavigationLink";

const MainNavigation = () => {
  return (
    <header className="select-none p-8 justify-center flex">
      <nav>
        <ul className="flex gap-4 list flex-wrap">
          <NavigationLink to="/" title="Home" />
          <NavigationLink to="/search" title="Search" />
          <NavigationLink to="/sets" title="Sets" />
          <NavigationLink to="/decks/moxfield" title="Moxfield" />
          <NavigationLink to="/decks/my" title="Decks" />
          <NavigationLink to="/decks/favorites" title="Favorites" />
          {/* <NavigationLink to="/drafts" title="Drafter" /> */}

          {/* {Constants.beta && <NavigationLink to="/users" title="Users" />} */}
          {Constants.playModeEnabled && (
            <NavigationLink to="/matches" title="Matches" />
          )}
          {Constants.beta && <NavigationLink to="/settings" title="Settings" />}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
