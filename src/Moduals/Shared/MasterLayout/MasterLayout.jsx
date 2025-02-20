import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Navbar from "../Navbar/Navbar";
import styles from "./MasterLayout.module.css";

const MasterLayout = ({ loginData }) => { 
  

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <SideBar loginData={loginData} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Navbar loginData={loginData} />
        </div>
        <div className={styles.body}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
