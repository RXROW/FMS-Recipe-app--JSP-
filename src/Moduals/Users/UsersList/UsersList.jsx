import React, { useEffect, useState } from "react";
import Header from "../../Shared/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imgheader from "../../../assets/images/categoryHeader.png";
import NoData from "../../Shared/NoData/NoData";
import Nodata from "../../../assets/images/No-Data.png";
import { axiosPrivetInstance, USER_URLS } from "../../../Services/Urls/Urls";
import DeleteConfirmations from "../../Shared/DeleteConfirmations/DeleteConfirmations";

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedId, setSelectedId] = useState(0);
  const [show, setShow] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const handleClose = () => setShow(false);

  const handleShow = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  const toggleActionMenu = (id) => {
    if (showActionMenu === id) {
      setShowActionMenu(null);
    } else {
      setShowActionMenu(id);
    }
  };  
  const getUsers = async (pageNo = currentPage, size = pageSize) => {
    setIsLoading(true);
    try {
      const params = {
        pageNumber: pageNo,
        pageSize: size,
      };

      const response = await axiosPrivetInstance.get(USER_URLS.LIST, {
        params,
      });
      setUsersList(response.data.data);
      setCurrentPage(pageNo);
      setPageSize(size);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      await axiosPrivetInstance.delete(
        USER_URLS.DELETE(selectedId)
      );
      toast.success("User deleted successfully");
      handleClose();
      getUsers(); 
    } catch (error) {
      console.error("Error deleting User:", error);
      toast.error(error.response?.data?.message || "Failed to delete User");
    }
  };

  const handleViewUser = (id) => { 
    console.log("Viewing user", id);
    setShowActionMenu(null);
  };

  const handleDeleteUser = (id) => {
    handleShow(id);
    setShowActionMenu(null);
  };

  useEffect(() => {
    getUsers(1, 7);
  }, []);

  return (
    <>
      <Header
        title="Users List"
        decsription="You can check all details"
        img={imgheader}
      />
      
      <DeleteConfirmations
        show={show}
        handleClose={handleClose}
        deleteItem="User"
        deleteFuncation={deleteUser}
      />

      <div className="container-fluid my-4">
        <div className="row align-items-center mb-4">
          <div className="col">
            <h4 className="mb-0">Users Management</h4>
          </div>
        </div>
 
        {isLoading && (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading Users...</p>
          </div>
        )}
 
        <div className="table-responsive bg-light rounded shadow-sm">
          {!isLoading && usersList.length > 0 ? (
            <>
              <table className="table table-striped table-hover">
                <thead className="bg-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Image</th>
                    <th scope="col">Price</th>
                    <th scope="col">Description</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Category</th>
                    <th scope="col" className="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user.id}>
                      <td className="align-middle">Noodles with Sushi</td>
                      <td className="align-middle">
                        {user.imagePath ? (
                          <img
                            src={`https://upskilling-egypt.com:3006/${user.imagePath}`}
                            alt={user.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <img
                            src={Nodata}
                            alt="User image"
                            className="rounded bg-light"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                              padding: "5px"
                            }}
                          />
                        )}
                      </td>
                      <td className="align-middle">350.99</td>
                      <td className="align-middle">Rice-cook with noodles</td>
                      <td className="align-middle">20</td>
                      <td className="align-middle">Noodles</td>
                      <td className="align-middle text-center position-relative">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm"
                            onClick={() => toggleActionMenu(user.id)}
                          >
                            <i className="fa fa-ellipsis-v fs-5"></i>
                          </button>
                          
                          {showActionMenu === user.id && (
                            <div 
                              className="dropdown-menu show shadow-sm position-absolute" 
                              style={{ right: 0 }}
                            >
                              <button 
                                className="dropdown-item d-flex align-items-center" 
                                onClick={() => handleViewUser(user.id)}
                              >
                                <i className="fa fa-eye text-success me-2"></i> View
                              </button>
                              <button 
                                className="dropdown-item d-flex align-items-center" 
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <i className="fa fa-trash text-success me-2"></i> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : !isLoading ? (
            <NoData />
          ) : null}
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}