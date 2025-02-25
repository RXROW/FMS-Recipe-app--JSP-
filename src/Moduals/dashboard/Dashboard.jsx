import React, { useContext } from "react";
import Header from "../Shared/Header/Header";
import img from "../../assets/images/eating.png";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const Dashboard = () => {
  const { loginData } = useContext(AuthContext);
  return (
    <div>
      <Header
        title={`Welcome ${loginData?.userName}`}
        decsription={
          "This is a welcoming screen for the entry of the application ,you can now see the options"
        }
        img={img}
      />
    </div>
  );
};

export default Dashboard;
