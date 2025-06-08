import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop({ searchTerm }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      window.scrollTo({
        top: 0, 
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0, 
        behavior: "smooth",
      });
    }
  }, [pathname, searchTerm]); 

  return null;
}

export default ScrollToTop;
