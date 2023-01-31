import * as React from "react";
import { Link } from "gatsby";

const Menu = ({ location }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const { pathname } = location;

  const isRootPath = pathname === rootPath;

  return (
    <div className="menu">
      <Link to="/" className={isRootPath ? "active" : ""}>
        Tech
      </Link>
      <a
        href="https://careers.skplanet.com/home"
        target="_blank"
        rel="noreferrer"
      >
        Recruit
      </a>
    </div>
  );
};

export default Menu;
