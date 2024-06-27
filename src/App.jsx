import { useState } from "react";
import "./App.css";
// import Header, { tabs } from "./components/Header.jsx";
import "inter-ui/inter.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./Magic.css";
import Test from "./Test.jsx";
import "./all3.css";
import Finances from "./components/Finances/Finances.jsx";
import MagicSetCardList from "./components/Magic/MagicSetCardList.jsx";
import MagicSetList, { loader as setsLoader } from "./components/Magic/MagicSetList.jsx";
import MoxfieldDeckDetailView, { loader as moxfieldDeckDetailLoader } from "./components/Magic/MoxfieldDeckDetailView.jsx";
import MoxfieldDeckOverview, { loader as moxfieldLoader } from "./components/Magic/MoxfieldDeckOverview.jsx";
import MyDeckView from "./components/Magic/MyDeckView.jsx";
import TicketOverview from "./components/Tickets/TicketOverview.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Home from "./pages/Home.jsx";
import MagicCardSearch, {
  loader as searchCardLoader,
} from "./pages/MagicCardSearch.jsx";
import MyDecksList, {loader as myDeckViewLoader} from "./pages/MyDecksList.jsx";
import RootLayout from "./pages/RootLayout.jsx";
// import Header from "./components/Header.jsx";

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
      { path: "/sets", element: <MagicSetList />, loader: setsLoader },
      { path: "/sets/:setCode", element: <MagicSetCardList /> },
      { path: "tickets", element: <TicketOverview /> },
      { path: "/decks/moxfield", element: <MoxfieldDeckOverview />, loader: moxfieldLoader},
      {
        path: "/decks/moxfield/:publicId",
        element: <MoxfieldDeckDetailView />,
        loader: moxfieldDeckDetailLoader
      },
      { path: "/decks", element: <h1>All Public Decks</h1> },
      { path: "/decks/my", element: <MyDecksList />, loader: myDeckViewLoader },
      { path: "/decks/my/:deckId", element: <MyDeckView /> },
      { path: "test", element: <Test /> },
    ],
    // errorElement: <ErrorPage />,
  },
]);

function App() {
  const [selectedTab, setSelectedTab] = useState(null);

  let [cards, setCards] = useState([]);
  

  // function onSelectTab(tab) {
  //   setSelectedTab(tab.name);
  //   // set url
  //   window.history.pushState({}, tab.name, tab.url);
  // }

  // console.log(selectedTab);

  // if (selectedTab === null) {
  //   let url = window.location.pathname;
  //   // console.log(url);
  //   let tab = tabs.find((tab) => tab.url === url);
  //   if (tab) {
  //     setSelectedTab(tab.name);
  //   }
  // }

  // extract get parameter 'setCode' from url
  // let url = new URL(window.location.href);
  // let setCode = url.searchParams.get("setCode");

  return (
    <>
      {/* <Header onSelectTab={{}} /> */}

      <RouterProvider router={router} />
    </>
  );
  /*
  return (
    <>
      <Header onSelectTab={onSelectTab} />
      {selectedTab === "home" && ""}
      {selectedTab === "finances" && <Finances />}
      {selectedTab === "magicCardSearch" && (
        <MagicCardSearch cards={cards} setCards={setCards} />
      )}
      {selectedTab === "magicSetList" && <MagicSetList />}
      {selectedTab === "tickets" && <TicketOverview />}
      {selectedTab === "magicSetCardList" && (
        <MagicSetCardList setCode={setCode ?? "mh3"} />
      )}
      {selectedTab === "magicDeckOverview" && <MagicDeckOverview />}
      {selectedTab === "test" && <Test />}
      {selectedTab === "myDecksList" && <MyDecksList />}
    </>
  );
  */
}

export default App;
