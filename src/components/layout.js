import * as React from "react";
import Header from "./header";
import Footer from "./footer";
import Banner from "./banner";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  const [changed, setChanged] = React.useState(false);

  const handleChange = () => {
    setChanged(!changed);
  };

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Header title={title} location={location} />
      {isRootPath && <Banner changed={changed} />}
      <main>{children}</main>
      <Footer onChange={handleChange} />
    </div>
  );
};

export default Layout;
