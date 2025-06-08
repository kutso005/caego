import React, { useEffect, useState } from "react";
import { services } from "../data/services";
import { useNavigate } from "react-router-dom";
import { get } from "../api/api";

export default function OurService() {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate("/services", { state: { selectedService: service } });
  };
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getOurServices();
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
        <h1 className="title">НАШИ УСЛУГИ</h1>
      </div>
      <div className="services-grid">
        {qualities.map((service) => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => handleServiceClick(service)}
          >
            <img src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
