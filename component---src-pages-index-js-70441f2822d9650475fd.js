"use strict";(self.webpackChunkskplanet_techtopic=self.webpackChunkskplanet_techtopic||[]).push([[293],{2901:function(e,t,a){var l=a(6540),n=a(4794);t.A=e=>{let{tags:t}=e;const a=["UX","UI","GUI","설계","리서치"];return l.createElement("div",{className:"tags"},t.map((e=>l.createElement(n.Link,{to:`/tag?tag=${encodeURI(e)}`,key:e},l.createElement("span",{className:a.includes(e)?"":"gray"},e)))))}},9639:function(e,t,a){a.r(t),a.d(t,{Head:function(){return u}});var l=a(6540),n=a(4794),r=a(4353),c=a.n(r),s=a(4042),i=a(7528),m=a(7845),o=a(2901);const u=()=>l.createElement(i.A,{title:"SK플래닛 TECH TOPIC"});t.default=e=>{var t;let{data:a,location:r}=e;const i=(null===(t=a.site.siteMetadata)||void 0===t?void 0:t.title)||"SK플래닛 TECH TOPIC",u=a.allMarkdownRemark.nodes;return 0===u.length?l.createElement(s.A,{location:r,title:i},l.createElement("p",null,"등록된 게시물이 없습니다.")):l.createElement(s.A,{location:r,title:i},l.createElement("ol",{className:"list",style:{listStyle:"none"}},u.map((e=>{const t=e.frontmatter.title||e.fields.slug,a=e.frontmatter.author,r=m.k[a.toLowerCase()];return l.createElement("li",{key:e.fields.slug},l.createElement("article",{className:"post-list-item",itemScope:!0,itemType:"http://schema.org/Article"},e.frontmatter.tags&&l.createElement(o.A,{tags:e.frontmatter.tags}),l.createElement("header",null,l.createElement("h2",{className:"title"},l.createElement(n.Link,{to:e.fields.slug,itemProp:"url"},l.createElement("span",{itemProp:"headline"},t)))),l.createElement("section",null,l.createElement("p",{dangerouslySetInnerHTML:{__html:e.excerpt},itemProp:"description"})),l.createElement("small",null,c()(e.frontmatter.date).format("YYYY.MM.DD")," |"," ",r.name)))}))))}}}]);
//# sourceMappingURL=component---src-pages-index-js-70441f2822d9650475fd.js.map