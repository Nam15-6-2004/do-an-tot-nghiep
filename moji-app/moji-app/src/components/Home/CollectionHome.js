import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../pages/TrangChu/trangChu.scss";

const CollectionHome = () => {
  const imageList = [
    {
      id: 1,
      src: "/image/bo-suu-tap-1.jpg",
      alt: "Labubu thu hút mọi ánh nhìn",
    },
    { id: 2, src: "/image/bo-suu-tap-2.jpg", alt: "Gấu bông Capybara" },
    { id: 3, src: "/image/bo-suu-tap-3.jpg", alt: "Mê Kuromi" },
    { id: 4, src: "/image/bo-suu-tap-4.jpg", alt: "Mê màu xanh" },
    {
      id: 5,
      src: "/image/bo-suu-tap-5.jpg",
      alt: "Back to school cùng Capybara",
    },
    { id: 6, src: "/image/bo-suu-tap-6.jpg", alt: "Gấu bông cute" },
  ];

  const [index, setIndex] = useState(0);
  const handlePrev = () => {
    setIndex(index === 0 ? imageList.length - 3 : index - 1);
  };
  const handleNext = () => {
    setIndex(index === imageList.length - 3 ? 0 : index + 1);
  };

  return (
    <div className="carousel-container d-flex align-items-center">
      <button className="carousel-btn left-btn" onClick={handlePrev}>
        &#10094;
      </button>

      <div className="container image-carousel">
        <div className="row image-row">
          {imageList.slice(index, index + 3).map((item) => (
            <div key={item.id} className="col-md-4 col-sm-12">
              <div className="image-item">
                <img src={item.src} alt={item.alt} className="img-fluid" />
                <div className="image-alt">{item.alt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-btn right-btn" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default CollectionHome;
