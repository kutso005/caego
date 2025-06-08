import React, { useState } from "react";
import container from "../assets/image/container.png";
import { api } from "../api/api";
import Swal from "sweetalert2";

export default function WhyUs() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("application/", formData);
      console.log("Application submitted successfully:", response.data);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      // Beautiful success alert
      Swal.fire({
        title: "Успешно отправлено!",
        text: "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.",
        icon: "success",
        confirmButtonText: "Отлично",
        confirmButtonColor: "#28a745",
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "animated fadeInDown",
        },
        background: "#fff",
        iconColor: "#28a745",
      });
    } catch (error) {
      console.error("Error submitting application:", error);

      // Beautiful error alert
      Swal.fire({
        title: "Ошибка!",
        text: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова.",
        icon: "error",
        confirmButtonText: "Понятно",
        confirmButtonColor: "#dc3545",
        showConfirmButton: true,
        customClass: {
          popup: "animated fadeInDown",
        },
        background: "#fff",
        iconColor: "#dc3545",
      });
    }
  };

  return (
    <div className="why-us">
      <div className="container">
        <div className="why-us-content">
          <div className="why-us-text">
            <div className="why-us-text-left">
              <h1 className="why-us-title">Почему выбирают нас</h1>
              <p className="why-us-description">
                Мы предлагаем широкий спектр услуг по доставке грузов и
                документов в Кыргызстан. Наши клиенты могут быть уверены в том,
                что их грузы будут доставлены в срок и в надлежащем состоянии.
                Мы гарантируем, что ваш груз будет доставлен в срок и в
                надлежащем состоянии.
              </p>
            </div>
          </div>
          <div className="why-us-form">
            <div>
              <h1 className="why-us-form-title">Напишите нам!</h1>
              <p className="why-us-form-description">
                Тут Вы можете задать интересующий Вас вопрос.
              </p>
            </div>
            <form className="why-us-form-input" onSubmit={handleSubmit}>
              <div>
                <input
                  className="unput"
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <input
                  className="unput"
                  type="text"
                  name="phone"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <input
                className="unput"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                className="unput"
                type="text"
                name="message"
                placeholder="Сообщение"
                value={formData.message}
                onChange={handleInputChange}
              />
              <button type="submit" className="login">
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
