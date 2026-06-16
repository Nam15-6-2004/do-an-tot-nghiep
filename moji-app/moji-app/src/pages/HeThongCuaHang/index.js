import { useState } from "react";
import { Link } from "react-router-dom";
import AllMap from "./AllMap";
import HaNoiMap from "./HaNoiMap";
import HCMMap from "./HCMMap";
import "./HeThongCuaHang.scss"; // thêm nếu chưa import

function HeThongCuaHang() {
  const [currentTab, setCurrentTab] = useState("tatca");

  const openCity = (city) => {
    setCurrentTab(city);
  };

  return (
    <div className="container he-thong-cua-hang">
      <div className="row mt-4">
        <div className="caption d-flex">
          <Link to="/">Trang chủ</Link>
          <span className="muiTen mx-2">{">"}</span>
          <Link to="/he-thong-cua-hang">Hệ thống cửa hàng</Link>
          <span className="muiTen mx-2">{">"}</span>
          <p className="titleDetail text-capitalize">Tất cả</p>
        </div>
      </div>

      <div className="row mt-2 mb-4">
        <h3 className="text-center">Hệ thống cửa hàng</h3>
      </div>

      <div className="mb-4">
        <button
          className={`btn border-0 me-2 ${
            currentTab === "tatca" ? "text-pink fw-bold" : "text-dark"
          }`}
          onClick={() => openCity("tatca")}
        >
          Tất cả
        </button>
        <button
          className={`btn border-0 me-2 ${
            currentTab === "hanoi" ? "text-pink fw-bold" : "text-dark"
          }`}
          onClick={() => openCity("hanoi")}
        >
          Hà Nội
        </button>
        <button
          className={`btn border-0 ${
            currentTab === "hochiminh" ? "text-pink fw-bold" : "text-dark"
          }`}
          onClick={() => openCity("hochiminh")}
        >
          Hồ Chí Minh
        </button>
      </div>

      {currentTab === "tatca" && <AllMap onSelectArea={openCity} />}
      {currentTab === "hanoi" && <HaNoiMap />}
      {currentTab === "hochiminh" && <HCMMap />}
    </div>
  );
}

export default HeThongCuaHang;
