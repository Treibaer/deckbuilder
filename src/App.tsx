// import "inter-ui/inter.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

// comopnents
import CardDetailView, {
  loader as cardDetailLoader,
} from "./pages/CardDetailView";
import MoxfieldDeckDetailView, {
  loader as moxfieldDeckDetailLoader,
} from "./pages/MoxfieldDeckDetailView";
import MoxfieldDeckOverview, {
  loader as moxfieldLoader,
} from "./pages/MoxfieldDecksList";
import MyDeckDetailView, {
  loader as myDeckViewLoader,
} from "./pages/MyDeckDetailView";
import SetList, { loader as setsLoader } from "./pages/SetList";

// Pages
import DraftView, { loader as draftViewLoader } from "./pages/DraftList";
import Home from "./pages/Home";
import Matches, { loader as matchesLoader } from "./pages/Matches";
import MyDecksList, { loader as myDecksListLoader } from "./pages/MyDecksList";
import PlaytestHistory, {
  loader as playtestHistoryLoader,
} from "./pages/PlaytestHistory";
import Profile from "./pages/Profile";
import RootLayout from "./pages/RootLayout";
import SearchView, { loader as searchCardLoader } from "./pages/SearchView";
import Settings from "./pages/Settings";
import Users, { loader as usersLoader } from "./pages/Users";
import Logout from "./pages/Logout";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/search",
        element: <SearchView />,
        loader: searchCardLoader,
      },
      {
        path: "/cards/:cardId",
        element: <CardDetailView />,
        loader: cardDetailLoader,
      },
      { path: "/sets", element: <SetList />, loader: setsLoader },
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
      { path: "/drafts", element: <DraftView />, loader: draftViewLoader },
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
      { path: "/matches", element: <Matches />, loader: matchesLoader },
      { path: "/profile", element: <Profile /> },
      {
        path: "/profile/playtests",
        element: <PlaytestHistory />,
        loader: playtestHistoryLoader,
      },
      { path: "/settings", element: <Settings /> },
    ],
    // errorElement: <ErrorPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
