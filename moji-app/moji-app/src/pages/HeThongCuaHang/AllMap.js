import React from "react";
import "./HeThongCuaHang.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AllMap = ({ onSelectArea }) => {
  return (
    <div className="container py-4 allmapne">
      <div className="map-section">
        <div className="section-header-wrapper">
          <div className="section-header">Khu vực Hà Nội</div>
          <div className="detail-link" onClick={() => onSelectArea("hanoi")}>
            Chi tiết <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
        <div className="map-container">
          <img
            className="map-image"
            src="/image/AllMap1.png"
            alt="Bản đồ Hà Nội"
          />
        </div>
      </div>

      <div className="map-section">
        <div className="section-header-wrapper">
          <div className="section-header">Khu vực HCM</div>
          <div
            className="detail-link"
            onClick={() => onSelectArea("hochiminh")}
          >
            Chi tiết <FontAwesomeIcon icon={faPlus} className="plus-icon" />
          </div>
        </div>
        <div className="map-container">
          <img
            className="map-image"
            src="/image/AllMap2.png"
            alt="Bản đồ Hồ Chí Minh"
          />
        </div>
      </div>
    </div>
  );
};

export default AllMap;
