import { useState } from "react";
import "./App.css";
import MagicCardList from "./components/Magic/MagicCardList.jsx";
import CountView from "./components/CountView.jsx";
import Header from "./components/Header.jsx";
import Finances from "./components/Finances/Finances.jsx";
import MagicCardSet from "./components/Magic/MagicCardSet.jsx";
import TicketOverview from "./components/tickets/TicketOverview.jsx";
import "inter-ui/inter.css";
import "./all3.css";
import MagicSetCardList from "./components/Magic/MagicSetCardList.jsx";
import MagicDeckOverview from "./components/Magic/MagicDeckOverview.jsx";

function App() {
  const [selectedTab, setSelectedTab] = useState("magicDeckOverview");

  let [cards, setCards] = useState([]);
  

  function onSelectTab(tab) {
    setSelectedTab(tab);
    console.log(tab);
  }

  return (
    <>
      <Header onSelectTab={onSelectTab} />
      { selectedTab === "home" && ""}
      { selectedTab === "finances" && <Finances />}
      { selectedTab === "cardList" && <MagicCardList cards={cards} setCards={setCards} />}
      { selectedTab === "cardSet" && <MagicCardSet />}
      { selectedTab === "demo" && <CountView />}
      { selectedTab === "tickets" && <TicketOverview />}
      { selectedTab === "magicSetCards" && <MagicSetCardList />}
      { selectedTab === "magicDeckOverview" && <MagicDeckOverview />}
    </>
  );
}

export default App;
