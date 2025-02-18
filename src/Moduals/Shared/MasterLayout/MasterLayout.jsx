import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import Navbar from '../Navbar/Navbar';

const MasterLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100"> 
        <div className="col-md-3 col-lg-2 bg-dark text-white d-none d-md-block p-3">
          <SideBar />
        </div> 
        <div className="col-md-9  col-lg-10 d-flex flex-column p-0"> 
          <Navbar /> 
          <div className="flex-grow-1 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
