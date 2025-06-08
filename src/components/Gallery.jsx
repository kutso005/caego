import React, { useEffect, useState } from "react";
import gallery1 from "../assets/image/images.jpg";
import { get } from "../api/api";

export default function Gallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [qualities, setQualities] = useState([]);
  const images = qualities?.map((item) => item.image) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getGallery();
        console.log("Алынган маалымат:", response);

        setQualities(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="container">
      <div className="about-us-title">
        <h1 className="title">Галерея</h1>
      </div>
      <div className="gallery-images">
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => handleImageClick(index)}
          >
            <img src={image} alt={`Gallery image ${index + 1}`} />
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <div className="lightbox" onClick={handleClose}>
          <button className="slider-button prev" onClick={handlePrevious}>
            &#10094;
          </button>
          <img
            src={images[selectedImageIndex]}
            alt={`Selected gallery image ${selectedImageIndex + 1}`}
          />
          <button className="slider-button next" onClick={handleNext}>
            &#10095;
          </button>
          <span className="close-button">&times;</span>
          <div className="image-counter">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
