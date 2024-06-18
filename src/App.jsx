import { useState } from "react";
import "./App.css";
import MagicCardList from "./components/Magic/MagicCardList.jsx";
import CountView from "./components/CountView.jsx";
import Header from "./components/Header.jsx";
import Finances from "./components/Finances/Finances.jsx";

function App() {
  const [selectedTab, setSelectedTab] = useState("finances");

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
      { selectedTab === "magic" && <MagicCardList cards={cards} setCards={setCards} />}
      { selectedTab === "demo" && <CountView />}
    </>
  );
}

export default App;
