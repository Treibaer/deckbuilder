import { useState } from "react";
import "./App.css";
import Header, { tabs } from "./components/Header.jsx";
import Finances from "./components/Finances/Finances.jsx";
import TicketOverview from "./components/tickets/TicketOverview.jsx";
import MagicSetCardList from "./components/Magic/MagicSetCardList.jsx";
import MagicDeckOverview from "./components/Magic/MagicDeckOverview.jsx";
import MagicSetList from "./components/Magic/MagicSetList.jsx";
import MagicCardSearch from "./components/Magic/MagicCardSearch.jsx";
import "inter-ui/inter.css";
import "./all3.css";
import "./Magic.css";

function App() {
  const [selectedTab, setSelectedTab] = useState(null);

  let [cards, setCards] = useState([]);

  function onSelectTab(tab) {
    setSelectedTab(tab.name);
    // set url
    window.history.pushState({}, tab.name, tab.url);
  }

  console.log(selectedTab);

  if (selectedTab === null) {
    let url = window.location.pathname;
    // console.log(url);
    let tab = tabs.find((tab) => tab.url === url);
    if (tab) {
      setSelectedTab(tab.name);
    }
  }

  // extract get parameter 'setCode' from url
  let url = new URL(window.location.href);
  let setCode = url.searchParams.get("setCode");

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
    </>
  );
}

export default App;
