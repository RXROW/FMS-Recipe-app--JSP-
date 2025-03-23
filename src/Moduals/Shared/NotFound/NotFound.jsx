import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import notfound2 from "/not-fond.svg";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      <img src={logo} alt="Brand Logo" height={104} className="mb-4" />

      <div className="container d-md-flex justify-content-between align-items-center">
        {/* Left Section */}
        <div className="text-md-start text-center px-md-4 mx-md-4 px-3">
          <h3 className="fw-bold">Oops...</h3>
          <p className="text-muted">
            This page doesn’t exist or was removed!
            <br />
            We suggest you go back to the home page.
          </p>
          <button
            className="btn btn-success mt-3 d-inline-flex align-items-center gap-2"
            onClick={() => navigate("/")}
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </button>
        </div>

        {/* Right Section */}
        <div className="text-center mt-4 mt-md-0">
          <img src={notfound2} alt="404 Not Found Illustration" className="img-fluid w-75 w-md-100" />
        </div>
      </div>
    </div>
  );
}
