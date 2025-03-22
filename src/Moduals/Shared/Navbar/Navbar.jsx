/* eslint-disable no-unused-vars */
import React ,{useContext}from 'react'
 import avatar from '../../../assets/images/avatar.png'
import { AuthContext } from '../../../context/AuthContext/AuthContext';

export default function Navbar() {
  
  const { loginData } = useContext(AuthContext);
   return (
    <>
      <nav className="navbar navbar-expand-md ">
        <div className="container-fluid px-4">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex w-100 justify-content-end align-items-center">
           

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
