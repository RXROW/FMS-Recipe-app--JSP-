/* eslint-disable no-unused-vars */
import React from 'react'
 import avatar from '../../../assets/images/avatar.png'

export default function Navbar({loginData}) { 
  return (
    <>
      <nav className="navbar navbar-expand-md ">
        <div className="container-fluid px-4">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex w-100 justify-content-between align-items-center">
              {/* search */}
              <input
                className="form-control rounded-5 w-75" 
                type="search"
                placeholder="Search Here"
                aria-label="Search"
              />

              {/* image */}
              <div className="d-flex align-items-center">
                <img
                  className="img-fluid rounded-5 me-3" 
                  src={avatar}
                  alt="person-Logo"
                />
                <a className="nav-link" href="#">
                  {loginData?.userName}
                </a>
              </div>
            </div>

            <ul className="navbar-nav mb-5 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></a>
              </li>
              <li className="nav-item mx-3">
                <a className="nav-link" href="#">
                  <i className="fa-solid fa-bell"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
