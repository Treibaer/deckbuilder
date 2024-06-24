import { useState } from "react";
import "./App.css";
import MagicCardList from "./components/Magic/MagicCardList.jsx";
import Header from "./components/Header.jsx";
import Finances from "./components/Finances/Finances.jsx";
import TicketOverview from "./components/tickets/TicketOverview.jsx";
import "inter-ui/inter.css";
import "./all3.css";
import MagicSetCardList from "./components/Magic/MagicSetCardList.jsx";
import MagicDeckOverview from "./components/Magic/MagicDeckOverview.jsx";
import MagicSetList from "./components/Magic/MagicSetList.jsx";

function App() {
  const [selectedTab, setSelectedTab] = useState("magicDeckOverview");

  let [cards, setCards] = useState([]);
  
  function onSelectTab(tab) {
    setSelectedTab(tab);
  }

  return (
    <>
      <Header onSelectTab={onSelectTab} />
      { selectedTab === "home" && ""}
      { selectedTab === "finances" && <Finances />}
      { selectedTab === "cardList" && <MagicCardList cards={cards} setCards={setCards} />}
      { selectedTab === "magicSetList" && <MagicSetList />}
      { selectedTab === "tickets" && <TicketOverview />}
      { selectedTab === "magicSetCardList" && <MagicSetCardList />}
      { selectedTab === "magicDeckOverview" && <MagicDeckOverview />}
    </>
  );
}

export default App;
