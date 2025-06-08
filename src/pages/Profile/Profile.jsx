import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    userId: "201642",
    registrationDate: "24.02.2025, 12:09:35",
    lastName: "Ысмаилов",
    firstName: "Душонали",
    country: "Кыргызстан",
    phoneNumber: "+996 556 906 360",
    tariffs: {
      usa: {
        level: "Новичок",
        value: "12.00",
      },
      turkey: {
        level: "Новичок",
        value: "5.44",
      },
      china: {
        level: "Промо",
        value: "3.40",
      },
      japan: {
        level: "Базовый",
        value: "20.00",
      },
    },
  });

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="profile-page">
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Профиль
        </button>
        <button
          className={`tab ${activeTab === "recipients" ? "active" : ""}`}
          onClick={() => setActiveTab("recipients")}
        >
          Получатели
        </button>
        <button
          className={`tab ${activeTab === "addresses" ? "active" : ""}`}
          onClick={() => setActiveTab("addresses")}
        >
          Адреса
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-form">
          <div className="form-group">
            <label>ID пользователя</label>
            <input type="text" value={userData.userId} disabled />
          </div>

          <div className="form-group">
            <label>Дата регистрации</label>
            <input type="text" value={userData.registrationDate} disabled />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Фамилия и Имя</label>
              <input type="text" value={userData.lastName} />
            </div>
            <div className="form-group">
              <input type="text" value={userData.firstName} />
            </div>
          </div>

          <div className="form-group">
            <label>Страна</label>
            <select value={userData.country}>
              <option value="Кыргызстан">Кыргызстан</option>
            </select>
          </div>

          <div className="form-group">
            <label>Номер телефона</label>
            <div className="phone-input">
              <select className="country-code">
                <option value="KG">KG</option>
              </select>
              <input type="tel" value={userData.phoneNumber} />
            </div>
          </div>

          <div className="tariffs-section">
            <div className="tariff-row">
              <label>Тариф США</label>
              <select value={userData.tariffs.usa.level}>
                <option value="Новичок">Новичок</option>
              </select>
              <div className="tariff-value">
                <input type="text" value={userData.tariffs.usa.value} />
                <button className="value-adjust minus">−</button>
                <button className="value-adjust plus">+</button>
              </div>
            </div>


            <div className="tariff-row">
              <label>Тариф Китай</label>
              <select value={userData.tariffs.china.level}>
                <option value="Промо">Промо</option>
              </select>
              <div className="tariff-value">
                <input type="text" value={userData.tariffs.china.value} />
                <button className="value-adjust minus">−</button>
                <button className="value-adjust plus">+</button>
              </div>
            </div>

        
          </div>

          <button className="save-profile">Сохранить профиль</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
