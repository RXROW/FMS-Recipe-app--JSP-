import React, { useState } from "react";
import imgLogo from "../../../assets/images/logo.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoadingBtn(true);

    try {
      const response = await axios.put(
        "https://upskilling-egypt.com:3006/api/v1/Users/verify",
        data
      );

      // Store token if needed
      const token = response.data.token;
      localStorage.setItem("userToken", token);

      toast.success("Account verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Give toast time to show
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <>
      <ToastContainer />
      <section className="auth-section">
        <div className="auth-container vh-100">
          <div className="bg-overlay vh-100 container-fluid">
            <div className="row vh-100 justify-content-center align-items-center">
              <div className="col-md-5">
                <div className="bg-white rounded-3 px-4 px-md-5 py-4 shadow">
                  <div className="text-center mb-4">
                    <img className="w-50" src={imgLogo} alt="Company logo" />
                  </div>

                  <h3 className="text-center mb-2">Verify Your Account</h3>
                  <p className="text-muted text-center mb-4">
                    Please enter the verification code sent to your email
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
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
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                              message: "Please enter a valid email address",
                            },
                          })}
                        />
                      </div>
                      {errors.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="code" className="form-label">Verification Code</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa-solid fa-lock"></i>
                        </span>
                        <input
                          id="code"
                          className={`form-control ${errors.code ? "is-invalid" : ""}`}
                          type="text"
                          placeholder="Enter verification code"
                          {...register("code", {
                            required: "Verification code is required",
                            minLength: {
                              value: 4,
                              message: "Code must be at least 4 characters"
                            }
                          })}
                        />
                      </div>
                      {errors.code && (
                        <div className="invalid-feedback d-block">
                          {errors.code.message}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-100 btn btn-success py-2"
                      disabled={loadingBtn}
                    >
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
                          <span className="ms-2">Verifying...</span>
                        </div>
                      ) : (
                        "Verify Account"
                      )}
                    </button>

                    <div className="mt-3 text-center">
                      <p className="mb-0">
                        Didn't receive a code? <a href="#" className="text-success">Resend Code</a>
                      </p>
                      <p className="mt-2">
                        <Link to="/login" className="text-success">
                          Back to Login
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}