import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Important import for toast styling
import logo from "../../../assets/images/logo.png";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { axiosPublicInstance, USER_URLS } from "../../../Services/Urls/Urls";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "../../../Services/Valdition";

const Login = () => {
  const { saveLoginData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();



  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosPublicInstance.post(
        USER_URLS.LOGIN,
        data
      );

      localStorage.setItem("token", response.data.token);
      saveLoginData();

      toast.success("Login successful!");

      // Short delay to show toast before redirecting
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";

      // Check if the error is related to password
      if (errorMessage.toLowerCase().includes("password") ||
        errorMessage.toLowerCase().includes("credentials")) {
        setError("password", {
          type: "manual",
          message: "Invalid password. Please try again."
        });

        toast.error("Invalid password. Please check your credentials.", toastConfig);
      } else if (errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("user")) {
        setError("email", {
          type: "manual",
          message: "This email is not registered or invalid."
        });

        toast.error("Invalid email. Please check your credentials.", toastConfig);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="container-fluid bg-overlay">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 bg-white rounded px-4 px-md-5 py-4 shadow">
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "200px" }} />
            </div>
            <h2 className="text-center mb-2">Welcome Back</h2>
            <p className="text-muted text-center mb-4">Please enter your credentials to log in</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <div className="form-group mb-4">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-envelope text-secondary"></i>
                  </span>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="example@domain.com"
                    {...register("email", EMAIL_VALIDATION)}
                  />
                </div>
                {errors.email && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-key text-secondary"></i>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="••••••••"
                    {...register("password", PASSWORD_VALIDATION)}
                  />
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="d-flex justify-content-between mb-4">
                <Link to="/register" className="text-muted text-decoration-none">
                  Create an account
                </Link>
                <Link to="/forget-password" className="text-success text-decoration-none">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </div>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;