import { useState } from "react";
import "./App.css";
// import Header, { tabs } from "./components/Header.jsx";
import "inter-ui/inter.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./Magic.css";
import Test from "./Test.jsx";
import "./all3.css";
import Finances from "./components/Finances/Finances.jsx";
import MagicSetCardList, {
  loader as setDetailsLoader,
} from "./components/Magic/MagicSetCardList.jsx";
import MagicSetList, {
  loader as setsLoader,
} from "./components/Magic/MagicSetList.jsx";
import MoxfieldDeckDetailView, {
  loader as moxfieldDeckDetailLoader,
} from "./components/Magic/MoxfieldDeckDetailView.jsx";
import MoxfieldDeckOverview, {
  loader as moxfieldLoader,
} from "./components/Magic/MoxfieldDeckOverview.jsx";
import MyDeckView, {loader as myDeckViewLoader} from "./components/Magic/MyDeckView.jsx";
import TicketOverview from "./components/Tickets/TicketOverview.jsx";
import Home from "./pages/Home.jsx";
import MagicCardSearch, {
  loader as searchCardLoader,
} from "./pages/MagicCardSearch.jsx";
import MyDecksList, {
  loader as myDecksListLoader,
} from "./pages/MyDecksList.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import CardDetailView from "./components/Magic/CardDetailView.jsx";
import "./extensions/String.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "finances", element: <Finances /> },
      {
        path: "magicCardSearch",
        element: <MagicCardSearch />,
        loader: searchCardLoader,
      },
      { path: "/cards/:cardId", element: <CardDetailView /> },
      { path: "/sets", element: <MagicSetList />, loader: setsLoader },
      {
        path: "/sets/:setCode",
        element: <MagicSetCardList />,
        loader: setDetailsLoader,
      },
      { path: "tickets", element: <TicketOverview /> },
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
      { path: "/decks", element: <h1>All Public Decks</h1> },
      { path: "/decks/my", element: <MyDecksList />, loader: myDecksListLoader },
      { path: "/decks/my/:deckId", element: <MyDeckView />, loader: myDeckViewLoader},
      { path: "test", element: <Test /> },
    ],
    // errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
