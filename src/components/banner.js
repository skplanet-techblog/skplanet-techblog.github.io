import * as React from "react";

const Banner = ({ location }) => {
  const { search } = location;
  const isBlueBanner = search.includes("banner");

  return (
    <div className={isBlueBanner ? "banner-blue" : "banner"}>
      <div className="text">
        SK플래닛 구성원의
        <br />
        Data, Tech, UX 이야기가 담겨 있는
        <br />
        SK플래닛 테크 블로그입니다.
      </div>
    </div>
  );
};

export default Banner;
