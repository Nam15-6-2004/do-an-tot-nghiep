import React from "react";
import "./HeThongCuaHang.scss";

const locations = [
  {
    name: "Moji Hồ Tùng Mậu",
    address: "92 Hồ Tùng Mậu, Phường Bến Nghé, Q1",
    phone: "0964904992",
    hours: "10h - 22h",
    image: "/image/HCMMap1.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15678.011332308888!2d106.703583!3d10.772747!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46cd08398d%3A0x687c002236b0f822!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746370787873!5m2!1svi!2sus"
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
    name: "Moji Nguyễn Đình Chiểu",
    address: `459E Nguyễn Đình Chiểu, P5, Q3 (ngã tư Cao Thắng)`,
    phone: "0932147797",
    hours: "10h - 22h",
    image: "/image/HCMMap2.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15678.14590022062!2d106.682351!3d10.770162!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f23f70ed413%3A0xdacdc4212434a740!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746371165991!5m2!1svi!2sus"
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
    name: "Moji Sư Vạn Hạnh",
    address: "708 Sư Vạn Hạnh, P.12, Q.10 (đối diện chéo Vạn Hạnh Mall)",
    phone: "0972243708",
    hours: "10h - 22h",
    image: "/image/HCMMap3.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15678.074273459433!2d106.669883!3d10.771538!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2a66ca405d%3A0x9d4472a13bf4ddca!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746371120548!5m2!1svi!2sus"
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
    name: "Moji Bàu Cát",
    address: "87 Bàu Cát, P.14, Q.Tân Bình (khúc giao Nguyễn Hồng Đào)",
    phone: "0933418487",
    hours: "10h - 22h",
    image: "/image/HCMMap4.jpg",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.959720651328!2d106.641806!3d10.792927!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529c6ed1ed8b9%3A0x6e812dc20a6d62e5!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746370955007!5m2!1svi!2sus"
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
    name: "Moji Phan Xích Long",
    address: "232 Phan Xích Long, P.7, Q.Phú Nhuận",
    phone: "0903209850",
    hours: "10h - 22h",
    image: "/image/HCMMap5.png",
    map: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.69922742214!2d106.689823!3d10.79792!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175299c13dc4797%3A0xfa4bbf40af894330!2zTW9qaSAtIFBo4bulIEtp4buHbiAmIFF1w6AgVOG6t25n!5e0!3m2!1svi!2sus!4v1746370989831!5m2!1svi!2sus"
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

const HCMMap = () => {
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

export default HCMMap;
