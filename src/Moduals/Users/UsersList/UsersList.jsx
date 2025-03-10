import React, { useEffect, useState } from "react";
import Header from "../../Shared/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imgheader from "../../../assets/images/categoryHeader.png";
import NoData from "../../Shared/NoData/NoData";
import Nodata from "../../../assets/images/No-Data.png";
import axios from "axios";
import DeleteConfirmations from "../../Shared/DeleteConfirmations/DeleteConfirmations";

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedId, setSelectedId] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  const getUsers = async (pageNo = currentPage, size = pageSize) => {
    setIsLoading(true);
    try {
      let response = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/Users/`,
        {
          params: {
            pageSize: size,
            pageNumber: pageNo
          },
          headers: { Authorization: localStorage.getItem("token") }
        }
      );
      
      setArrayOfPages(
        Array(response.data.totalPages)
          .fill()
          .map((_, i) => i + 1)
      );
      setUsersList(response.data.data);
      setCurrentPage(pageNo);
      setPageSize(size);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/Users/${selectedId}`,
        {
          headers: { Authorization: localStorage.getItem("token") }
        }
      ); 
      getUsers(); // Re-fetch users after deletion
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete User");
    }
    handleClose();
  };

  useEffect(() => {
    getUsers(1, 5);
  }, []);

  return (
    <>
      <Header
        title="Users List"
        description="This is a welcoming screen for the entry of the application, you can now see the options"
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

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        <div className="table-responsive">
          {!isLoading && usersList.length > 0 ? (
            <>
              <table className="table table-striped table-hover border shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Image</th>
                    <th scope="col">Phone number</th>
                    <th scope="col">Email</th>
                    <th scope="col">Country</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user.id}>
                      <td className="align-middle">{user.userName}</td>
                      <td className="align-middle">
                        {user.imagePath ? (
                          <img
                            src={`https://upskilling-egypt.com:3006/${user.imagePath}`}
                            alt={user.userName}
                            className=""
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src={Nodata}
                            alt={user.userName}
                            className="rounded-circle bg-light"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                              padding: "5px"
                            }}
                          />
                        )}
                      </td>
                      <td className="align-middle">{user.phoneNumber || "-"}</td>
                      <td className="align-middle">{user.email}</td>
                      <td className="align-middle">{user.country || "-"}</td>
                      <td className="align-middle text-center">
                        <button
                          className="btn btn-sm btn-outline-danger me-2"
                          onClick={() => handleShow(user.id)}
                          title="Delete User"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View User Details"
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => getUsers(currentPage - 1)}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>
                  
                  {arrayOfPages.map((pageNo) => (
                    <li
                      className={`page-item ${currentPage === pageNo ? 'active' : ''}`}
                      key={pageNo}
                    >
                      <button 
                        className="page-link" 
                        onClick={() => getUsers(pageNo)}
                      >
                        {pageNo}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === arrayOfPages.length ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => getUsers(currentPage + 1)}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
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