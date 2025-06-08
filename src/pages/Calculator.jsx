import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Calculator.css";
import Calculator from "../assets/image/box_dimensions.png";

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({
    weight: "",
    height: "",
    width: "",
    length: "",
  });
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const actualWeight = parseFloat(dimensions.weight);
    const volumetricWeight =
      (parseFloat(dimensions.length) *
        parseFloat(dimensions.width) *
        parseFloat(dimensions.height)) /
      6000;

    setResult({
      actualWeight,
      volumetricWeight,
      finalWeight: Math.max(actualWeight, volumetricWeight),
    });
  };

  return (
    <div className="calculator">
      <div className="calculator__container">
      <button className="calculator__button" onClick={() => navigate("/")}>
            НА ГЛАВНУЮ
          </button>
        <div className="calculator__title">
          <h1>Калькулятор</h1>
          <p>Тут Вы можете рассчитать стоимость доставки</p>
        </div>

        <div className="calculator__info">
          <p>
            При отправке легких, но крупногабаритных (объемных) грузов стоимость
            доставки рассчитывается по "объемному весу" в соответствии с
            формулой:
          </p>
          <p>
            Длина (см) × ширина (см) × высота (см) / 6000 = объемный вес (кг).
          </p>
        </div>

        <div className="calculator__form">
          <div className="calculator__input-group">
            <input
              type="number"
              placeholder="Вес в кг."
              value={dimensions.weight}
              onChange={(e) =>
                setDimensions({ ...dimensions, weight: e.target.value })
              }
            />
            <label>Вес в кг.</label>
          </div>

          <div className="calculator__input-group">
            <input
              type="number"
              placeholder="Высота в см."
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({ ...dimensions, height: e.target.value })
              }
            />
            <label>Высота в см.</label>
          </div>

          <div className="calculator__input-group">
            <input
              type="number"
              placeholder="Ширина в см."
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
            />
            <label>Ширина в см.</label>
          </div>

          <div className="calculator__input-group">
            <input
              type="number"
              placeholder="Длина в см."
              value={dimensions.length}
              onChange={(e) =>
                setDimensions({ ...dimensions, length: e.target.value })
              }
            />
            <label>Длина в см.</label>
          </div>

          <button className="calculator__button" onClick={handleCalculate}>
            РАССЧИТАТЬ
          </button>

      

          {result !== null && (
            <div className="calculator__result">
              <p className="calculator__result-title">
                Коробка размером {dimensions.height} x {dimensions.width} x{" "}
                {dimensions.length} (см.) и весом {result.actualWeight} кг.
                будет доставляться по{" "}
                {result.volumetricWeight > result.actualWeight
                  ? "объемному"
                  : "фактическому"}{" "}
                весу, который составляет {result.finalWeight.toFixed(2)} кг.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
