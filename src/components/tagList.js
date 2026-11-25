import * as React from 'react';
import { Link } from "gatsby";

const TagList = ({ tags, primaryTags }) => {
  //const UXTagList = ['UX', 'UI', 'GUI', '설계', '리서치'];
const UXTagList = ['AI', 'GenAI', 'AI Coding', '생성형AI', 'Frontend', 'Backend', 'QA', 'DevOps', 'Data Engineering', 'Web3', 'AI/ML', 'Cloud Eng.', 'Media', 'Search', 'UX/UI', '개발문화', 'DevRel', 'TechBlog', 'TechCon'];
  // primaryTags가 있으면 그 글의 핵심 태그(최대 2개)만 강조하고, 없으면 기존처럼 공식 태그 목록 기준으로 강조한다.
  const primary = primaryTags && primaryTags.length ? primaryTags.slice(0, 2) : null;
  const isHighlighted = tag => (primary ? primary.includes(tag) : UXTagList.includes(tag));
  return (
    <div className="tags">
      {tags.map(tag => (
        <Link to={`/tag?tag=${encodeURI(tag)}`} key={tag}>
          <span className={isHighlighted(tag) ? '' : 'gray'}>{tag}</span>
        </Link>
      ))}
    </div>
  );
};

export default TagList;