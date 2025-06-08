import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import "./AddRecipient.css";

export default function AddRecipient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    address: "",
    countryId: 0,
    phone_number: "",
    passportFront: null,
    passportBack: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [side]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("country_id", 1);

      if (formData.passportFront) {
        formDataToSend.append("passport_image_1", formData.passportFront);
      }
      if (formData.passportBack) {
        formDataToSend.append("passport_image_2", formData.passportBack);
      }

      const token = localStorage.getItem("token");
      await api.post("/profile/recipient/", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboardclient/recipients");
    } catch (error) {
      console.error("Error adding recipient:", error);
    }
  };

  return (
    <div className="add-recipient-container">
      <div className="add-recipient-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboardclient/recipients")}
        >
          ←
        </button>
        <h1>Добавление получателя</h1>
      </div>

      <form className="add-recipient-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Фамилия <span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Введите фамилию"
            maxLength={20}
          />
          <div className="char-counter">{formData.lastName.length} / 20</div>
        </div>

        <div className="form-group">
          <label>
            Имя <span className="required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Введите имя"
            maxLength={20}
          />
          <div className="char-counter">{formData.firstName.length} / 20</div>
        </div>

        <div className="form-group">
          <label>
            Адрес <span className="required">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Введите адрес фактического проживания"
            maxLength={50}
          />
          <div className="char-counter">{formData.address.length} / 50</div>
        </div>

        <div className="form-group">
          <label>
            Номер телефона <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            placeholder="Введите номер телефона"
          />
        </div>

       

        <div className="form-group">
          <label>Фото паспорта</label>
          <div className="passport-upload-container">
            <div className="passport-upload">
              <input
                type="file"
                id="passportFront"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "passportFront")}
                style={{ display: "none" }}
              />
              <label htmlFor="passportFront" className="upload-box">
                {formData.passportFront ? (
                  <div className="file-name">{formData.passportFront.name}</div>
                ) : (
                  <div className="upload-text">
                    Выберите фото лицевой стороны
                  </div>
                )}
              </label>
            </div>

            <div className="passport-upload">
              <input
                type="file"
                id="passportBack"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "passportBack")}
                style={{ display: "none" }}
              />
              <label htmlFor="passportBack" className="upload-box">
                {formData.passportBack ? (
                  <div className="file-name">{formData.passportBack.name}</div>
                ) : (
                  <div className="upload-text">
                    Выберите фото обратной стороны
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Добавить
        </button>
      </form>
    </div>
  );
}
