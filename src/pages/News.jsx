import React, { useEffect, useState } from "react";
import { get } from "../api/api";
import { motion } from "framer-motion";
import "./News.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getNews();
        console.log("Алынган маалымат:", response);
        setNews(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleDescription = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div className="news-page">
      <div className="container">
        <div className="news-title">
          <h1 className="title">Новости</h1>
        </div>
        <div className="news-grid">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              className="news-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="news-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="news-content">
                <h2>{item.title}</h2>
                <div className="news-date">{formatDate(item.date)}</div>
                <div
                  className={`news-description ${
                    expandedItems[item.id] ? "expanded" : ""
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </div>
                <button
                  className="read-more-btn"
                  onClick={() => toggleDescription(item.id)}
                >
                  {expandedItems[item.id] ? "Свернуть" : "Читать далее"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
