/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
// gatsby-ssr.js
const React = require("react");

exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  // HTML lang 속성 설정
  setHtmlAttributes({ lang: `en` });

  // meta viewport 삽입 (접근성 기준 준수)
  setHeadComponents([
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />,
  ]);
};