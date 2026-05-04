import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../utils/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Vui lòng nhập tên đăng nhập";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi(form.username, form.password);
      const data = response.data;

      if (data.code === 1000) {
        login(data.result.token);
        const payload = JSON.parse(atob(data.result.token.split(".")[1]));
        const scopes = payload.scope ? payload.scope.split(" ") : [];
        
        if (scopes.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (scopes.includes("ROLE_ORGANIZER")) {
          navigate("/organizer");
        } else {
          navigate("/");
        }
      } else {
        setServerError(data.message || "Sai tên đăng nhập hoặc mật khẩu");
      }
    } catch (error) {
      if (error.response) {
        // Server có phản hồi nhưng mã lỗi (401, 404, 500...)
        const data = error.response.data;
        if (error.response.status === 401) {
          setServerError("Sai tên đăng nhập hoặc mật khẩu.");
        } else {
          setServerError(data.message || "Có lỗi xảy ra từ máy chủ.");
        }
      } else if (error.request) {
        // Gửi được request nhưng không nhận được phản hồi (rớt mạng, server sập)
        setServerError("Không thể kết nối đến server. Vui lòng kiểm tra lại mạng.");
      } else {
        setServerError("Lỗi hệ thống: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px", margin: "15px" }}>
        <div className="text-center mb-4">
          <h3>🔞 Đăng nhập</h3>
          <p className="text-muted">Chào mừng bạn quay trở lại</p>
        </div>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập</label>

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
            />

            <div className="invalid-feedback">{errors.username}</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />

            <div className="invalid-feedback">{errors.password}</div>
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center mt-3">
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </div>
        <div className="text-center mt-2">
          <a href="/forgot-password" className="text-muted small text-decoration-none">Quên mật khẩu?</a>
        </div>
        {/* <hr className="my-3 opacity-25" />
        <div className="text-center">
          <a 
            href="https://blog-guide-event-mng.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-info btn-sm rounded-pill px-4"
          >
            📕 Sổ tay hướng dẫn
          </a>
        </div> */}
      </div>
    </div>
  );
}
