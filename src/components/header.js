import * as React from "react";
import { Link } from "gatsby";
import Menu from "./menu";
import logo from "../images/logo.png";

const Header = ({ title }) => (
  <header className="global-header">
    <div className="main-heading">
      <div className="logo">
        <a href="https://www.skplanet.com/" target="_blank" rel="noreferrer">
          <img src={logo} alt="logo" />
        </a>
        <Link to="/">{title}</Link>
      </div>
      <Menu />
    </div>
  </header>
);

export default Header;
