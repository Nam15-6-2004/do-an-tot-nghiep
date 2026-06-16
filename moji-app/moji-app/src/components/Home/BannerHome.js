import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../pages/TrangChu/trangChu.scss";

function BannerHome() {
  const banners = [
    "/image/banner1.png",
    "/image/banner2.png",
    "/image/banner3.png",
    "/image/banner4.png",
    "/image/banner5.png",
  ];

  return (
    <div className="container-fluid banner-ne">
      <div className="row">
        <div className="col-md-9 ps-0 pe-0 banner-left">
          <Carousel>
            {banners.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Banner ${index + 1}`}
                  style={{ height: "385px" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="col-md-3 d-flex flex-column pe-0 ">
          <div
            className="banner-right-top mb-2"
            style={{
              cursor: "pointer",
              backgroundImage: "url('/image/banner-youtube.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "188px",
            }}
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=-1KazVuuwYE",
                "_blank"
              )
            }
          ></div>

          <div
            className="banner-right-bottom"
            style={{
              cursor: "pointer",
              backgroundImage: "url('/image/banner-moji-story.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "188px",
            }}
            onClick={() => (window.location.href = "/bo-suu-tap")}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default BannerHome;
