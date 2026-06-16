import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useRef, useState } from "react";
import {
  deleteBill,
  getAllBill,
  getBillById,
  searchBill,
  updateBill,
} from "../../../services/hoaDonBanService";
import { getUserById } from "../../../services/nguoiDungService";
import { getProductById } from "../../../services/sanPhamService";
import { toast } from "react-toastify";
import { sendEmail } from "../../../services/sendEmailService";

function HoaDonBanAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }
  const handlePrint = () => {
    // Tạo iframe ẩn
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    // Tạo nội dung in
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn bán hàng - ${selectedBill?.maHDB || ""}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            width: 210mm;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.3;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 8px;
            border: 1px solid #dee2e6;
          }
          th {
            background-color: #f8f9fa;
            text-align: center;
          }
          .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">NLSHOP</h2>
          <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">HÓA ĐƠN BÁN HÀNG</h3>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@NLSHOP.com</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: none;">
          <tr>
            <td style="width: 48%; padding: 15px; vertical-align: top; border: none;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin hóa đơn</h4>
              <p><strong>Mã hóa đơn:</strong> #${selectedBill?.maHDB || ""}</p>
              <p><strong>Ngày bán:</strong> ${selectedBill?.ngayBan
        ? new Date(selectedBill.ngayBan).toLocaleDateString("vi-VN")
        : ""
      }</p>
              <p><strong>Phương thức:</strong> ${selectedBill?.phuongThuc || ""
      }</p>
            </td>
            <td style="width: 48%; padding: 15px; vertical-align: top; border: none;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin khách hàng</h4>
              <p><strong>Họ tên:</strong> ${users[selectedBill?.maND]?.tenND || ""
      }</p>
              <p><strong>Số điện thoại:</strong> ${users[selectedBill?.maND]?.sdt || ""
      }</p>
              <p><strong>Email:</strong> ${users[selectedBill?.maND]?.email || ""
      }</p>
              <p><strong>Địa chỉ:</strong> ${users[selectedBill?.maND]?.diaChi || ""
      }</p>
            </td>
          </tr>
        </table>

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
            ${selectedBill?.CTHoaDonBans?.map(
        (item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">
                  <img src="http://localhost:3001${item.SanPham?.anhSP?.[0] || ""
          }" 
                       class="product-image" 
                       alt="${item.SanPham?.tenSP || ""}"/>
                </td>
                <td>${item.SanPham?.tenSP || ""}</td>
                <td style="text-align: center;">${item.donGia ? item.donGia.toLocaleString("vi-VN") : "0"
          }đ</td>
                <td style="text-align: center;">${item?.soLuong || "0"}</td>
                <td style="text-align: center;">${item?.thanhTien ? item.thanhTien.toLocaleString("vi-VN") : "0"
          }đ</td>
              </tr>
            `
      ).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align: right;"><strong>Tổng cộng:</strong></td>
              <td style="text-align: center;"><strong>${selectedBill?.tongTien?.toLocaleString("vi-VN") || 0
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

    // Ghi nội dung vào iframe
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();

    // Đợi hình ảnh load xong
    printFrame.onload = () => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    };
  };
  const handleSendEmail = async (email) => {
    try {
      // Giao diện email giống hoàn toàn in hóa đơn
      const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
         <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            width: 210mm;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.3;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 8px;
            border: 1px solid #dee2e6;
          }
          th {
            background-color: #f8f9fa;
            text-align: center;
          }
          .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">NLSHOP</h2>
          <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">HÓA ĐƠN BÁN HÀNG</h3>
          <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
          <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@NLSHOP.com</p>
        </div>
         <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: none;">
          <tr>
            <td style="width: 48%; padding: 15px; vertical-align: top; border: none;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin hóa đơn</h4>
              <p><strong>Mã hóa đơn:</strong> #${selectedBill?.maHDB || ""}</p>
              <p><strong>Ngày bán:</strong> ${selectedBill?.ngayBan
          ? new Date(selectedBill.ngayBan).toLocaleDateString("vi-VN")
          : ""
        }</p>
              <p><strong>Phương thức:</strong> ${selectedBill?.phuongThuc || ""
        }</p>
            </td>
            <td style="width: 48%; padding: 15px; vertical-align: top; border: none;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin khách hàng</h4>
              <p><strong>Họ tên:</strong> ${users[selectedBill?.maND]?.tenND || ""
        }</p>
              <p><strong>Số điện thoại:</strong> ${users[selectedBill?.maND]?.sdt || ""
        }</p>
              <p><strong>Email:</strong> ${users[selectedBill?.maND]?.email || ""
        }</p>
              <p><strong>Địa chỉ:</strong> ${users[selectedBill?.maND]?.diaChi || ""
        }</p>
            </td>
          </tr>
        </table>
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
            ${selectedBill?.CTHoaDonBans?.map(
          (item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">
                  <img src="http://localhost:3001${item.SanPham?.anhSP?.[0] || ""
            }" class="product-image" alt="${item.SanPham?.tenSP || ""}"/>
                </td>
                <td>${item.SanPham?.tenSP || ""}</td>
                <td style="text-align: center;">${item.donGia ? item.donGia.toLocaleString("vi-VN") : "0"
            }đ</td>
                <td style="text-align: center;">${item.soLuong || "0"}</td>
                <td style="text-align: center;">${item.thanhTien ? item.thanhTien.toLocaleString("vi-VN") : "0"
            }đ</td>
              </tr>
            `
        ).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align: center;"><strong>Tổng cộng:</strong></td>
              <td style="text-align: right;"><strong>${selectedBill?.tongTien
          ? selectedBill.tongTien.toLocaleString("vi-VN")
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

      await sendEmail({
        emailTo: email,
        billHtml: emailTemplate,
        orderId: selectedBill.maHDB,
      });
      toast.success("Hoá đơn đã được gửi thành công qua email!");
      // Tắt modal chi tiết hóa đơn nếu gửi thành công
      const modal = document.getElementById("billDetailModal");
      if (modal) {
        const modalInstance =
          window.bootstrap?.Modal.getOrCreateInstance(modal);
        if (modalInstance) modalInstance.hide();
        else modal.classList.remove("show");
      }
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      toast.error("Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.");
    }
  };

  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getAllBill();
        setBills(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      }
    };
    fetchBills();
  }, []);
  // Lấy thông tin người dùng theo maND
  useEffect(() => {
    const fetchUserDetails = async (maND) => {
      try {
        const user = await getUserById(maND);
        setUsers((prevUsers) => ({
          ...prevUsers,
          [maND]: user,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    //
    bills.forEach((bill) => {
      if (bill.maND) {
        fetchUserDetails(bill.maND);
      }
    });
  }, [bills]);

  // Lấy thông tin sản phẩm theo maSP
  useEffect(() => {
    const fetchProductDetails = async (maSP) => {
      try {
        const product = await getProductById(maSP);
        setProducts((prevProducts) => ({
          ...prevProducts,
          [maSP]: product,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    //
    bills.forEach((bill) => {
      bill.CTHoaDonBans.forEach((item) => {
        if (item.maSP) {
          fetchProductDetails(item.maSP);
        }
      });
    });
  }, [bills]);

  const handleViewDetails = async (maHDB) => {
    try {
      const billDetail = await getBillById(maHDB);
      setSelectedBill(billDetail);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi tiết hóa đơn:", error);
    }
  };
  const handleDeleteBill = async (id) => {
    try {
      const data = await deleteBill(id);

      if (data.CTHoaDonBans) {
        // xóa hóa đơn
        setBills((prev) => prev.filter((bill) => bill.maHDB !== id));
        setSelectedBill(null);
      } else {
        //  xóa chi tiết hóa đơn
        const updated = await getBillById(selectedBill.maHDB);

        setBills((prev) =>
          prev.map((bill) => (bill.maHDB === updated.maHDB ? updated : bill))
        );

        setSelectedBill(updated);
      }
      if (window.location.pathname === "/don-nhap-admin") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
    }
  };

  const handleTrangThai = async (maHDB, newTrangThai) => {
    try {
      const updatedBill = await updateBill({ maHDB, trangThai: newTrangThai });
      setBills((prev) =>
        prev.map((bill) => (bill.maHDB === maHDB ? updatedBill : bill))
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchBill(query);
      setBills(data);
    } catch (error) {
      console.log("lỗi tìm kiếm nhà cung cấp: ", error);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch(searchQuery);
      } else {
        getAllBill().then(setBills);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = bills.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(bills.length / recordsPerPage);

  return (
    <div className="container-fluid mt-1">
      <h3 className="mb-5 mt-2 text-center title-text-main ">
        Danh sách đơn hàng xuất
      </h3>
      <div className="d-flex justify-content-end mb-2">
        <div className="quanly-center">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              className="search-input"
              placeholder="Tìm kiếm thông tin ...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">
              <i className="bi bi-search"></i>
            </span>
          </form>
        </div>
      </div>
      {/* new Date(....).toLocaleDateString(vi-VN) */}
      <table className="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>Ngày đặt</th>
            <th>Khách hàng</th>
            {/* <th>Giảm giá</th> */}
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Tổng tiền</th>
            {/* <th>Ghi chú</th> */}
            <th>Trạng thái</th>
            <th colSpan={2}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((bill) => (
            <tr key={bill.maHDB}>
              <td>{new Date(bill.ngayBan).toLocaleDateString("vi-VN")}</td>
              <td>{users[bill.maND]?.tenND}</td>
              {/* <td>{bill.giamGia}đ</td> */}
              <td>{users[bill.maND]?.sdt}</td>
              <td>{users[bill.maND]?.diaChi}</td>
              <td>{users[bill.maND]?.email}</td>
              <td>{bill.tongTien.toLocaleString("vi-VN")}đ</td>
              {/* <td>{bill.ghiChu}</td> */}

              <td>
                <select
                  className="form-select"
                  value={bill.trangThai}
                  onChange={(e) => handleTrangThai(bill.maHDB, e.target.value)}
                >
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDeleteBill(bill.maHDB)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#billDetailModal"
                  onClick={() => handleViewDetails(bill.maHDB)}
                >
                  <i className="bi bi-file-earmark-text"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        {/* Select số bản ghi */}
        <div className="d-flex align-items-center">
          <label className="me-2 fw-semibold">Hiển thị:</label>
          <select
            className="form-select w-auto"
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Phân trang */}
        <nav>
          <ul className="pagination-container">
            {currentPage > 1 && (
              <li>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  &laquo;
                </button>
              </li>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(currentPage - 2, 0),
                Math.min(currentPage + 1, totalPages)
              )
              .map((page) => (
                <li key={page}>
                  <button
                    className={`pagination-btn ${currentPage === page ? "active" : ""
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

            {currentPage < totalPages && (
              <li>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="modal" id="billDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết hóa đơn</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered text-center align-middle">
                <thead>
                  <tr>
                    <th>Mã hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Ảnh</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill &&
                    selectedBill.CTHoaDonBans.map((detail, index) => (
                      <tr key={index}>
                        <td>{products[detail.maSP]?.code}</td>
                        <td>{products[detail.maSP]?.tenSP}</td>
                        <td>{detail.soLuong}</td>
                        <td>
                          <img
                            src={`http://localhost:3001${detail.SanPham.anhSP[0]}`}
                            alt="Sản phẩm"
                            width="60"
                            height="70"
                          />
                        </td>
                        <td>{detail.donGia.toLocaleString("vi-VN")}đ</td>
                        <td>{detail.thanhTien.toLocaleString("vi-VN")}đ</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteBill(detail.ma_CTHDB)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
              >
                In hóa đơn
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleSendEmail(users[selectedBill.maND]?.email)}
              >
                Gửi email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoaDonBanAdmin;
