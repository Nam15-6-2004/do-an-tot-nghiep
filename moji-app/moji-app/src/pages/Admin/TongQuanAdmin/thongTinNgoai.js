import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import L from "leaflet";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const getCustomIcon = (type) =>
  L.divIcon({
    className: "custom-icon",
    html: `<i class="bi ${type}" style="font-size: 24px; color: red;"></i>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

function ThongTinNgoai() {
  const data = [
    { name: "Chrome", value: 4306 },
    { name: "Firefox", value: 3801 },
    { name: "Edge", value: 1689 },
    { name: "Other", value: 3251 },
  ];

  const COLORS = ["#4285F4", "#FFBB28", "#FF4444", "#333333"];

  const locations = [
    {
      lat: 20.653865,
      lng: 106.101897,
      name: "Nội Linh - Ngô Quyền - Tiên Lữ - Hưng Yên",
      iconType: "bi-house-door-fill",
    },
    {
      lat: 20.924348,
      lng: 106.048402,
      name: "Mỹ Hào - Hưng Yên",
      iconType: "bi-geo-alt-fill",
    },
    {
      lat: 20.889586,
      lng: 106.023301,
      name: "Yên Mỹ - Hưng Yên",
      iconType: "bi-geo-alt-fill",
    },
    {
      lat: 20.842042,
      lng: 105.992171,
      name: "Khoái Châu - Hưng Yên",
      iconType: "bi-geo-alt-fill",
    },
    {
      lat: 20.705537,
      lng: 106.127313,
      name: "Ngọc Trúc - Minh Hoàng - Phù Cừ - Hưng Yên",
      iconType: "bi-balloon-heart",
    },
  ];

  const center = [20.85, 106.05];
  const [date, setDate] = useState(new Date());
  const [timeNow, setTimeNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-4">
      <div className="row justify-content-center g-4">
        {/* Biểu đồ Pie */}
        <div className="col-lg-6 col-md-8 d-flex flex-column align-items-center">
          <div className="card shadow border-0 w-100">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">📊 Biểu Đồ Trình Duyệt</h5>
              <div className="d-flex flex-column align-items-center">
                <PieChart width={300} height={300}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={70}
                  >
                    {data.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              {/* Chú thích dưới biểu đồ */}
              <div
                className="d-flex flex-column gap-2"
                style={{ padding: "6px 140px" }}
              >
                {data.map((entry, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center justify-content-between"
                  >
                    {/* Trái: biểu tượng màu + tên + % thay đổi */}
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: COLORS[i],
                        }}
                      ></span>
                      <span>{entry.name}</span>
                      {entry.change !== undefined && (
                        <span
                          className={`badge fw-normal ${
                            entry.change >= 0
                              ? "bg-success-subtle text-success"
                              : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {entry.change >= 0
                            ? `+${entry.change}%`
                            : `${entry.change}%`}
                        </span>
                      )}
                    </div>
                    {/* Phải: số lượng */}
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thời gian & Calendar */}
        <div className="col-lg-6 col-md-8 d-flex flex-column align-items-center">
          <div className="card shadow border-0 w-100">
            <div className="card-body text-center">
              <h5 className="card-title">🕒 Thời gian thực</h5>
              <p className="fs-4 fw-bold text-primary">
                {timeNow.toLocaleTimeString()} - {timeNow.toLocaleDateString()}
              </p>
              <hr />
              <div className="d-flex flex-column align-items-center">
                <Calendar
                  onChange={setDate}
                  value={date}
                  className={"rounded-2"}
                />
                <p className="mt-3 text-muted">
                  Ngày bạn chọn: {date.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bản đồ */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">🗺️ Bản Đồ Các Địa Điểm</h5>
              <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc, idx) => (
                  <Marker
                    key={idx}
                    position={[loc.lat, loc.lng]}
                    icon={getCustomIcon(loc.iconType)}
                  >
                    <Popup>{loc.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongTinNgoai;
