import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

const Culture = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title;

  return (
    <Layout location={location} title={siteTitle}>
      <div>빈 페이지입니다.</div>
    </Layout>
  );
};

export const Head = () => {
  return <Seo title="Culture" />;
};

export default Culture;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
