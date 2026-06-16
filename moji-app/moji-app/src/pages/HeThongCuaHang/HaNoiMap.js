import React from "react";
import "./HeThongCuaHang.scss";

const locations = [
  {
    name: "Moji Bà Triệu",
    address: "81 Bà Triệu, Hai Bà Trưng",
    phone: "0968317253",
    hours: "9h - 22h",
    image: "/image/hanoiMap1.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14897.42948984452!2d105.849415!3d21.018382!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab927d7f460d%3A0x95e6df9f3baad42c!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1sen!2sus!4v1746368196045!5m2!1sen!2sus"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ Moji Chùa Bộc"
      ></iframe>
    ),
  },

  {
    name: "Moji Chùa Bộc",
    address: "241 Chùa Bộc, Đống Đa",
    phone: "0904536337",
    hours: "9h - 22h",
    image: "/image/hanoiMap2.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14898.407231690011!2d105.825749!3d21.008593000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab635b89b0f1%3A0x7237d2e4f1debc74!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746369134533!5m2!1svi!2sus"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ Moji Chùa Bộc"
      ></iframe>
    ),
  },
  {
    name: "Moji Trần Đại Nghĩa",
    address: "60 Trần Đại Nghĩa, Hai Bà Trưng",
    phone: "0971913545",
    hours: "9h - 22h",
    image: "/image/hanoiMap3.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14899.14287311954!2d105.845148!3d21.001225!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac71478f52dd%3A0xe0f0263ae0f5dd90!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746369301156!5m2!1svi!2sus"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ Moji Chùa Bộc"
      ></iframe>
    ),
  },

  {
    name: "Moji Nguyễn Trãi",
    address: "226 Nguyễn Trãi, Q.Nam Từ Liêm (gần ĐH Hà Nội)",
    phone: "0987545005",
    hours: "9h - 22h",
    image: "/image/hanoiMap4.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14900.491906793888!2d105.797429!3d20.987707!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc70c267b1b%3A0xdffd0e6c4c89af25!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746369790563!5m2!1svi!2sus"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ Moji Chùa Bộc"
      ></iframe>
    ),
  },

  {
    name: "Moji Xuân Thủy",
    address: "157 Xuân Thủy, Cầu Giấy",
    phone: "0963819567",
    hours: "9h - 22h",
    image: "/image/hanoiMap5.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14895.627085003516!2d105.784137!3d21.036416!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba257897c07%3A0x92bf9bdd0bcec4bc!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746369887709!5m2!1svi!2sus"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ Moji Chùa Bộc"
      ></iframe>
    ),
  },
];

const HaNoiMap = () => {
  return (
    <div className="container my-4 HaNoiMap">
      {locations.map((loc, index) => (
        <div key={index} className="row location-row align-items-start">
          <div className="col-lg-6 col-12 mb-3 mb-lg-0">
            <img
              src={loc.image}
              alt={`Ảnh cửa hàng ${loc.name}`}
              className="img-fluid"
              style={{
                width: "700px",
                height: "352px",
                objectFit: "cover",
              }}
            />
          </div>

          <div className="col-lg-6 col-12 location-info">
            <div className="location-title mb-3">{loc.name}</div>
            <div>
              <i className="bi bi-geo-alt-fill icon"></i>
              <span className="info-text">{loc.address}</span>
            </div>
            <div>
              <i className="bi bi-telephone-fill icon"></i>
              <span className="info-text">{loc.phone}</span>
            </div>
            <div>
              <i className="bi bi-clock-fill icon"></i>
              <span className="info-text">{loc.hours}</span>
            </div>
            <div className="map-embed mt-3">{loc.map}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HaNoiMap;
