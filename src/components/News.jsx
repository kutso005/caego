import React, { useEffect, useState } from "react";
import { get } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/News.css";

export default function News() {
  const [news, setNews] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getNews();
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
    <motion.div
      className="news-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="news-container">
        <motion.div
          className="news-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="news-title">Новости</h1>
          <div className="news-header-line"></div>
        </motion.div>

        <div className="news-grid">
          <AnimatePresence>
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                className="news-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <div className="news-image-wrapper">
                  <img src={item.image} alt={item.title} />
                  <div className="news-image-overlay"></div>
                </div>
                <div className="news-content">
                  <motion.h2
                    className="news-item-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {item.title}
                  </motion.h2>
                  <motion.div
                    className="news-date"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {formatDate(item.date)}
                  </motion.div>
                  <motion.div
                    className={`news-description ${
                      expandedItems[item.id] ? "expanded" : ""
                    }`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: expandedItems[item.id] ? 1 : 0,
                      height: expandedItems[item.id] ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </motion.div>
                  <motion.button
                    className="register-button"
                    onClick={() => toggleDescription(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedItems[item.id] ? "Свернуть" : "Читать далее"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
