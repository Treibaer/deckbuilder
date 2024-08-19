import "inter-ui/inter.css";
import "./App.css";
import "./Magic.css";
import "./all3.css";
import "./extensions/String.js";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

// comopnents
import CardDetailView, {
  loader as cardDetailLoader,
} from "./pages/CardDetailView.jsx";
import MagicSetList, {
  loader as setsLoader,
} from "./pages/MagicSetList.jsx";
import MoxfieldDeckDetailView, {
  loader as moxfieldDeckDetailLoader,
} from "./pages/MoxfieldDeckDetailView.jsx";
import MoxfieldDeckOverview, {
  loader as moxfieldLoader,
} from "./pages/MoxfieldDecksList.jsx";
import MyDeckDetailView, {
  loader as myDeckViewLoader,
} from "./pages/MyDeckDetailView.jsx";

// Pages
import DraftView, {
  loader as draftViewLoader,
} from "./pages/DraftList.jsx";
import Home from "./pages/Home.jsx";
import MagicCardSearch, {
  loader as searchCardLoader,
} from "./pages/MagicCardSearch.jsx";
import Matches from "./pages/Matches.jsx";
import MyDecksList, {
  loader as myDecksListLoader,
} from "./pages/MyDecksList.jsx";
import PlaytestHistory from "./pages/PlaytestHistory.jsx";
import Profile from "./pages/Profile.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import Settings from "./pages/Settings.jsx";
import Users, { loader as usersLoader } from "./pages/Users.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/search",
        element: <MagicCardSearch />,
        loader: searchCardLoader,
      },
      {
        path: "/cards/:cardId",
        element: <CardDetailView />,
        loader: cardDetailLoader,
      },
      { path: "/sets", element: <MagicSetList />, loader: setsLoader },
      {
        path: "/decks/moxfield",
        element: <MoxfieldDeckOverview />,
        loader: moxfieldLoader,
      },
      {
        path: "/decks/moxfield/:publicId",
        element: <MoxfieldDeckDetailView />,
        loader: moxfieldDeckDetailLoader,
      },
      { path: "/drafts", element:  <DraftView />, loader: draftViewLoader },
      { path: "/decks", element: <h1>All Public Decks</h1> },
      {
        path: "/decks/my",
        element: <MyDecksList />,
        loader: myDecksListLoader,
      },
      {
        path: "/decks/my/:deckId",
        element: <MyDeckDetailView />,
        loader: myDeckViewLoader,
      },
      { path: "/users", element: <Users />, loader: usersLoader },
      { path: "/matches", element: <Matches /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/playtests", element: <PlaytestHistory /> },
      { path: "/settings", element: <Settings /> },
    ],
    // errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
