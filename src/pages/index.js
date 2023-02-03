import * as React from "react";
import { Link, graphql } from "gatsby";
import dayjs from "dayjs";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { MEMBERS } from "../members";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `SK플래닛 TechTopic`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>등록된 게시물이 없습니다.</p>
      </Layout>
    );
  }

  return (
    <Layout location={location} title={siteTitle}>
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
                  <div className="tags">
                    {post.frontmatter.tags.map((tag) => (
                      <Link to={`/tag?tag=${tag}`} key={tag}>
                        <span>{tag}</span>
                      </Link>
                    ))}
                  </div>
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

export default BlogIndex;

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
          description
          author
          tags
        }
      }
    }
  }
`;
