import React, { useState, useEffect } from "react";
import "./AddClient.css";
import { get, put } from "../../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const AddClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showRecipientForm, setShowRecipientForm] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isAdmin, setIsAdmin] = useState(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    return adminStatus === "true";
  });
  const [clientData, setClientData] = useState({
    id: "",
    registrationDate: new Date().toLocaleString(),
    lastName: "",
    firstName: "",
    countryId: "",
    phoneNumber: "",
    email: "",
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
    recipients: [],
  });
  const [recipientData, setRecipientData] = useState({
    lastNameRu: "",
    firstNameRu: "",
    middleNameRu: "",
    lastNameEn: "",
    firstNameEn: "",
    country: "",
    phoneNumber: "",
    address: "",
    documentNumber: "",
    documentIssuer: "",
    documentIssueDate: "",
    documentExpiryDate: "",
    innNumber: "",
    birthDate: "",
    passportPhotos: [],
    portraitPhoto: null,
    regulaResults: "",
    isDefaultRecipient: false,
    managerNotes: "",
    clientNotes: "",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await get.getCountries();
        setCountries(response);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const response = await get.getUsersId(id);
          setClientData({
            userId: response.id || "",
            registrationDate: new Date().toLocaleString(),
            lastName: response.last_name || "",
            firstName: response.first_name || "",
            countryId: response.country?.id || "",
            phoneNumber: response.phone_number || "",
            email: response.email || "",
            tariffs: {
              usa: {
                level: response.tarif_usa || "Новичок",
                value: response.tarif_usa_value?.toString() || "0",
              },
              turkey: {
                level: response.tarif_turkey || "Новичок",
                value: response.tarif_turkey_value?.toString() || "0",
              },
              china: {
                level: response.tarif_china || "Новичок",
                value: response.tarif_china_value?.toString() || "0",
              },
              japan: {
                level: response.tarif_japan || "Новичок",
                value: response.tarif_japan_value?.toString() || "0",
              },
            },
            recipients: response.recipients || [],
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setClientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTariffChange = (country, field, value) => {
    setClientData((prev) => ({
      ...prev,
      tariffs: {
        ...prev.tariffs,
        [country]: {
          ...prev.tariffs[country],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      client_id: clientData.userId,
      last_name: clientData.lastName,
      first_name: clientData.firstName,
      country_id: parseInt(clientData.countryId),
      phone_number: clientData.phoneNumber,
      email: clientData.email,
      tarif_usa: clientData.tariffs.usa.level,
      tarif_usa_value: parseFloat(clientData.tariffs.usa.value),
      tarif_turkey: clientData.tariffs.turkey.level,
      tarif_turkey_value: parseFloat(clientData.tariffs.turkey.value),
      tarif_china: clientData.tariffs.china.level,
      tarif_china_value: parseFloat(clientData.tariffs.china.value),
      tarif_japan: clientData.tariffs.japan.level,
      tarif_japan_value: parseFloat(clientData.tariffs.japan.value),
    };

    try {
      await put.updateUser(id, formattedData);

      Swal.fire({
        title: "Успешно!",
        text: "Данные клиента успешно обновлены",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/dashboard/clients");
      });
    } catch (error) {
      console.error("Error updating client data:", error);
      Swal.fire({
        title: "Ошибка!",
        text:
          error.response?.data?.message ||
          "Произошла ошибка при обновлении данных",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRecipientInputChange = (field, value) => {
    setRecipientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (field, files) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (field === "passportPhotos") {
      const validFiles = Array.from(files).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validFiles.length > 0) {
        setRecipientData((prev) => ({
          ...prev,
          passportPhotos: validFiles,
        }));
      } else {
        Swal.fire({
          title: "Ошибка!",
          text: "Пожалуйста, выберите файлы в формате JPG, PNG, SVG или WEBP",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else if (field === "portraitPhoto") {
      const file = files[0];
      if (file && allowedTypes.includes(file.type)) {
        setRecipientData((prev) => ({
          ...prev,
          portraitPhoto: file,
        }));
      } else {
        Swal.fire({
          title: "Ошибка!",
          text: "Пожалуйста, выберите файл в формате JPG, PNG, SVG или WEBP",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleSaveRecipient = async () => {
    try {
      const formData = new FormData();

      // Добавляем основные данные
      formData.append("last_name", recipientData.lastNameRu);
      formData.append("first_name", recipientData.firstNameRu);
      formData.append("phone_number", recipientData.phoneNumber);
      formData.append("country_id", recipientData.country);
      formData.append("address", recipientData.address);
      formData.append("status_recipient", "Проверяется");
      formData.append("passport_number", recipientData.documentNumber);
      formData.append("passport_date", recipientData.documentIssueDate);
      formData.append("passport_place", recipientData.documentIssuer);
      formData.append("passport_end_date", recipientData.documentExpiryDate);
      formData.append("inn", recipientData.innNumber);
      formData.append("date_of_birth", recipientData.birthDate);
      formData.append("main_recipient", recipientData.isDefaultRecipient);

      // Добавляем файлы
      if (recipientData.passportPhotos[0]) {
        formData.append("passport_image_1", recipientData.passportPhotos[0]);
      }
      if (recipientData.passportPhotos[1]) {
        formData.append("passport_image_2", recipientData.passportPhotos[1]);
      }
      if (recipientData.portraitPhoto) {
        formData.append("portret_image", recipientData.portraitPhoto);
      }

      // Прямой запрос через axios вместо использования put.addUserRecipient
      const response = await axios.post(
        `https://moicargo.kg/api/v1/users/${id}/recipients/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Добавляем токен если нужен
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: "Успешно!",
          text: "Получатель успешно добавлен",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setShowRecipientForm(false);
          // Опционально: обновить список получателей
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error saving recipient:", error);
      Swal.fire({
        title: "Ошибка!",
        text:
          error.response?.data?.message ||
          "Произошла ошибка при сохранении получателя",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddRecipient = () => {
    setShowRecipientForm(true);
  };

  return (
    <div className="add-client-page">
      <div className="add-client-header">
        <h1>Добавить клиента</h1>
        <div className="navigation-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            disabled={!isAdmin}
          >
            Профиль
          </button>
          <button
            className={`tab-button ${
              activeTab === "recipients" ? "active" : ""
            }`}
            onClick={() => setActiveTab("recipients")}
            disabled={!isAdmin}
          >
            Получатель
          </button>
        </div>
      </div>

      {activeTab === "profile" ? (
        <form className="add-client-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID пользователя</label>
            <input
              type="text"
              value={clientData.userId}
              onChange={(e) => handleInputChange("userId", e.target.value)}
              placeholder="ID будет сгенерирован автоматически"
              disabled={!isAdmin}
            />
          </div>

          <div className="form-group">
            <label>Дата регистрации</label>
            <input
              type="text"
              value={clientData.registrationDate}
              onChange={(e) =>
                handleInputChange("registrationDate", e.target.value)
              }
              disabled={!isAdmin}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Фамилия</label>
              <input
                type="text"
                value={clientData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                value={clientData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isAdmin}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={clientData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isAdmin}
            />
          </div>

          <div className="form-group">
            <label>Страна</label>
            <select
              value={clientData.countryId}
              onChange={(e) => handleInputChange("countryId", e.target.value)}
              disabled={!isAdmin}
            >
              <option value="">Выберите страну</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Номер телефона</label>
            <input
              type="tel"
              value={clientData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              disabled={!isAdmin}
            />
          </div>

          <div className="tariffs-section">
            <div className="tariff-row">
              <label>Тариф США</label>
              <select
                value={clientData.tariffs.usa.level}
                onChange={(e) =>
                  handleTariffChange("usa", "level", e.target.value)
                }
                disabled={!isAdmin}
              >
                <option value="Новичок">Новичок</option>
                <option value="Базовый">Базовый</option>
                <option value="Промо">Промо</option>
              </select>
              <div className="tariff-value">
                <input
                  type="text"
                  value={clientData.tariffs.usa.value}
                  onChange={(e) =>
                    handleTariffChange("usa", "value", e.target.value)
                  }
                  disabled={!isAdmin}
                />
              </div>
            </div>

           

            <div className="tariff-row">
              <label>Тариф Китай</label>
              <select
                value={clientData.tariffs.china.level}
                onChange={(e) =>
                  handleTariffChange("china", "level", e.target.value)
                }
                disabled={!isAdmin}
              >
                <option value="Новичок">Новичок</option>
                <option value="Базовый">Базовый</option>
                <option value="Промо">Промо</option>
              </select>
              <div className="tariff-value">
                <input
                  type="text"
                  value={clientData.tariffs.china.value}
                  onChange={(e) =>
                    handleTariffChange("china", "value", e.target.value)
                  }
                  disabled={!isAdmin}
                />
              </div>
            </div>

        
          </div>

          <button type="submit" className="save-client" disabled={!isAdmin}>
            Сохранить
          </button>
        </form>
      ) : (
        <div className="recipients-section">
          {showRecipientForm ? (
            <form className="recipient-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Фамилия и Имя (ru)</label>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={recipientData.lastNameRu}
                    onChange={(e) =>
                      handleRecipientInputChange("lastNameRu", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Имя"
                    value={recipientData.firstNameRu}
                    onChange={(e) =>
                      handleRecipientInputChange("firstNameRu", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Отчество (ru)</label>
                <input
                  type="text"
                  placeholder="Отчество"
                  value={recipientData.middleNameRu}
                  onChange={(e) =>
                    handleRecipientInputChange("middleNameRu", e.target.value)
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Фамилия и Имя (en)</label>
                  <input
                    type="text"
                    placeholder="Фамилия (en)"
                    value={recipientData.lastNameEn}
                    onChange={(e) =>
                      handleRecipientInputChange("lastNameEn", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Имя (en)"
                    value={recipientData.firstNameEn}
                    onChange={(e) =>
                      handleRecipientInputChange("firstNameEn", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Страна</label>
                <select
                  value={recipientData.country}
                  onChange={(e) =>
                    handleRecipientInputChange("country", e.target.value)
                  }
                >
                  <option value="">Выбрать</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Номер телефона</label>
                <div className="phone-input">
                  <span className="country-code">KG</span>
                  <input
                    type="tel"
                    placeholder="Пример: 0700 123 456"
                    value={recipientData.phoneNumber}
                    onChange={(e) =>
                      handleRecipientInputChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Адрес</label>
                <input
                  type="text"
                  placeholder="Адрес"
                  value={recipientData.address}
                  onChange={(e) =>
                    handleRecipientInputChange("address", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Номер документа *</label>
                <input
                  type="text"
                  placeholder="Номер документа"
                  value={recipientData.documentNumber}
                  onChange={(e) =>
                    handleRecipientInputChange("documentNumber", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Орган выдавший документ</label>
                <input
                  type="text"
                  placeholder="Орган выдавший документ"
                  value={recipientData.documentIssuer}
                  onChange={(e) =>
                    handleRecipientInputChange("documentIssuer", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Дата выдачи документа</label>
                <input
                  type="date"
                  value={recipientData.documentIssueDate}
                  onChange={(e) =>
                    handleRecipientInputChange(
                      "documentIssueDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Срок действия документа</label>
                <input
                  type="date"
                  value={recipientData.documentExpiryDate}
                  onChange={(e) =>
                    handleRecipientInputChange(
                      "documentExpiryDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Номер ИНН</label>
                <input
                  type="text"
                  placeholder="Номер ИНН"
                  value={recipientData.innNumber}
                  onChange={(e) =>
                    handleRecipientInputChange("innNumber", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Дата рождения *</label>
                <input
                  type="date"
                  value={recipientData.birthDate}
                  onChange={(e) =>
                    handleRecipientInputChange("birthDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Фото паспорта</label>
                <div className="photo-upload-row">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("passportPhoto1").click()
                    }
                  >
                    Выберите фотографии
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("passportPhoto2").click()
                    }
                  >
                    Выберите фотографии
                  </button>
                  <input
                    id="passportPhoto1"
                    type="file"
                    hidden
                    onChange={(e) =>
                      handlePhotoUpload("passportPhotos", e.target.files)
                    }
                  />
                  <input
                    id="passportPhoto2"
                    type="file"
                    hidden
                    onChange={(e) =>
                      handlePhotoUpload("passportPhotos", e.target.files)
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Портрет</label>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("portraitPhoto").click()
                  }
                >
                  Выберите фотографии
                </button>
                <input
                  id="portraitPhoto"
                  type="file"
                  hidden
                  onChange={(e) =>
                    handlePhotoUpload("portraitPhoto", e.target.files)
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Результаты с сайта Regula</label>
                  <input
                    type="text"
                    value={recipientData.regulaResults}
                    readOnly
                  />
                </div>
                <button type="button" className="clipboard-button">
                  Считать из буфера
                </button>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  Получатель по умолчанию?
                  <input
                    type="checkbox"
                    checked={recipientData.isDefaultRecipient}
                    onChange={(e) =>
                      handleRecipientInputChange(
                        "isDefaultRecipient",
                        e.target.checked
                      )
                    }
                  />
                  <span className="toggle-switch"></span>
                </label>
              </div>

              <div className="form-group">
                <label>Примечание для менеджеров</label>
                <input
                  type="text"
                  placeholder="Примечание для менеджеров"
                  value={recipientData.managerNotes}
                  onChange={(e) =>
                    handleRecipientInputChange("managerNotes", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Комментарий для клиента</label>
                <input
                  type="text"
                  placeholder="Комментарий для клиента"
                  value={recipientData.clientNotes}
                  onChange={(e) =>
                    handleRecipientInputChange("clientNotes", e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="save-recipient"
                onClick={handleSaveRecipient}
              >
                Сохранить получателя
              </button>
            </form>
          ) : (
            <button
              className="add-recipient-button"
              onClick={handleAddRecipient}
              disabled={!isAdmin}
            >
              Добавить получателя
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddClient;
