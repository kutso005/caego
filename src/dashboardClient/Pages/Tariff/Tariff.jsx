import React, { useEffect, useState } from "react";
import "./Tariff.css";
import { get } from "../../../api/api";

export default function Tariff() {
  const token = localStorage.getItem("token");
  const [userClient, setUserClient] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.getUserClient(config);
        console.log("Алынган маалымат:", response);

        setUserClient(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="tariff-page">
      <h2>Тариф</h2>
      <div className="tariff-form">
        <div className="tariff-row">
          <div className="tariff-group">
            <label>Вес США</label>
            <input
              type="text"
              value={`${userClient.tarif_usa_weight || 0} кг`}
              disabled
            />
          </div>
          <div className="tariff-group">
            <label>Тариф США</label>
            <div className="tariff-badge">
              {userClient.tarif_usa || "Новичок"}
            </div>
          </div>
          <div className="tariff-group">
            <label>Цена тарифа США</label>
            <input
              type="text"
              value={userClient.tarif_usa_value || 0}
              disabled
            />
          </div>
        </div>

  

        <div className="tariff-row">
          <div className="tariff-group">
            <label>Вес Китай</label>
            <input
              type="text"
              value={`${userClient.tarif_china_weight || 0} кг`}
              disabled
            />
          </div>
          <div className="tariff-group">
            <label>Тариф Китай</label>
            <div className="tariff-badge">
              {userClient.tarif_china || "Новичок"}
            </div>
          </div>
          <div className="tariff-group">
            <label>Цена тарифа Китай</label>
            <input
              type="text"
              value={userClient.tarif_china_value || 0}
              disabled
            />
          </div>
        </div>

      
      </div>
    </div>
  );
}
