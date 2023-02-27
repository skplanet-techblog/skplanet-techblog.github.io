import * as React from "react";
import { Link, graphql } from "gatsby";
import dayjs from "dayjs";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { MEMBERS } from "../members";
import TagList from "../components/tagList";

const Tag = ({ data, location }) => {
  const { search } = location;
  const tagName = search?.replace("?tag=", "");

  const siteTitle = data.site.siteMetadata?.title || `SK플래닛 TechTopic`;
  const posts = data.allMarkdownRemark.nodes.filter((item) =>
    item.frontmatter.tags.includes(tagName)
  );

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div className="tag-box">
        <h1>{tagName}</h1>
      </div>
      <ol style={{ listStyle: `none` }}>
        {posts.map((post) => {
          const title = post.frontmatter.title || post.fields.slug;
          const author = post.frontmatter.author;
          const member = MEMBERS[author.toLowerCase()];

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                {post.frontmatter.tags && (
                  <TagList tags={post.frontmatter.tags} />
                )}
                <header>
                  <h2 className="title">
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
                <small>
                  {dayjs(post.frontmatter.date).format("YYYY.MM.DD")} |{" "}
                  {member.name}
                </small>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export const Head = () => {
  return <Seo title="Tech" />;
};

export default Tag;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          author
          description
          tags
        }
      }
    }
  }
`;
