import "./Header.css";

const tabs = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "finances",
    url: "/finances",
  },
  {
    name: "cardList",
    url: "/cardList",
  },
  {
    name: "magicSetList",
    url: "/magicSetList",
  },
  {
    name: "magicSetCardList",
    url: "/magicSetCardList",
  },
  {
    name: "magicDeckOverview",
    url: "/magicDeckOverview",
  },
];

export default function Header({ selectedTab, onSelectTab }) {
  return (
    <header>
      <nav>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              onClick={() => onSelectTab(tab.name)}
              className={selectedTab === tab.name ? "active" : ""}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
