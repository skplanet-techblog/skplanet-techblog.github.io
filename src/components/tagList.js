import * as React from 'react';
import { Link } from "gatsby";

const TagList = ({ tags }) => {
  const UXTagList = ['UX', 'UI', 'GUI', '설계', '리서치'];
  return (
    <div className="tags">
      {tags.map(tag => (
        <Link to={`/tag?tag=${tag}`} key={tag}>
          <span className={UXTagList.includes(tag) ? '' : 'gray'}>{tag}</span>
        </Link>
      ))}
    </div>
  );
};

export default TagList;