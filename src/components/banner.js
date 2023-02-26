import * as React from "react";
import mobileBanner_1x from "../images/banner_mobile_1x.png";
import mobileBanner_2x from "../images/banner_mobile_2x.png";
import banner from "../images/banner_1200.png";
import fullBanner from "../images/banner_full.png";

const Banner = () => (
  <div className="banner">
    <img 
      srcSet={`${mobileBanner_1x} 312w, ${mobileBanner_2x} 624w, ${banner} 929w, ${banner} 929w, ${fullBanner} 1150w`}
      sizes={`(max-width: 450px) calc(100vw - 3rem), (max-width: 800px) calc(100vw - 3rem), (max-width: 1200px) 800px, (max-width: 1600px) 929px, 1150px`}
      src={fullBanner} alt="banner" 
    />
  </div>
);

export default Banner;
