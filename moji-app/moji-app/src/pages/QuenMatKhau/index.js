import "./DoiMatKhau.scss";
function QuenMatKhau() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // xử lý logic xác nhận email ở đây
  };
  return (
    <div className="forgot-password-container">
      <div className="card">
        <div className="card-header">QUÊN MẬT KHẨU</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                * Nhập địa chỉ email:
              </label>
              <input type="email" className="form-control" id="email" />
            </div>
            <button type="submit" className="btn btn-pink w-100 rounded-2 py-2">
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuenMatKhau;
