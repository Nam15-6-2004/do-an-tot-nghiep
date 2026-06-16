import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./HoanThanh.scss";
import { Link } from "react-router-dom";

const HoanThanh = () => {
  return (
    <div className="hoan-thanh">
      <section className="header">
        <Link to="/ho-so/ls-don-hang" className="text-decoration-none">
          <div className="back">
            <i className="fas fa-angle-left"></i>
            TRỞ LẠI
          </div>
        </Link>

        <div className="order-info">
          <div className="order-code">MÃ ĐƠN HÀNG. 2504243MJS0GAU</div>
          <div className="line">|</div>
          <div className="order-status">ĐƠN HÀNG ĐÃ HOÀN THÀNH</div>
        </div>
      </section>

      <section className="progress-container">
        <div className="progress-line">
          <div className="progress-step">
            <div className="circle">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="text-top">Đơn Hàng Đã Đặt</div>
            <div className="text-bottom">
              <small>23:33 23-04-2025</small>
            </div>
          </div>
          <div className="progress-step">
            <div className="circle">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="text-top">
              Đơn Hàng Đã Thanh Toán <br />
              <span className="price">(₫67.150)</span>
            </div>
            <div className="text-bottom">
              <small>23:33 23-04-2025</small>
            </div>
          </div>
          <div className="progress-step">
            <div className="circle">
              <i className="fas fa-truck"></i>
            </div>
            <div className="text-top">Đã Giao Cho ĐVVC</div>
            <div className="text-bottom">
              <small>15:38 24-04-2025</small>
            </div>
          </div>
          <div className="progress-step">
            <div className="circle">
              <i className="fas fa-download"></i>
            </div>
            <div className="text-top">Đã Nhận Được Hàng</div>
            <div className="text-bottom">
              <small>15:20 26-04-2025</small>
            </div>
          </div>
          <div className="progress-step">
            <div className="circle">
              <i className="fas fa-star"></i>
            </div>
            <div className="text-top">Đơn Hàng Đã Hoàn Thành</div>
            <div className="text-bottom">
              <small>00:21 30-04-2025</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section-message">
        Cảm ơn bạn đã mua sắm tại Moji!
      </section>

      <section className="section-buttons container d-flex flex-column gap-3">
        <button
          type="button"
          className="btn btn-orange align-self-end"
          style={{ background: "#ED6E94" }}
        >
          Mua Lại
        </button>
        <button type="button" className="btn btn-light-custom align-self-end">
          Liên Hệ Người Bán
        </button>
        <button type="button" className="btn btn-light-custom align-self-end">
          Xem Đánh Giá Shop
        </button>
      </section>
    </div>
  );
};

export default HoanThanh;
