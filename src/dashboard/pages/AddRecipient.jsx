import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./AddRecipient.css";

export default function AddRecipient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastNameRu: "",
    firstNameRu: "",
    middleNameRu: "",
    lastNameEn: "",
    firstNameEn: "",
    country: "",
    phone: "",
    address: "",
    documentNumber: "",
    documentIssuer: "",
    documentIssueDate: "",
    documentExpiryDate: "",
    inn: "",
    birthDate: "",
    passportFront: null,
    passportBack: null,
    portrait: null,
    isDefaultRecipient: false,
    managerNote: "",
    clientNote: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    navigate("/dashboard/recipients");
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <div className="add-recipient-container">
          <div className="add-recipient-form">
            <div className="form-row">
              <div className="form-group">
                <label>Фамилия и Имя (ru)</label>
                <input
                  type="text"
                  name="lastNameRu"
                  value={formData.lastNameRu}
                  onChange={handleInputChange}
                  placeholder="Фамилия"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="firstNameRu"
                  value={formData.firstNameRu}
                  onChange={handleInputChange}
                  placeholder="Имя"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Отчество (ru)</label>
              <input
                type="text"
                name="middleNameRu"
                value={formData.middleNameRu}
                onChange={handleInputChange}
                placeholder="Отчество"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Фамилия и Имя (en)</label>
                <input
                  type="text"
                  name="lastNameEn"
                  value={formData.lastNameEn}
                  onChange={handleInputChange}
                  placeholder="Фамилия (en)"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="firstNameEn"
                  value={formData.firstNameEn}
                  onChange={handleInputChange}
                  placeholder="Имя (en)"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Страна</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Выбрать</option>
                <option value="KG">Кыргызстан</option>
                <option value="KZ">Казахстан</option>
                <option value="UZ">Узбекистан</option>
              </select>
            </div>

            <div className="form-group">
              <label>Номер телефона</label>
              <div className="phone-input">
                <div className="country-code">
                  <img src="/kg-flag.png" alt="KG" className="flag-icon" />
                  <span>KG</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Пример: 0700 123 456"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Адрес</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Адрес"
              />
            </div>

            <div className="form-group">
              <label className="required">Номер документа</label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                placeholder="Номер документа"
                required
              />
            </div>

            <div className="form-group">
              <label>Орган выдавший документ</label>
              <input
                type="text"
                name="documentIssuer"
                value={formData.documentIssuer}
                onChange={handleInputChange}
                placeholder="Орган выдавший документ"
              />
            </div>

            <div className="form-group">
              <label>Дата выдачи документа</label>
              <input
                type="date"
                name="documentIssueDate"
                value={formData.documentIssueDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Срок действия документа</label>
              <input
                type="date"
                name="documentExpiryDate"
                value={formData.documentExpiryDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Номер ИНН</label>
              <input
                type="text"
                name="inn"
                value={formData.inn}
                onChange={handleInputChange}
                placeholder="Номер ИНН"
              />
            </div>

            <div className="form-group">
              <label className="required">Дата рождения</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Фото паспорта</label>
              <div className="passport-photos">
                <div className="photo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "passportFront")}
                    id="passportFront"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="passportFront" className="upload-button">
                    {formData.passportFront ? (
                      <div className="preview-container">
                        <img
                          src={URL.createObjectURL(formData.passportFront)}
                          alt="Передняя сторона паспорта"
                          className="photo-preview"
                        />
                        <button
                          className="remove-photo"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              passportFront: null,
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>Выберите фотографии</>
                    )}
                  </label>
                </div>
                <div className="photo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "passportBack")}
                    id="passportBack"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="passportBack" className="upload-button">
                    {formData.passportBack ? (
                      <div className="preview-container">
                        <img
                          src={URL.createObjectURL(formData.passportBack)}
                          alt="Задняя сторона паспорта"
                          className="photo-preview"
                        />
                        <button
                          className="remove-photo"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              passportBack: null,
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>Выберите фотографии</>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Портрет</label>
              <div className="portrait-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "portrait")}
                  id="portrait"
                  style={{ display: "none" }}
                />
                <label htmlFor="portrait" className="upload-button">
                  {formData.portrait ? (
                    <div className="preview-container">
                      <img
                        src={URL.createObjectURL(formData.portrait)}
                        alt="Портрет"
                        className="photo-preview"
                      />
                      <button
                        className="remove-photo"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData((prev) => ({
                            ...prev,
                            portrait: null,
                          }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>Выберите фотографии</>
                  )}
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="isDefaultRecipient"
                  id="isDefaultRecipient"
                  checked={formData.isDefaultRecipient}
                  onChange={handleInputChange}
                />
                <label htmlFor="isDefaultRecipient">
                  Получатель по умолчанию?
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Примечание для менеджеров</label>
              <input
                type="text"
                name="managerNote"
                value={formData.managerNote}
                onChange={handleInputChange}
                placeholder="Примечание для менеджеров"
              />
            </div>

            <div className="form-group">
              <label>Комментарий для клиента</label>
              <input
                type="text"
                name="clientNote"
                value={formData.clientNote}
                onChange={handleInputChange}
                placeholder="Комментарий для клиента"
              />
            </div>

            <div className="form-actions">
              <button className="save-button" onClick={handleSave}>
                Сохранить получателя
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
