import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../../assets/images/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Register",
        data
      );

      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        }
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="container-fluid bg-overlay">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-lg-6 col-md-8 bg-white rounded px-5 py-4 shadow">
            <div className="text-center mb-3">
              <img src={logo} alt="Logo" className="img-fluid" width={200} />
            </div>

            <h2 className="h5">Register</h2>
            <p className="text-muted mb-4">Please enter your details.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="row">
              <div className="col-6">

             
              {/* Username */}
              <div className="mb-3"> 
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <span className="text-danger">{errors.username.message}</span>
                )}
              </div>

              {/* Email */}
              <div className="mb-3"> 
                <div className="input-group">
                  <span className="input-group-text">
                    <i
                      className="fa fa-envelope text-secondary"
                      aria-hidden="true"
                    ></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div> 

              {/* Country */}
              <div className="mb-3"> 
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your country"
                  {...register("country", { required: "Country is required" })}
                />
                {errors.country && (
                  <span className="text-danger">{errors.country.message}</span>
                )}
              </div>
              </div>
              <div className="col-6">          
              {/* Phone Number */}
              <div className="mb-3"> 
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <span className="text-danger">{errors.phone.message}</span>
                )}
              </div>

              {/* Password */}
              <div className="mb-3"> 
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <i className={`fa fa-eye${showPassword ? "-slash" : ""}`} aria-hidden="true"></i>
                  </button>
                </div>
                {errors.password && (
                  <span className="text-danger">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3"> 
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <i className={`fa fa-eye${showConfirmPassword ? "-slash" : ""}`} aria-hidden="true"></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-danger">{errors.confirmPassword.message}</span>
                )}
              </div>
              </div>
              {/* Register Button */}
              <button className="btn btn-success w-100">Register</button>
            </form>

            {/* Login Redirect */}
            <div className="text-center mt-3">
              <Link to="/login" className="text-success text-decoration-none">
                Already have an account? Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
