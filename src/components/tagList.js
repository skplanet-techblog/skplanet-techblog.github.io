import * as React from 'react';
import { Link } from "gatsby";

const TagList = ({ tags }) => {
  //const UXTagList = ['UX', 'UI', 'GUI', '설계', '리서치'];
const UXTagList = ['AI', 'GenAI', 'AI Coding', '생성형AI', 'Frontend', 'Backend', 'QA', 'DevOps', 'Data Engineering', 'Web3', 'AI/ML', 'Cloud Eng.', 'Media', 'Search', 'UX/UI', 'DevRel', 'TechBlog', 'TechCon'];
  return (
    <div className="tags">
      {tags.map(tag => (
        <Link to={`/tag?tag=${encodeURI(tag)}`} key={tag}>
          <span className={UXTagList.includes(tag) ? '' : 'gray'}>{tag}</span>
        </Link>
      ))}
    </div>
  );
};

export default TagList;