import React, { useEffect, useState } from "react";
import { get } from "../api/api";
export default function AboutUs() {
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getAboutUs();
        console.log("Алынган маалымат:", response);

        setQualities(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="about-us-title">
        <h1 className="title">О НАС</h1>
      </div>
      <div className="about-us-content">
        {qualities.map((item, index) => (
          <div className="about-us-image">
            <img src={item.image} alt="about-us-image" />
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
