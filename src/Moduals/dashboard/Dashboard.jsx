import React, { useContext } from "react";
import Header from "../Shared/Header/Header";
import img from "../../assets/images/eating.png";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Link } from "react-router-dom";

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
      <div className="d-flex  bg-warning-dash  my-3 container-fluid  px-md-4 px-2 ">
        <div className='w-100  d-flex flex-md-row flex-column justify-content-between py-2 py-md-5  px-3 rounded-3 align-items-center dashboard-header'>
          <div className="caption mb-2 mb-md-0">
            <h4 className="mb-0"> {loginData?.userGroup === 'SystemUser' ? 'Show' : 'Fill'} the <span>Recipes</span>! </h4>
            <p className="mb-0">you can now {loginData?.userGroup === 'SystemUser' ? 'show' : 'fill'}  the meals easily using the table and form , click here and sill it with the table !</p>
          </div>


          <Link to={'/dashboard/recipes'} className={" btn btn-success   px-3 py-2 text-decoration-none  px-md-5 py-md-3   fw-bold"}>
            {loginData?.userGroup === 'SystemUser' ? 'All' : 'Fill'} Recipes
            <i className="fa-solid fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
