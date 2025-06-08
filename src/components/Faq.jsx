import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { get } from "../api/api";


export default function Faq() {
  const [openItems, setOpenItems] = useState({});
  const [qualities, setQualities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getFaq();
        console.log("Алынган маалымат:", response);

        setQualities(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);
  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="faq-container">
         <div className="about-us-title">
        <h1 className="title">Часто задаваемые вопросы
        </h1>
      </div>
      {qualities.map((item, index) => (
        <div className="accordion-item" key={index}>
          <button
            className="accordion-header"
            onClick={() => toggleItem(index)}
          >
            {item.question}
            <span
              className={`accordion-arrow ${openItems[index] ? "open" : ""}`}
            >
              <IoIosArrowDown size={25} />
            </span>
          </button>
          <div
            className={`accordion-content ${openItems[index] ? "open" : ""}`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
