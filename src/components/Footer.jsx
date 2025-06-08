import React from "react";
import logo from "../assets/image/logoi.png";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaClock, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__content">
          <img src={logo} alt="Smartex" className="logos" />
          <div className="footer__pages">
       
            <NavLink className="footer__link" to="/about-us">
              О нас
            </NavLink>
           <NavLink className="footer__link" to="/news">
              Новости
            </NavLink>
            <NavLink className="footer__link" to="/services">
              Услуги
            </NavLink>
            <NavLink className="footer__link" to="/contacts">
              Контакты
            </NavLink>
          </div>
          <div className="footer__contacts">
                <div className="footer__contact-item">
                  <FaPhoneAlt />
                 <a href="tel:+996503312213"  target="_blank" style={{textDecoration:"none"}}>
                 <span>+996 503 312 213</span>
                 </a>
                </div>
                <div className="footer__contact-item">
                  <FaClock />
                  <span>10:00-20:00</span>
                </div>
                <div className="footer__contact-item">
                  <MdEmail />
                  <a href="mailto:moicargokg@gmail.com"  target="_blank" style={{textDecoration:"none"}}>
                  <span>moicargokg@gmail.com</span>
                  </a>
                </div>
              </div>
          <div className="footer__right">
            <div className="footer__info">
              <h4>Кыргызстан:</h4>
              <p>ул.Киевская 107 , 1 этаж</p>
              <p>ориентир  ТЦ Караван</p>
              <p>г. Бишкек</p>
            
            </div>
            <div className="footer__social">
              <a
                href="https://www.instagram.com/moicargo.kg?igsh=MTEwa3Nvd3ZmZ3hsNA=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram  color="#121212"/>
              </a>
              <a
                href="https://wa.me/996503312213"
                target="_blank"
                rel="noopener noreferrer"
              >
               <FaWhatsapp  color="#121212"/>

              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
