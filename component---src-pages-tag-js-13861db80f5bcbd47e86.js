(self.webpackChunkskplanet_techtopic=self.webpackChunkskplanet_techtopic||[]).push([[221],{7484:function(t){t.exports=function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",a="hour",o="day",u="week",c="month",l="quarter",h="year",f="date",d="Invalid Date",m=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,$=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,p={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},g=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},y={s:g,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+g(r,2,"0")+":"+g(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,a=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:u,d:o,D:f,h:a,m:s,s:i,ms:r,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},M="en",v={};v[M]=p;var D=function(t){return t instanceof O},S=function t(e,n,r){var i;if(!e)return M;if("string"==typeof e){var s=e.toLowerCase();v[s]&&(i=s),n&&(v[s]=n,i=s);var a=e.split("-");if(!i&&a.length>1)return t(a[0])}else{var o=e.name;v[o]=e,i=o}return!r&&i&&(M=i),i||!r&&M},w=function(t,e){if(D(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new O(n)},b=y;b.l=S,b.i=D,b.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var O=function(){function p(t){this.$L=S(t.locale,null,!0),this.parse(t)}var g=p.prototype;return g.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(m);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},g.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},g.$utils=function(){return b},g.isValid=function(){return!(this.$d.toString()===d)},g.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},g.isAfter=function(t,e){return w(t)<this.startOf(e)},g.isBefore=function(t,e){return this.endOf(e)<w(t)},g.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},g.unix=function(){return Math.floor(this.valueOf()/1e3)},g.valueOf=function(){return this.$d.getTime()},g.startOf=function(t,e){var n=this,r=!!b.u(e)||e,l=b.p(t),d=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(o)},m=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},$=this.$W,p=this.$M,g=this.$D,y="set"+(this.$u?"UTC":"");switch(l){case h:return r?d(1,0):d(31,11);case c:return r?d(1,p):d(0,p+1);case u:var M=this.$locale().weekStart||0,v=($<M?$+7:$)-M;return d(r?g-v:g+(6-v),p);case o:case f:return m(y+"Hours",0);case a:return m(y+"Minutes",1);case s:return m(y+"Seconds",2);case i:return m(y+"Milliseconds",3);default:return this.clone()}},g.endOf=function(t){return this.startOf(t,!1)},g.$set=function(t,e){var n,u=b.p(t),l="set"+(this.$u?"UTC":""),d=(n={},n[o]=l+"Date",n[f]=l+"Date",n[c]=l+"Month",n[h]=l+"FullYear",n[a]=l+"Hours",n[s]=l+"Minutes",n[i]=l+"Seconds",n[r]=l+"Milliseconds",n)[u],m=u===o?this.$D+(e-this.$W):e;if(u===c||u===h){var $=this.clone().set(f,1);$.$d[d](m),$.init(),this.$d=$.set(f,Math.min(this.$D,$.daysInMonth())).$d}else d&&this.$d[d](m);return this.init(),this},g.set=function(t,e){return this.clone().$set(t,e)},g.get=function(t){return this[b.p(t)]()},g.add=function(r,l){var f,d=this;r=Number(r);var m=b.p(l),$=function(t){var e=w(d);return b.w(e.date(e.date()+Math.round(t*r)),d)};if(m===c)return this.set(c,this.$M+r);if(m===h)return this.set(h,this.$y+r);if(m===o)return $(1);if(m===u)return $(7);var p=(f={},f[s]=e,f[a]=n,f[i]=t,f)[m]||1,g=this.$d.getTime()+r*p;return b.w(g,this)},g.subtract=function(t,e){return this.add(-1*t,e)},g.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||d;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,a=this.$m,o=this.$M,u=n.weekdays,c=n.months,l=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},h=function(t){return b.s(s%12||12,t,"0")},f=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:b.s(o+1,2,"0"),MMM:l(n.monthsShort,o,c,3),MMMM:l(c,o),D:this.$D,DD:b.s(this.$D,2,"0"),d:String(this.$W),dd:l(n.weekdaysMin,this.$W,u,2),ddd:l(n.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(s),HH:b.s(s,2,"0"),h:h(1),hh:h(2),a:f(s,a,!0),A:f(s,a,!1),m:String(a),mm:b.s(a,2,"0"),s:String(this.$s),ss:b.s(this.$s,2,"0"),SSS:b.s(this.$ms,3,"0"),Z:i};return r.replace($,(function(t,e){return e||m[t]||i.replace(":","")}))},g.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},g.diff=function(r,f,d){var m,$=b.p(f),p=w(r),g=(p.utcOffset()-this.utcOffset())*e,y=this-p,M=b.m(this,p);return M=(m={},m[h]=M/12,m[c]=M,m[l]=M/3,m[u]=(y-g)/6048e5,m[o]=(y-g)/864e5,m[a]=y/n,m[s]=y/e,m[i]=y/t,m)[$]||y,d?M:b.a(M)},g.daysInMonth=function(){return this.endOf(c).$D},g.$locale=function(){return v[this.$L]},g.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},g.clone=function(){return b.w(this.$d,this)},g.toDate=function(){return new Date(this.valueOf())},g.toJSON=function(){return this.isValid()?this.toISOString():null},g.toISOString=function(){return this.$d.toISOString()},g.toString=function(){return this.$d.toUTCString()},p}(),E=O.prototype;return w.prototype=E,[["$ms",r],["$s",i],["$m",s],["$H",a],["$W",o],["$M",c],["$y",h],["$D",f]].forEach((function(t){E[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,O,w),t.$i=!0),w},w.locale=S,w.isDayjs=D,w.unix=function(t){return w(1e3*t)},w.en=v[M],w.Ls=v,w.p={},w}()},9187:function(t,e,n){"use strict";var r=n(7294),i=n(1883);e.Z=t=>{let{tags:e}=t;const n=["UX","UI","GUI","설계","리서치"];return r.createElement("div",{className:"tags"},e.map((t=>r.createElement(i.Link,{to:"/tag?tag="+t,key:t},r.createElement("span",{className:n.includes(t)?"":"gray"},t)))))}},2582:function(t,e,n){"use strict";n.d(e,{x:function(){return r}});const r={jayoon:{name:"공자윤",team:"Biz플랫폼개발팀",description:"글쓰기를 좋아하는 프론트엔드 개발자입니다.",thumbnail:n.p+"static/jayoon-d5c764119394a065460a4c01aa4969a5.jpg",link:"https://jayoon-kong.github.io"},hdy:{name:"한대영",team:"블록체인플랫폼개발팀",description:"블록체인 기술과 Web3를 탐험 중인 개발자입니다.",thumbnail:n.p+"static/hdy-74e98db0449a3842ec29206955a1c2be.png"},neotf:{name:"NEO TF",team:"NEO TF",description:"TechTopic 기술블로그를 운영하고 있습니다.",thumbnail:n.p+"static/neotf-07262702af79c582e9f8424ce529c7d1.png"},hyuna:{name:"최현아",team:"Solution UX팀",description:"UX Designer",thumbnail:n.p+"static/hyuna-e859d3f3422c29587df7bebce4a3a4a1.png"}}},6976:function(t,e,n){"use strict";n.r(e),n.d(e,{Head:function(){return h}});var r=n(7294),i=n(1883),s=n(7484),a=n.n(s),o=n(4691),u=n(9357),c=n(2582),l=n(9187);const h=()=>r.createElement(u.Z,{title:"Tech"});e.default=t=>{var e;let{data:n,location:s}=t;const{search:u}=s,h=null==u?void 0:u.replace("?tag=",""),f=(null===(e=n.site.siteMetadata)||void 0===e?void 0:e.title)||"SK플래닛 TechTopic",d=n.allMarkdownRemark.nodes.filter((t=>t.frontmatter.tags.includes(h)));return 0===d.length?r.createElement(o.Z,{location:s,title:f},r.createElement("p",null,'No blog posts found. Add markdown posts to "content/blog" (or the directory you specified for the "gatsby-source-filesystem" plugin in gatsby-config.js).')):r.createElement(o.Z,{location:s,title:f},r.createElement("div",{className:"tag-box"},r.createElement("h1",null,h)),r.createElement("ol",{style:{listStyle:"none"}},d.map((t=>{const e=t.frontmatter.title||t.fields.slug,n=t.frontmatter.author,s=c.x[n.toLowerCase()];return r.createElement("li",{key:t.fields.slug},r.createElement("article",{className:"post-list-item",itemScope:!0,itemType:"http://schema.org/Article"},t.frontmatter.tags&&r.createElement(l.Z,{tags:t.frontmatter.tags}),r.createElement("header",null,r.createElement("h2",{className:"title"},r.createElement(i.Link,{to:t.fields.slug,itemProp:"url"},r.createElement("span",{itemProp:"headline"},e)))),r.createElement("section",null,r.createElement("p",{dangerouslySetInnerHTML:{__html:t.excerpt},itemProp:"description"})),r.createElement("small",null,a()(t.frontmatter.date).format("YYYY.MM.DD")," |"," ",s.name)))}))))}}}]);
//# sourceMappingURL=component---src-pages-tag-js-13861db80f5bcbd47e86.js.map