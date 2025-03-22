/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { axiosPublicInstance, USER_URLS } from "../../../Services/Urls/Urls";

// Error Message Component
const ErrorMessage = ({ message }) =>
  message ? <div className="alert alert-danger mt-1">{message}</div> : null;

export default function Registration() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibilityConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  // Create form data
  const appendFormData = (data) => {
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("country", data.country);
    formData.append("phoneNumber", data.phoneNumber);
    // Only append profileImage if it exists
    if (data.profileImage && data.profileImage[0]) {
      formData.append("profileImage", data.profileImage[0]);
    }
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    return formData;
  };

  // Submit data to the server
  async function onSubmit(data) {
    setLoadingBtn(true);
   
    try {
      const registerForm = appendFormData(data);
      const response = await axiosPublicInstance.post(
        USER_URLS.REGISTER,
        registerForm
      );
      console.log(response.data)
      toast.success("Registration successful!");
      navigate("/verify-account");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during registration.";
      toast.error(errorMessage);
    } finally {
      setLoadingBtn(false);
    }
  }

  // Validate username
  const validateUserName = (value) => {
    if (value.length < 4) {
      return "Username must be at least 4 characters.";
    }
    const pattern = /^[a-zA-Z]+\d+$/;
    if (!pattern.test(value)) {
      return "Username must contain letters and end with numbers without spaces.";
    }
    return true;
  };

  // Validate password
  const validatePassword = (value) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!pattern.test(value)) {
      return "Password must contain at least one lowercase, one uppercase letter, one digit, one special character, and be at least 6 characters long.";
    }
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (value) => {
    const password = getValues("password");
    if (value !== password) {
      return "Passwords do not match.";
    }
    return true;
  };

  return (
    <section className="auth-section">
      <div className="auth-container vh-100">
        <div className="container-fluid vh-100 bg-overlay">
          <div className="row vh-100 justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="bg-white rounded-3 px-4 px-md-5 py-4 shadow">
                <div className="text-center mb-4">
                  <img className="w-50" src={logo} alt="logo" />
                </div>
                <h3 className="text-center mb-2">Create an Account</h3>
                <p className="text-muted text-center mb-4">Please enter your details to get started</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      {/* Username */}
                      <div className="form-group mb-3">
                        <label htmlFor="userName" className="form-label">Username</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fa-solid fa-user"></i>
                          </span>
                          <input
                            id="userName"
                            className={`form-control ${errors.userName ? "is-invalid" : ""}`}
                            type="text"
                            placeholder="e.g., john123"
                            {...register("userName", {
                              required: "Username is required.",
                              validate: validateUserName,
                            })}
                          />
                        </div>
                        <ErrorMessage message={errors.userName?.message} />
                      </div>

                      {/* Country */}
                      <div className="form-group mb-3">
                        <label htmlFor="country" className="form-label">Country</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fa-solid fa-flag"></i>
                          </span>
                          <input
                            id="country"
                            className={`form-control ${errors.country ? "is-invalid" : ""}`}
                            type="text"
                            placeholder="e.g., United States"
                            {...register("country", {
                              required: "Country is required.",
                            })}
                          />
                        </div>
                        <ErrorMessage message={errors.country?.message} />
                      </div>

                      {/* Password */}
                      <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fa-solid fa-lock"></i>
                          </span>
                          <input
                            id="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password", {
                              required: "Password is required.",
                              validate: validatePassword,
                            })}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            <i
                              className={`fa-regular fa-eye${showPassword ? "-slash" : ""}`}
                            ></i>
                          </button>
                        </div>
                        <ErrorMessage message={errors.password?.message} />
                      </div>
                    </div>

                    {/* Second column */}
                    <div className="col-md-6">
                      {/* Email */}
                      <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fa-solid fa-envelope"></i>
                          </span>
                          <input
                            id="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            type="email"
                            placeholder="example@domain.com"
                            {...register("email", {
                              required: "Email is required.",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format.",
                              },
                            })}
                          />
                        </div>
                        <ErrorMessage message={errors.email?.message} />
                      </div>

                      {/* Phone Number - Fixed registration property name */}
                      <div className="form-group mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fa-solid fa-mobile-screen-button"></i>
                          </span>
                          <input
                            id="phoneNumber"
                            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                            type="tel"
                            placeholder="+1 (555) 555-5555"
                            {...register("phoneNumber", {
                              required: "Phone number is required.",
                              pattern: {
                                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
                                message: "Invalid phone number format.",
                              },
                            })}
                          />
                        </div>
                        <ErrorMessage message={errors.phoneNumber?.message} />
                      </div>

                      {/* Confirm Password */}
                      <div className="form-group mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fa-solid fa-lock"></i>
                          </span>
                          <input
                            id="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                            type={showPasswordConfirm ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("confirmPassword", {
                              required: "Confirm Password is required.",
                              validate: validateConfirmPassword,
                            })}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={togglePasswordVisibilityConfirm}
                            aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                          >
                            <i
                              className={`fa-regular fa-eye${showPasswordConfirm ? "-slash" : ""}`}
                            ></i>
                          </button>
                        </div>
                        <ErrorMessage message={errors.confirmPassword?.message} />
                      </div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="form-group mb-3">
                    <label htmlFor="profileImage" className="form-label">Profile Image</label>
                    <input
                      id="profileImage"
                      className={`form-control ${errors.profileImage ? "is-invalid" : ""}`}
                      type="file"
                      accept="image/*"
                      {...register("profileImage", {
                        required: "Profile image is required",
                      })}
                    />
                    <ErrorMessage message={errors.profileImage?.message} />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                   
                    <Link to="/login" className="text-success">
                      Already have an account?
                    </Link>
                  </div>

                  <button className="w-100 btn btn-success py-2" disabled={loadingBtn}>
                    {loadingBtn ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <RotatingLines
                          visible={true}
                          height="20"
                          width="20"
                          color="white"
                          strokeWidth="5"
                          animationDuration="0.75"
                          ariaLabel="rotating-lines-loading"
                        />
                        <span className="ms-2">Processing...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}