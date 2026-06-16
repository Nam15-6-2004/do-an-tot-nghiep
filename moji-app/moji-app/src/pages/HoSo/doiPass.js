import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../services/nguoiDungService";

function DoiPass() {
  const [passCu, setPassCu] = useState("");
  const [passMoi, setPassMoi] = useState("");
  const [passXacNhan, setPassXacNhan] = useState("");
  const Navigate = useNavigate();

  const handleUpdatePass = async () => {
    if (passMoi !== passXacNhan) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (passCu === "" || passMoi === "" || passXacNhan === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const taiKhoan = localStorage.getItem("taiKhoan");
    if (!taiKhoan) {
      alert("Ko tồn tại tài khoản trong localStorage!");
      return;
    }
    const data = {
      taiKhoan: taiKhoan,
      matKhauCu: passCu,
      matKhauMoi: passMoi,
    };
    try {
      await updatePassword(data);
      alert("Đổi mật khẩu thành công!");
      localStorage.removeItem("taiKhoan");
      localStorage.removeItem("token");
      Navigate("/dang-nhap");

      // Reset
      setPassCu("");
      setPassMoi("");
      setPassXacNhan("");
    } catch (error) {
      alert("Đổi mật khẩu thất bại: ", error.response?.data || error.message);
    }
  };
  return (
    <div className="content">
      <h5 className="fw-bold">THAY ĐỔI MẬT KHẨU</h5>
      <p className="description mb-3">
        Bạn nên cập nhập mật khẩu thường xuyên vì lý do bảo mật
      </p>
      <hr />
      <form>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="matKhauCu"
          >
            Mật khẩu cũ:
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="matKhauCu"
              type="text"
              placeholder="Mật khẩu cũ"
              value={passCu}
              onChange={(e) => setPassCu(e.target.value)}
            />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="matKhauMoi"
          >
            Mật khẩu mới:
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="matKhauMoi"
              type="text"
              placeholder="Mật khẩu mới"
              value={passMoi}
              onChange={(e) => setPassMoi(e.target.value)}
            />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="xacNhanMatKhau"
          >
            Xác nhận mật khẩu:
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="xacNhanMatKhau"
              type="text"
              placeholder="Xác nhận mật khẩu"
              value={passXacNhan}
              onChange={(e) => setPassXacNhan(e.target.value)}
            />
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-sm-7 col-12 d-flex justify-content-start ps-sm-0 ps-3">
            <button
              class="btn btn-update"
              type="button"
              onClick={handleUpdatePass}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default DoiPass;
