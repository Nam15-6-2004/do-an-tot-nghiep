import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./trangChu.scss";
import BannerHome from "../../components/Home/BannerHome";
import CollectionHome from "../../components/Home/CollectionHome";
import ProductList from "../../components/Product/ProductList";
import Chat from "../../components/chat";

function TrangChu() {
  return (
    <>
      {/* Start Bannrers */}
      <BannerHome />
      {/* End Bannrers */}

      {/* Start Product List */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Sản phẩm mới</h2>
          <Link to="/san-pham" className="view-all-link">
            Xem thêm
          </Link>
        </div>

        <ProductList rows={2} />
      </div>
      {/* End Product List */}

      {/* start topic */}
      <div className="container my-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Chủ đề mới</h2>
          <Link to="/chu-de" className="view-all-link">
            Xem thêm
          </Link>
        </div>
        <div className="row new-topic">
          {["chu-de-1.png", "chu-de-2.png", "chu-de-3.png", "chu-de-4.png"].map(
            (img, index) => (
              <div key={index} className="col-md-3 col-sm-6 col-12 mb-4">
                <img
                  src={`/image/${img}`}
                  alt={`chu-de-${index}`}
                  className="img-fluid"
                />
              </div>
            )
          )}
        </div>

        <ProductList rows={1} />
      </div>
      {/* end topic */}

      {/* start Collection */}
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Bộ sưu tập</h2>
          <Link to="/san-pham" className="view-all-link">
            Xem thêm
          </Link>
        </div>
        <CollectionHome />
      </div>

      {/* end Collection */}
      <Chat />
    </>
  );
}

export default TrangChu;
