import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Footer.scss";

function Footers() {
  return (
    <div className="footer">
      <div className="container py-4">
        <div className="row">
          {/* Cột 1: Thông tin liên hệ */}
          <div className="col-md-3 mb-3">
            <h5 className="fw-bold">Hotline</h5>
            <p>
              <i className="bi bi-telephone-fill me-2"></i>
              0247.303.3579
            </p>
            <h5 className="fw-bold">Email</h5>
            <p>
              <i className="bi bi-envelope-fill me-2"></i>
              cskh@moji.vn
            </p>
            {/* Dùng Link thay cho a */}
            <Link to="/chinh-sach-ban-hang" className="footer-link d-block">
              CHÍNH SÁCH BÁN HÀNG
            </Link>
            <Link to="/huong-dan-mua-hang" className="footer-link d-block">
              HƯỚNG DẪN MUA HÀNG
            </Link>
          </div>

          {/* Cột 2: Hà Nội */}
          <div className="col-md-3 mb-3">
            <h5 className="fw-bold">HÀ NỘI (9h - 22h)</h5>
            <ul className="list-unstyled">
              <li>81 Bà Triệu, Hai Bà Trưng</li>
              <li>241 Chùa Bộc, Đống Đa</li>
              <li>60 Trần Đại Nghĩa, Hai Bà Trưng</li>
              <li>226 Nguyễn Trãi, Nam Từ Liêm (gần ĐH Hà Nội)</li>
              <li>157 Xuân Thủy, Cầu Giấy</li>
            </ul>
          </div>

          {/* Cột 3: TP. HỒ CHÍ MINH */}
          <div className="col-md-3 mb-3">
            <h5 className="fw-bold">TP. HỒ CHÍ MINH (9h30 - 22h)</h5>
            <ul className="list-unstyled">
              <li>92 Hồ Tùng Mậu, P.Bến Nghé, Q1</li>
              <li>459E Nguyễn Đình Chiểu, P.5, Q.3 (ngã tư Cao Thắng)</li>
              <li>708 Sư Vạn Hạnh, P.12, Q.10 (đối diện chéo Vạn Hạnh Mall)</li>
              <li>87 Bàu Cát, P.14, Q.Tân Bình (gần Nguyễn Hồng Đào)</li>
              <li>232 Phan Xích Long, P.7, Q.Phú Nhuận</li>
            </ul>
          </div>

          {/* Cột 4: Logo + Mạng xã hội */}
          <div className="col-md-3 mb-3 text-center">
            <img
              src="/image/logo.png"
              alt="Moji"
              className="footer-logo mb-2"
            />
            <h5>Hãy kết nối với chúng mình</h5>
            <div className="d-flex justify-content-center gap-2 mb-2">
              <Link to="/instagram">
                <img
                  src="/image/insta.png"
                  alt="Instagram"
                  className="social-icon"
                />
              </Link>
              <Link to="/facebook">
                <img
                  src="/image/fb.png"
                  alt="Facebook"
                  className="social-icon"
                />
              </Link>
              <Link to="/youtube">
                <img
                  src="/image/youtube.png"
                  alt="YouTube"
                  className="social-icon"
                />
              </Link>
              <Link to="/tiktok">
                <img
                  src="/image/tiktok.png"
                  alt="TikTok"
                  className="social-icon"
                />
              </Link>
            </div>
            <img
              src="/image/bocongthuong.png"
              alt="Đã thông báo Bộ Công Thương"
              className="gov-icon"
            />
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center py-2">
        © 2019. All Rights Reserved
      </div>
    </div>
  );
}

export default Footers;
