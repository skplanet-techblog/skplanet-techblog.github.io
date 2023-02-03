import * as React from "react";

const Banner = ({ changed }) => (
  <div className={changed ? "banner-blue" : "banner"}>
    <div className="text">
      SK플래닛 구성원의
      <br />
      다양한 기술 활동을 외부에 공유하여
      <br />
      함께 성장하고자 만든 기술 블로그입니다.
    </div>
  </div>
);

export default Banner;
