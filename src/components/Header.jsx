import "./Header.css";

export default function Header({ selectedTab, onSelectTab }) {
  const tabs = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Finances",
      url: "/finances",
    },
    {
      name: "Magic",
      url: "/magic",
    },
    {
      name: "Demo",
      url: "/demo",
    },
  ];
  return (
    <header>
      <h1>Magic Card Viewer</h1>
      <nav>
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.name}
              onClick={() => onSelectTab(tab.name.toLowerCase())}
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
