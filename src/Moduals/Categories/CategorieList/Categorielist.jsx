import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import NoData from "../../Shared/NoData/NoData";
import Header from "../../Shared/Header/Header";
import DeleteConfirmations from "../../Shared/DeleteConfirmations/DeleteConfirmations";
import img from "../../../assets/images/categoryHeader.png";
import {
  axiosPrivetInstance,
  CATEGORY_ENDPOINTS,
} from "../../../Services/Urls/Urls";

export default function CategoryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [visibleActionRows, setVisibleActionRows] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const handleShowModal = (type, id = null) => {
    setModalType(type);
    setSelectedCategoryId(id);

    if (type === "update" && id) {
      const selectedCategory = categories.find((cat) => cat.id === id);
      setValue("name", selectedCategory?.name || "");
    } else {
      reset();
    }

    setShowModal(true);
  };

  // Toggle visibility for a specific row
  const toggleActionVisibility = (categoryId) => {
    setVisibleActionRows(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Hide all other action rows when one is clicked
  const handleShowActionForRow = (categoryId) => {
    // Create a new object with all values set to false
    const updatedVisibility = {};
    categories.forEach(cat => {
      updatedVisibility[cat.id] = false;
    });

    // Set the clicked row to true
    updatedVisibility[categoryId] = true;

    setVisibleActionRows(updatedVisibility);
  };

  const fetchCategories = async (page = 1, nameFilter = "") => {
    setIsLoading(true);
    try {
      const params = {
        pageSize: 5,
        pageNumber: page,
      };

      if (nameFilter) {
        params.name = nameFilter;
      }

      const response = await axiosPrivetInstance.get(CATEGORY_ENDPOINTS.LIST, {
        params,
      });
      setCategories(response.data.data);
      setTotalPages(response.data.totalNumberOfPages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories(currentPage, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  const createCategory = async (data) => {
    try {
      await axiosPrivetInstance.post(CATEGORY_ENDPOINTS.CREATE, data);
      toast.success("Category added successfully");
      fetchCategories(currentPage, searchTerm);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const updateCategoryDetails = async (data) => {
    try { 
      if (data.name === "") {
        toast.error("Category name is required");
        return;
      }
      
      if (data.name.length < 3) {
        toast.error("Category name must be at least 3 characters");
        return;
      }
      
      const originalCategory = categories.find(cat => cat.id === selectedCategoryId);
      if (originalCategory && data.name === originalCategory.name) {
        toast.error("No changes detected");
        return;
      }
      
      await axiosPrivetInstance.put(
        CATEGORY_ENDPOINTS.UPDATE(selectedCategoryId),
        { name: data.name }
      );
      
      console.log(data.name);
      toast.success("Category updated successfully");
      fetchCategories(currentPage, searchTerm);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const deleteSelectedCategory = async () => {
    try {
      await axiosPrivetInstance.delete(
        CATEGORY_ENDPOINTS.DELETE(selectedCategoryId)
      );
      toast.success("Category deleted successfully");
      fetchCategories(currentPage, searchTerm);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Reset action visibility when changing pages
      setVisibleActionRows({});
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""
              }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Click outside handler to close all action buttons
  useEffect(() => {
    function handleClickOutside(event) {
      const actionElements = document.querySelectorAll('.action-container');
      let clickedInside = false;

      actionElements.forEach(element => {
        if (element.contains(event.target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        setVisibleActionRows({});
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Header
        title={`Categories Item`}
        decsription="You can now add your items that any user can order it from the Application and you can edit"
        img={img}
      />
      <DeleteConfirmations
        show={showModal && modalType === "delete"}
        handleClose={handleCloseModal}
        deleteItem="Category"
        deleteFuncation={deleteSelectedCategory}
      />

      <Modal
        show={showModal && (modalType === "add" || modalType === "update")}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Add New Category" : "Update Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(
              modalType === "add" ? createCategory : updateCategoryDetails
            )}
          >
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter category name"
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 3,
                    message: "Category name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                {modalType === "add" ? "Save Category" : "Update Category"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <div className="d-flex justify-content-between align-items-center p-4">
        <div>
          <h4>Categories Table Details</h4>
          <p>You can check all details</p>
        </div>
        <button
          className="btn btn-success"
          onClick={() => handleShowModal("add")}
        >
          Add New Category
        </button>
      </div>

      <div className="bg-gray p-4 m-4 rounded d-flex justify-content-between align-items-center">
        <p>Name</p>
        <p>Action</p>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="table-responsive p-4 overflow-auto">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <>
            <table className="table table-hover table-striped border rounded overflow-auto">
              <thead className="rounded-top">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Creation Date</th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="rounded-bottom">
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{(currentPage - 1) * 5 + index + 1}</td>
                    <td>{category.name}</td>
                    <td>
                      {new Date(category.creationDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <div className="action-container position-relative">
                        {visibleActionRows[category.id] ? (
                          <div className="bg-white shadow rounded position-absolute end-0 p-2 flex-column d-flex" style={{ minWidth: '120px', zIndex: 100, right: '0' }}>
                            <button
                              className="btn btn-sm d-flex align-items-center gap-2 text-start hover-bg-light py-2"
                              onClick={() => handleShowModal("update", category.id)}
                              title="Edit Category"
                            >
                              <i className="fa fa-edit text-success"></i>
                              <span>Edit</span>
                            </button>
                            <div className="dropdown-divider my-1"></div>
                            <button
                              className="btn btn-sm d-flex align-items-center gap-2 text-start hover-bg-light py-2"
                              onClick={() => handleShowModal("delete", category.id)}
                              title="Delete Category"
                            >
                              <i className="fa fa-trash text-danger"></i>
                              <span>Delete</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm rounded-circle"
                            onClick={() => handleShowActionForRow(category.id)}
                            title="Show Actions"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <i className="fa fa-ellipsis-v"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </>
        ) : (
          <NoData />
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}