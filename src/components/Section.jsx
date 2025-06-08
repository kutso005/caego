import React, { useEffect, useState } from "react";
import img from "../assets/image/air.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { get } from "../api/api";

export default function Section() {
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getBanners();
        console.log("Алынган маалымат:", response);

        setQualities(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div id="dection">
      <Slider {...settings}>
        {qualities.map((el) => (
          <div className="air">
              <div className="fone"></div>
              <img src={el.image} alt="" />
           
            <div className="container">
              <div className="air-text">
                <p>
               {el.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
