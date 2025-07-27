import * as React from "react";
import Header from "./header";
import Footer from "./footer";
import MainTitle from "./mainTitle";
import Banner from "./banner";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <Header title={title} location={location} />
      <main>
        {isRootPath && 
          <>
            <MainTitle />
            <Banner />
          </>
        } 
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
