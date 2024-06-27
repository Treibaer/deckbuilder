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
              to="magicCardSearch"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Magic Card Search
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
