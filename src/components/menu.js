import * as React from "react";
import { Link } from "gatsby";

const Menu = () => (
  <div className="menu">
    <Link to="/culture">Culture</Link>
    <Link to="/">Tech</Link>
    <a
      href="https://careers.skplanet.com/home"
      target="_blank"
      rel="noreferrer"
    >
      Recruit
    </a>
  </div>
);

export default Menu;
