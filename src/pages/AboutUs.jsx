import React from "react";
import USA from "../assets/image/USA.jpg";
import kgz from "../assets/image/kgz.jpg";

export default function AboutUs() {
  return (
    <div className="about-us">
      <div className="about-us__header">
        <div className="about-us-title">
          <h1 className="title">О НАС</h1>
        </div>
        <p className="about-us__subtitle">
          Коротко о нас и немного о будущих перспективах
        </p>
      </div>

      <div className="about-us__content">
        <div className="about-us__text">
          <p>
            Наша компания является одним из самых надежных и доступных
            поставщиков логистических и складских услуг в Кыргызстане. Мы
            предоставляем нашим клиентам самый полный спектр транспортных услуг.
            Наш опыт в логистике позволяет непрерывно работать над
            индивидуальными предложениями для каждого из наших клиентов.
          </p>

          <p>
            Мы работаем над совершенствованием нашей системы – это разработка
            более коротких маршрутов, проработка тарифов для различного рода
            грузов и обучение наших специалистов для повышения качества
            обслуживания. Наша задача - помогать развитию вашего бизнеса через
            своевременные и надежные поставки товаров!
          </p>

          <div className="about-us__services">
            <h3>Что мы предлагаем:</h3>
            <ul>
              <li>Бесплатную и быструю регистрацию на нашем сайте</li>
              <li>Бесплатные почтовые адреса в США, Китае</li>
              <li>Еженедельные Авиа отправки</li>
              <li>Возможность отслеживать Ваши посылки</li>
              <li>Курьерскую доставку по Кыргызстану</li>
              <li>Карго перевозки</li>
            </ul>
          </div>
        </div>

        <div className="about-us__images">
          <img src={USA} alt="USA Map" className="usa-map" />
          <img src={kgz} alt="Kyrgyzstan Map" className="kgz-map" />
        </div>
      </div>
    </div>
  );
}
