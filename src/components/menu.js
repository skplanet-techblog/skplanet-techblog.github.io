import * as React from "react";
import { Link } from "gatsby";
import facebook_1x from "../images/facebook_1x.png";
import facebook_4x from "../images/facebook_4x.png";

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
      <a 
        href="https://facebook.com/readme.skp"
        target="_blank"
        rel="noreferrer"
      >
        <img 
          srcSet={`${facebook_1x} 36w, ${facebook_4x} 144w`}
          sizes={`(max-width: 419px) 20px, 36px`}
          src={facebook_4x} alt="facebook" 
        />
      </a>
    </div>
  );
};

export default Menu;
