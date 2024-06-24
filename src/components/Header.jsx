import "./Header.css";

export const tabs = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "finances",
    url: "/finances",
  },
  {
    name: "magicCardSearch",
    url: "/magicCardSearch",
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
              onClick={() => onSelectTab(tab)}
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
