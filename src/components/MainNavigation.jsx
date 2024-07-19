import { Link, NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

export default function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/sets"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Sets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/decks/moxfield"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Moxfield Decks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/decks/my"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              My Decks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/matches"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Matches
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Settings
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="finances"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Finances
            </NavLink>
          </li>
          <li>
            <NavLink
              to="test"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Test
            </NavLink>
          </li>
          <li>
            <NavLink
              to="tickets"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Tickets
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
