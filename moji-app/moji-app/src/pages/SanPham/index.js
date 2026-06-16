import React, { useEffect, useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import ProductList from "../../components/Product/ProductList";
import CategoryList from "../../components/Category/CategoryList";
import {
  getAllCtCategory,
  searchSPtoCTDM,
} from "../../services/danhMucService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./sanPham.scss";
import {
  getSelectGiaTien,
  getTheoGiaTien,
} from "../../services/sanPhamService";
import Chat from "../../components/chat";

function SanPham() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ma_CTDM = searchParams.get("ma_CTDM");
  const tuKhoa = searchParams.get("q");

  const [selectedCategory, setSelectedCategory] = useState({
    id: null,
    name: "Danh sách sản phẩm",
  });

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (tuKhoa) {
        try {
          const res = await searchSPtoCTDM(tuKhoa);
          if (res.type === "ChiTietDanhMuc") {
            const first = res.result[0];
            setSelectedCategory({
              id: first.ma_CTDM,
              name: `Tìm kiếm: "${tuKhoa}"`,
            });
            setSearchResults(first.SanPhams);
          } else if (res.type === "SanPham") {
            setSelectedCategory({ id: null, name: `Tìm kiếm: "${tuKhoa}"` });
            setSearchResults(res.result);
          }
        } catch (error) {
          console.error("Lỗi tìm kiếm:", error);
        }
      } else if (ma_CTDM) {
        try {
          const categories = await getAllCtCategory();
          const selected = categories.find((cat) => cat.ma_CTDM === ma_CTDM);
          if (selected) {
            setSelectedCategory({ id: ma_CTDM, name: selected.tenCTDM });
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh mục:", error);
        }
      } else {
        setSelectedCategory({ id: null, name: "Danh sách sản phẩm" });
      }
    };

    fetchSearchData();
  }, [ma_CTDM, tuKhoa]);

  const handleSelectedCategory = (categoryId, categoryName) => {
    setSelectedCategory({ id: categoryId, name: categoryName });

    if (categoryId) {
      navigate(`/san-pham?ma_CTDM=${categoryId}`);
    } else {
      navigate("/san-pham");
    }
  };

  const [sapXep, setSapXep] = useState("moiNhat");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [locGia, setLocGia] = useState(5000000);

  useEffect(() => {
    const fetchData = async () => {
      if (!tuKhoa && !ma_CTDM) {
        try {
          const res = await getSelectGiaTien(sapXep);
          setSortedProducts(res);
        } catch (error) {
          console.error("Lỗi sắp xếp sản phẩm:", error);
        }
      }
    };
    fetchData();
  }, [sapXep, tuKhoa, ma_CTDM]);

  useEffect(() => {
    const fetchDataTheoGia = async () => {
      console.log("Đang lọc theo giá:", locGia);
      try {
        const res = await getTheoGiaTien(Number(locGia));
        let filteredResults = res;

        // Nếu đang ở trong một danh mục, lọc kết quả theo danh mục đó
        if (ma_CTDM) {
          filteredResults = res.filter((p) => p.ma_CTDM === ma_CTDM);
        }

        // Nếu đang tìm kiếm, lọc kết quả theo từ khóa
        if (tuKhoa) {
          const lowerKey = tuKhoa.toLowerCase();
          filteredResults = filteredResults.filter(
            (p) =>
              p.tenSP.toLowerCase().includes(lowerKey) ||
              (p.moTa && p.moTa.toLowerCase().includes(lowerKey))
          );
        }

        console.log("Dữ liệu sau khi lọc:", filteredResults);
        setSortedProducts(filteredResults);
        if (tuKhoa || ma_CTDM) {
          setSearchResults(filteredResults);
        }
      } catch (error) {
        console.error("Lỗi lọc theo giá:", error);
      }
    };
    fetchDataTheoGia();
  }, [locGia, tuKhoa, ma_CTDM]);

  const handleSortChange = (e) => {
    setSapXep(e.target.value);
  };

  const handlePriceChange = (gia) => {
    setLocGia(gia);
  };

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 16;

  useEffect(() => {
    setCurrentPage(1);
  }, [tuKhoa, ma_CTDM]);

  const getPaginatedData = () => {
    const data = tuKhoa || ma_CTDM ? searchResults : sortedProducts;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return data.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  const totalPages = Math.ceil(
    (tuKhoa || ma_CTDM ? searchResults.length : sortedProducts.length) /
      recordsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container my-4">
      {id ? (
        <Outlet />
      ) : (
        <div className="row">
          {/* DANH MỤC */}
          <div className="col-md-3">
            <CategoryList
              onSelectCategory={handleSelectedCategory}
              onPriceChange={handlePriceChange}
            />
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="product-title fw-bold">{selectedCategory.name}</h5>
              <select
                className="form-select w-auto"
                value={sapXep}
                onChange={handleSortChange}
              >
                <option value="moiNhat">Mới nhất</option>
                <option value="giaTangDan">Giá tăng dần</option>
                <option value="giaGiamDan">Giá giảm dần</option>
              </select>
            </div>

            <ProductList
              rows={100}
              selectedCategory={selectedCategory.id}
              searchKeyword={tuKhoa}
              searchResults={getPaginatedData()}
            />

            {/* Phân trang */}
            <nav>
              <ul className="pagination-container">
                {currentPage > 1 && (
                  <li>
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                        className={`pagination-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                {currentPage < totalPages && (
                  <li>
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      &raquo;
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
      <Chat />
    </div>
  );
}

export default SanPham;
