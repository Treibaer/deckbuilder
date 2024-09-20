import { NavLink } from "react-router-dom";

const NavigationLink: React.FC<{
  to: string;
  title: string;
}> = ({ to, title }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => (isActive ? "active" : undefined)}
        end
      >
        {title}
      </NavLink>
    </li>
  );
};

export default NavigationLink;
