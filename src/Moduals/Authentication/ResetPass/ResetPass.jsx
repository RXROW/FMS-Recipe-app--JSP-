import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; 

import {  axiosPublicInstance,  USER_URLS } from "../../../Services/Urls/Urls";

const ResetPassword = () => {
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
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    } 
   
    try {
      const response = await axiosPublicInstance.post( 
        USER_URLS.RESET_PASS,
        data
      );
      console.log(response.data);
      toast.success("Password reset successfully", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. Please try again.",
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
          <div className="col-lg-4 col-md-6 bg-white rounded rounded-2 px-5 py-3">
            <div className="logo-container text-center">
              <img src={logo} alt="logo" width={350} />
            </div>
            <h2 className="h5 mt-3">Reset Password</h2>
            <p className="small text-secondary  ">
              Please enter your OTP or check your inbox
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group my-3">
                <span className="input-group-text">
                  <i className="fa fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}

              <div className="input-group my-3">
                <span className="input-group-text">
                  <i className="fa fa-lock text-secondary"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="OTP"
                  {...register("seed", { required: "OTP is required" })}
                />
              </div>
              {errors.otp && (
                <span className="text-danger">{errors.otp.message}</span>
              )}

              <div className="input-group my-3">
                <span className="input-group-text">
                  <i className="fa fa-lock text-secondary"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="New Password"
                  {...register("password", {
                    required: "New password is required",
                  })}
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={
                      showPassword
                        ? "fa fa-eye-slash text-secondary"
                        : "fa fa-eye text-secondary"
                    }
                  ></i>
                </span>
              </div>
              {errors.password && (
                <span className="text-danger">
                  {errors.password.message}
                </span>
              )}

              <div className="input-group my-3">
                <span className="input-group-text">
                  <i className="fa fa-lock text-secondary"></i>
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm New Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={
                      showConfirmPassword
                        ? "fa fa-eye-slash text-secondary"
                        : "fa fa-eye text-secondary"
                    }
                  ></i>
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="text-danger">
                  {errors.confirmPassword.message}
                </span>
              )}

              <button className="btn btn-success w-100 my-2">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
