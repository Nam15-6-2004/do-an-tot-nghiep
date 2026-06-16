import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getAllThongKeDoanhThu7Ngay,
  getAllThongKeTop5DanhMucBanChay,
} from "../../../services/thongKeService";

function ThongKeChart() {
  // Màu sắc cho biểu đồ tròn
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

  // Dữ liệu cho biểu đồ cột
  const [dataCot, setDataCot] = useState([]);
  const [dataTron, setDataTron] = useState([]);

  useEffect(() => {
    const fetchDataCot = async () => {
      try {
        const data = await getAllThongKeDoanhThu7Ngay();
        if (data && data.AllDoanhThuNgay) {
          const formattedData = data.AllDoanhThuNgay.map((item) => ({
            ngayBan: item.ngayBan,
            doanhThu: item.doanhThu,
          }));
          setDataCot(formattedData);
        }
      } catch (error) {
        console.error("Lỗi gọi biểu đô cột:", error);
      }
    };
    const fetchDataTron = async () => {
      try {
        const data = await getAllThongKeTop5DanhMucBanChay();
        if (data && data.AllTop5DanhMucBanChay) {
          const formattedData = data.AllTop5DanhMucBanChay.map((item) => ({
            ma_CTDM: item.ma_CTDM,
            tenCTDM: item.tenCTDM,
            soLuong: Number(item.soLuong),
          }));
          setDataTron(formattedData);
        }
      } catch (error) {
        console.error("Lỗi gọi biểu đồ tròn:", error);
      }
    };

    fetchDataCot();
    fetchDataTron();
  }, []);

  return (
    <div className="row my-4">
      <div className="container mt-4">
        <div className="row">
          {/* Biểu đồ cột */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  Tổng doanh thu bán hàng trong 7 ngày
                </h5>
                <BarChart width={470} height={300} data={dataCot}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="ngayBan"
                    // 14/05
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      return `${day}/${month}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => value.toLocaleString() + "đ"}
                  />
                  <Bar dataKey="doanhThu" fill="#8884d8" />
                </BarChart>
              </div>
            </div>
          </div>

          {/* Biểu đồ tròn */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  Top 5 danh mục có sản phẩm bán chạy
                </h5>
                <PieChart width={500} height={300}>
                  <Pie
                    data={dataTron}
                    cx="40%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    // label={({ name, percent }) =>
                    //   `${name} ${(percent * 100).toFixed(0)}%`
                    // } // tên + %
                    nameKey="tenCTDM"
                    dataKey="soLuong"
                  >
                    {dataTron.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      return [` Số lượng: ${value}`];
                    }}
                    labelFormatter={(label) => label}
                  />

                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ right: 60 }}
                  />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongKeChart;
