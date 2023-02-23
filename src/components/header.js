import * as React from "react";
import { Link } from "gatsby";
import Menu from "./menu";

const Header = ({ title, location }) => (
  <header className="global-header">
    <div className="main-heading">
      <div className="logo">
        <Link to="/">TECH TOPIC</Link>
      </div>
      <Menu location={location} />
    </div>
  </header>
);

export default Header;
