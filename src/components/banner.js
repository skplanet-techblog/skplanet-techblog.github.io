import * as React from "react";
import mobile_banner from "../images/banner_mobile_2x.png";
import tab_banner from "../images/banner_800_2x.png";
import pc_banner from "../images/banner_1200_2x.png";
import full_banner from "../images/banner_full_2x.png";

const Banner = () => (
  <div className="banner">
    <img src={mobile_banner} alt="mobile_banner" className="mobile" />
    <img src={tab_banner} alt="tab_banner" className="tab" />
    <img src={pc_banner} alt="pc_banner" className="pc" />
    <img src={full_banner} alt="full_banner" className="full" />
  </div>
);

export default Banner;
