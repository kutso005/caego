import React, { useEffect, useState } from "react";
import "../assets/styles/Contacts.css";
import { get } from "../api/api";

export default function Contacts() {
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getPvz();
        console.log("Алынган маалымат:", response);

        setQualities(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="contacts-container">
      <div className="about-us-title">
        <h1 className="title">КОНТАКТЫ</h1>
      </div>
      <p className="services-subtitle">
        Выберите ближайший к вам пункт выдачи заказов
      </p>

      <div className="contacts-grid">
        {qualities.map((office, index) => (
          <div key={index} className="contact-card">
            <div className="contact-card-content">
              <h3>{office.title}</h3>
              <div className="contact-info">
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{office.location}</p>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <p>{office.phone_number}</p>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <p>Пн-Сб: {office.working_hours}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
