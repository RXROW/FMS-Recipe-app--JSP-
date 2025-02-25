import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; 

import {  axiosPublicInstance,  USER_URLS } from "../../../Services/Urls/Urls";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosPublicInstance.post(
        USER_URLS.FORGET_PASS,
        data
      );

      toast.success("Reset link sent! Check your email.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      navigate("/reset-password");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again!",
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
          <div className="col-lg-4 col-md-6 bg-white rounded-3 shadow p-4">
            {/* Logo Section */}
            <div className="text-center mb-3">
              <img
                src={logo}
                alt="Company Logo"
                className="img-fluid"
                width={330}
              />
            </div>

            {/* Title */}
            <h2 className="h5">Forgot Your Password?</h2>
            <p className="text-secondary small">
              Enter your email to receive a password reset link.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="my-5">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-envelope text-secondary"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
