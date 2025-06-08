import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { services } from "../data/services";
import { get } from "../api/api";

export default function Services() {
  const location = useLocation();
  const serviceDetailRef = useRef(null);
  const [qualities, setQualities] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getOurServices();
        console.log("Алынган маалымат:", response);
        setQualities(response);
        if (response.length > 0) {
          setActiveService(response[0]);
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.selectedService) {
      setActiveService(location.state.selectedService);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }, [location.state]);

  const handleServiceClick = (service) => {
    setShowAllServices(false);
    setActiveService(service);
    if (service.id !== 1) {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleShowAllServices = () => {
    setShowAllServices(true);
    setActiveService(qualities[0]);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const renderAllServices = () => {
    return (
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
    );
  };

  if (!activeService) {
    return <div>Loading...</div>;
  }

  return (
    <div className="services-container">
      <div className="about-us-title">
        <h1 className="title">УСЛУГИ</h1>
      </div>
      <p className="services-subtitle">
        Что мы можем и что Вы можете ожидать от нас
      </p>

      <div className="services-nav">
        <button
          className={`service-nav-button ${showAllServices ? "active" : ""}`}
          onClick={handleShowAllServices}
        >
          Все услуги
        </button>
        {qualities.map((service) => (
          <button
            key={service.id}
            className={`service-nav-button ${
              !showAllServices && activeService.id === service.id
                ? "active"
                : ""
            }`}
            onClick={() => handleServiceClick(service)}
          >
            {service.title}
          </button>
        ))}
      </div>

      {!showAllServices && activeService && (
        <div className="service-content" ref={serviceDetailRef}>
          <div className="service-info">
            <h2>{activeService.title}</h2>
            <p>{activeService.description}</p>
          </div>
          <div className="service-image">
            <img src={activeService.image} alt={activeService.title} />
          </div>
        </div>
      )}

      {showAllServices && renderAllServices()}
    </div>
  );
}
