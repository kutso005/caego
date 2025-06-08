import React from "react";
import Section from "./Section";
import AboutUs from "./AboutUs";
import OurService from "./OurService";
import WhyUs from "./WhyUs";
import HowWork from "./HowWork";
import News from "./News";
export default function Main() {
  return (
    <div>
      <Section />
      <AboutUs />
      <OurService />
      <News />
      <WhyUs />
      <HowWork />
    </div>
  );
}
