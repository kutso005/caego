import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaClipboardList,
  FaBox,
  FaCheckCircle,
} from "react-icons/fa";
import { get } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function HowWork() {
const navigate = useNavigate()
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getHowItWorks();
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
      <div className="mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
            <div className="about-us-title">
            <h1 className="title">Как это работает?</h1>
          </div>
        </motion.div>

        <div className="how-work-steps">
          {qualities.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="how-work-step"
            >
              <div className="flex flex-col items-center">
               <img width={50} height={50} src= {step.image} alt="" />
                <div className="step-number">{step.id}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      
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

      </div>
    </div>
  );
}
