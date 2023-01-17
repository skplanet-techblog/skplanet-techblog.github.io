import * as React from "react";
import { Link } from "gatsby";
import Menu from "./menu";
import logo from "../images/logo.png";

const Header = ({ title }) => (
  <header className="global-header">
    <div className="main-heading">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <Link to="/">{title}</Link>
      </div>
      <Menu />
    </div>
  </header>
);

export default Header;
