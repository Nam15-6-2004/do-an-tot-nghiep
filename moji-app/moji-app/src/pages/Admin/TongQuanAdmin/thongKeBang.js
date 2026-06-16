import { useEffect, useState } from "react";
import { getPhanLoaiTrangThai } from "../../../services/thongKeService";
import { Modal } from "react-bootstrap";

function ThongKeBang() {
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize] = useState(5);
  const [filterOrderStatus, setFilterOrderStatus] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getPhanLoaiTrangThai();

        let all = [];
        if (res.daDuyet)
          all = all.concat(
            res.daDuyet.map((o) => ({
              ...o,
              status: "Đã duyệt",
              statusColor: "bg-success",
            }))
          );
        if (res.choDuyet)
          all = all.concat(
            res.choDuyet.map((o) => ({
              ...o,
              status: "Chờ duyệt",
              statusColor: "bg-warning text-dark",
            }))
          );
        if (res.daHuy)
          all = all.concat(
            res.daHuy.map((o) => ({
              ...o,
              status: "Đã hủy",
              statusColor: "bg-danger",
            }))
          );
        setOrders(all);
      } catch (error) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  // Filter and paginate orders
  let filteredOrders = [];
  if (filterOrderStatus === "Tất cả") {
    // Sắp xếp theo ngày bán mới nhất nếu là tất cả
    filteredOrders = [...orders].sort(
      (a, b) => new Date(b.ngayBan) - new Date(a.ngayBan)
    );
  } else {
    filteredOrders = orders.filter((o) => o.status === filterOrderStatus);
  }
  const totalOrderPages = Math.ceil(filteredOrders.length / orderPageSize) || 1;
  const pagedOrders = filteredOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );

  // Reset page if filter changes
  useEffect(() => {
    setOrderPage(1);
  }, [filterOrderStatus]);
  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3001${imageArray[0]}`;
    }
    return "/image/default.jpg";
  };

  // In hóa đơn
  const handlePrint = () => {
    if (!selectedOrder) return;
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn bán hàng - ${selectedOrder.khachHang || ""}</title>
        <style>
          @page { size: A4; margin: 2cm; }
          body { width: 210mm; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.3; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; border: 1px solid #dee2e6; }
          th { background-color: #f8f9fa; text-align: center; }
          .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">NLSHOP</h2>
          <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">HÓA ĐƠN BÁN HÀNG</h3>
        </div>
        <div style="margin-bottom: 20px;">
          <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin hóa đơn</h4>
          <p><strong>Khách hàng:</strong> ${selectedOrder.khachHang || ""}</p>
          <p><strong>Ngày bán:</strong> ${selectedOrder.ngayBan
        ? new Date(selectedOrder.ngayBan).toLocaleDateString("vi-VN")
        : ""
      }</p>
          <p><strong>Phương thức:</strong> ${selectedOrder.phuongThuc || ""}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">STT</th>
              <th style="width: 15%;">Hình ảnh</th>
              <th style="width: 35%;">Sản phẩm</th>
              <th style="width: 15%;">Đơn giá</th>
              <th style="width: 10%;">Số lượng</th>
              <th style="width: 20%;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${(selectedOrder.chiTiet || [])
        .map(
          (item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">
                  <img src="http://localhost:3001${Array.isArray(item.anhSP) ? item.anhSP[0] : item.anhSP || ""
            }" class="product-image" alt="${item.tenSP || ""}"/>
                </td>
                <td>${item.tenSP || ""}</td>
                <td style="text-align: right;">${item.donGia ? item.donGia.toLocaleString("vi-VN") : "0"
            }đ</td>
                <td style="text-align: center;">${item.soLuong || "0"}</td>
                <td style="text-align: right;">${item.thanhTien ? item.thanhTien.toLocaleString("vi-VN") : "0"
            }đ</td>
              </tr>
            `
        )
        .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align: right;"><strong>Tổng cộng:</strong></td>
              <td style="text-align: right;"><strong>${selectedOrder.tongTien
        ? selectedOrder.tongTien.toLocaleString("vi-VN")
        : 0
      }đ</strong></td>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top: 50px; text-align: center;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 50%; border: none; text-align: center;">
                <p style="margin: 0;"><strong>Người mua hàng</strong></p>
                <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                <div style="height: 80px;"></div>
              </td>
              <td style="width: 50%; border: none; text-align: center;">
                <p style="margin: 0;"><strong>Người bán hàng</strong></p>
                <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                <div style="height: 80px;"></div>
              </td>
            </tr>
          </table>
        </div>
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
          <p style="margin: 5px 0;">Cảm ơn quý khách đã tin tưởng và mua sắm tại NLSHOP!</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@NLSHOP.com</p>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
        </div>
      </body>
      </html>
    `;
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();
    printFrame.onload = () => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    };
  };

  return (
    <div className="row g-3">
      {/* đơn hàng */}
      <div className="card shadow-sm mb-5 p-0">
        <div
          className="card-header text-dark d-flex justify-content-between align-items-center px-3 py-2 rounded-top shadow-sm"
          style={{ backgroundColor: "#0d6efd" }}
        >
          <h5 className="mb-0 fw-semibold text-white">Đơn hàng mới nhất</h5>
          <select
            className="form-select form-select-sm w-auto custom-select-order"
            value={filterOrderStatus}
            onChange={(e) => setFilterOrderStatus(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark text-center">
              <tr>
                <th className="text-dark">STT</th>
                <th className="text-dark">Khách hàng</th>
                <th className="text-dark">Ngày bán</th>
                <th className="text-dark">Phương thức</th>
                <th className="text-dark">Tổng tiền (VNĐ)</th>
                <th className="text-dark">Trạng thái</th>
                <th className="text-dark">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {pagedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                pagedOrders.map((o, idx) => (
                  <tr key={o.khachHang + o.ngayBan + o.trangThai + idx}>
                    <td>{(orderPage - 1) * orderPageSize + idx + 1}</td>
                    <td>{o.khachHang}</td>
                    <td>{new Date(o.ngayBan).toLocaleDateString("vi-VN")}</td>
                    <td>{o.phuongThuc}</td>
                    <td>{o.tongTien.toLocaleString()} đ</td>
                    <td>
                      <span className={`badge ${o.statusColor}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-info btn-sm rounded-circle"
                        onClick={() => {
                          setSelectedOrder(o);
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Phân trang đơn hàng */}
        <nav className="mt-2">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${orderPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setOrderPage(orderPage - 1)}
              >
                &laquo;
              </button>
            </li>
            {[...Array(totalOrderPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${orderPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setOrderPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${orderPage === totalOrderPages ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() => setOrderPage(orderPage + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {/* Modal chi tiết hóa đơn */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder &&
            selectedOrder.chiTiet &&
            selectedOrder.chiTiet.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light text-center">
                  <tr>
                    <th>STT</th>
                    <th className="text-start">Tên sản phẩm</th>
                    <th>Ảnh</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {selectedOrder.chiTiet.map((ct, idx) => (
                    <tr key={ct.tenSP + idx}>
                      <td>{idx + 1}</td>
                      <td className="text-start">{ct.tenSP}</td>
                      <td>
                        {ct.anhSP ? (
                          <img
                            src={getProductImage(ct.anhSP)}
                            alt={ct.tenSP}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <span className="text-muted">Không có ảnh</span>
                        )}
                      </td>
                      <td>{ct.soLuong}</td>
                      <td>{ct.donGia?.toLocaleString()} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted">
              Không có chi tiết hóa đơn
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handlePrint}>
            In hóa đơn
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Đóng
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default ThongKeBang;
