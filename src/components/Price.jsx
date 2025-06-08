import React, { useEffect, useState } from "react";
import "../assets/styles/Price.css";
import { useNavigate } from "react-router-dom";
import { get } from "../api/api";

export default function Price() {
  const navigate = useNavigate();
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getPriceAndPayment();
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
        <h1 className="title">Цены и оплата</h1>
        <p className="subtitle">
          Цены в зависимости от накопленного веса и локации склада
        </p>
      </div>

      <div className="price-table-container">
        <table className="price-table">
          <thead>
            <tr>
              <th>Вес</th>
              <th>Вид услуги</th>
              <th>США</th>
              <th>Турция</th>
              <th>Китай (Авиа)</th>
              <th>Китай (Авто)</th>
              <th>Комиссия</th>
            </tr>
          </thead>
          <tbody>
            {qualities.map((item) => (
              <tr key={item.id}>
                <td>{item.weight}</td>
                <td>{item.type_of_service}</td>
                <td>{item.price_usa}</td>
                <td>{item.price_turkey}</td>
                <td>{item.price_china_air}</td>
                <td>{item.price_china_car}</td>
                <td>{item.commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="price-notes">
        <p className="note">
          * При взвешивании используется округление до десятых килограмма!
        </p>
        <p className="warning">
          Внимание! Вышеуказанные цены только для посылок личного использования
          и не включают в себя таможенное оформление товаров, ввозимых для
          коммерческой деятельности, а также дополнительных расходов связанных с
          пересылкой опасных грузов.
        </p>
      </div>

      <div className="weight-info">
        <h2>Физический и объемный вес</h2>
        <p>
          При расчете доставки используется объемный вес и фактический вес
          отправления. Для расчета стоимости отправления всегда используется
          больший вес.
        </p>
        <div className="formula">
          <p>
            Формула расчета объемного веса: Длина × Ширина × Высота / 6000 =
            Объемный вес (кг)
          </p>
          <p className="formula-note">
            где длина, ширина и высота в сантиметрах
          </p>
        </div>
        <button
          className="register-button end-button"
          onClick={() => navigate("/calculator")}
        >
          Рассчитать вес
        </button>
      </div>

      <div className="payment-info">
        <h2>Оплата</h2>
        <p>
          Оплатить за агентские услуги Вы можете через свой личный кабинет
          используя М-Банк, также мы доступны в приложениях Мегапэй, Бакай банк,
          Оптима банк и в платежных терминалах М-Банк и Окей.
        </p>
      </div>
    </div>
  );
}
