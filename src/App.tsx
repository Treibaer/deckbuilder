// import "inter-ui/inter.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";

// comopnents
import CardDetailPage, {
  loader as cardDetailLoader,
} from "./pages/CardDetailPage";
import MoxfieldDecksListPage, {
  loader as moxfieldDeckDetailLoader,
} from "./pages/MoxfieldDeckDetailPage";
import MoxfieldDeckOverview, {
  loader as moxfieldLoader,
} from "./pages/MoxfieldDecksListPage";
import CustomDeckDetailPage, {
  loader as myDeckViewLoader,
} from "./pages/CustomDeckDetailPage.tsx";
import CardSetsListPage, { loader as setsLoader } from "./pages/CardSetsListPage.tsx";

// Pages
import DraftView, { loader as draftViewLoader } from "./pages/DraftList";
import Favorites, { loader as favoritesLoader } from "./pages/FavoritesPage";
import Home from "./pages/HomePage";
import Imports, { loader as importLoader } from "./pages/Imports";
import Logout from "./pages/Logout";
import MatchDetailPage from "./pages/MatchDetailPage.tsx";
import MatchesListPage, { loader as matchesLoader } from "./pages/MatchesListPage";
import CustomDecksListPage, { loader as myDecksListLoader } from "./pages/CustomDecksListPage.tsx";
import DeckPlaytestPage from "./pages/DeckPlaytestPage.tsx";
import PlaytestsListPage, {
  loader as playtestHistoryLoader,
} from "./pages/PlaytestsListPage.tsx";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RootLayout from "./pages/RootLayout";
import CardSearchPage, { loader as searchCardLoader } from "./pages/CardSearchPage.tsx";
import Settings from "./pages/Settings";
import Users, { loader as usersLoader } from "./pages/Users";
import Sockets from "./pages/Sockets.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/search",
        element: <CardSearchPage />,
        loader: searchCardLoader,
      },
      {
        path: "/cards/:cardId",
        element: <CardDetailPage />,
        loader: cardDetailLoader,
      },
      { path: "/sets", element: <CardSetsListPage />, loader: setsLoader },
      {
        path: "/decks/moxfield",
        element: <MoxfieldDeckOverview />,
        loader: moxfieldLoader,
      },
      {
        path: "/decks/moxfield/:publicId",
        element: <MoxfieldDecksListPage />,
        loader: moxfieldDeckDetailLoader,
      },
      { path: "/drafts", element: <DraftView />, loader: draftViewLoader },
      { path: "/decks", element: <h1>All Public Decks</h1> },
      {
        path: "/decks/my",
        element: <CustomDecksListPage />,
        loader: myDecksListLoader,
      },
      {
        path: "/decks/my/:deckId",
        element: <CustomDeckDetailPage />,
        loader: myDeckViewLoader,
      },
      { path: "/users", element: <Users />, loader: usersLoader },
      { path: "/profile", element: <Profile /> },
      { path: "/imports", element: <Imports />, loader: importLoader },
      {
        path: "/playtests",
        element: <PlaytestsListPage />,
        loader: playtestHistoryLoader,
      },
      { path: "/playtests/:playtestId", element: <DeckPlaytestPage /> },
      { path: "/settings", element: <Settings /> },
      { path: "/matches", element: <MatchesListPage />, loader: matchesLoader },
      { path: "/matches/:matchId", element: <MatchDetailPage /> },
      { path: "/decks/favorites", element: <Favorites />, loader: favoritesLoader },
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
