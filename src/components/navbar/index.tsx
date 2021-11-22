import { NavLink } from "react-router-dom";
import { LinksWrapper, NavWrapper } from "./style";

let links: Array<{ to: string; text: string }> = [
  { to: "/partners", text: "Партнеры" },
  { to: "/products", text: "Продукты" },
  { to: "/audit", text: "Аудит изменений" },
];

export const Navbar: React.FC = () => {
  return (
    <nav className={"app-grid__item"}>
      <NavWrapper>
        <LinksWrapper>
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              activeClassName={"active"}
              exact
            >
              {item.text}
            </NavLink>
          ))}
        </LinksWrapper>
      </NavWrapper>
    </nav>
  );
};
