import * as React from "react";

const Footer = ({ onChange }) => (
  <footer className="footer" onClick={onChange}>
    ©{` ${new Date().getFullYear()}`} SK Planet
  </footer>
);

export default Footer;
