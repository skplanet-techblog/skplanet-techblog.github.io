/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
const React = require("react");

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents, getPostBodyComponents, replacePostBodyComponents }) => {
  const headComponents = getHeadComponents();
  const postBodyComponents = getPostBodyComponents();

  // 예: 불필요한 class=""를 제거하는 예시 (필요시 확장)
  const clean = component => {
    if (
      typeof component === "object" &&
      component.props &&
      component.props.className === ""
    ) {
      delete component.props.className;
    }
    return component;
  };

  replaceHeadComponents(headComponents.map(clean));
  replacePostBodyComponents(postBodyComponents.map(clean));
};


exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: "en" });

  setHeadComponents([
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />,
  ]);
};