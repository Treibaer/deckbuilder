import "./Header.css";

export default function Header({ selectedTab, onSelectTab }) {
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
      name: "cardSet",
      url: "/cardSet",
    },
    {
      name: "magicSetCards",
      url: "/magicSetCards",
    },
    {
      name: "magicDeckOverview",
      url: "/magicDeckOverview",
    },
  ];
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
