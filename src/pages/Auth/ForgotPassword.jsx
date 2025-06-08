import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!codeSent) {
        const response = await axios.post(
          "https://moicargo.kg/api/v1/users/client/forgot-password/",
          {
            email: email,
          }
        );
        setCodeSent(true);
        toast.success("Код подтверждения отправлен на ваш email", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const response = await axios.post(
          "https://moicargo.kg/api/v1/users/client/forgot-password/set/",
          {
            email: email,
            code: code,
            password: password,
            confirm_password: confirmPassword,
          }
        );
        if (response.status === 200) {
          toast.success(response.data.detail || "Пароль успешно изменен", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Произошла ошибка", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="login-box">
        <h1 className="login-title">СБРОС ПАРОЛЯ</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="calculator__input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              className={error ? "error" : ""}
              disabled={codeSent}
            />
            <label>Email</label>
          </div>
          {codeSent && (
            <>
              <div className="calculator__input-group">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Введите код подтверждения"
                  className={error ? "error" : ""}
                />
                <label>Код подтверждения</label>
              </div>
              <div className="calculator__input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                  className={error ? "error" : ""}
                />
                <label>Новый пароль</label>
              </div>
              <div className="calculator__input-group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Подтвердите новый пароль"
                  className={error ? "error" : ""}
                />
                <label>Подтверждение пароля</label>
              </div>
            </>
          )}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading
              ? "ЗАГРУЗКА..."
              : codeSent
              ? "СБРОСИТЬ ПАРОЛЬ"
              : "ОТПРАВИТЬ КОД"}
          </button>
        </form>
      </div>
    </div>
  );
}
