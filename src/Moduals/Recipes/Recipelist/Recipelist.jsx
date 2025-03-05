import React, { useEffect, useState } from "react";
import { axiosPrivetInstance, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import img from "../../../assets/images/categoryHeader.png";
import NoData from "../../Shared/NoData/NoData";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DeleteConfirmations from "../../Shared/DeleteConfirmations/DeleteConfirmations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RecipeList() {
  const [recipesList, setRecipesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivetInstance.get(RECIPES_URLS.LIST);
      setRecipesList(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch recipes");
      console.error("Error fetching recipes:", error);
    }
    setIsLoading(false);
  };

  const handleAddRecipe = () => {
    setModalType("add");
    setSelectedRecipe(null);
    setShowModal(true);
    reset();  
  };

  const handleEdit = (recipe) => {
    setModalType("update");
    setSelectedRecipe(recipe);
    setShowModal(true);
     
    setValue("name", recipe.name);
    setValue("price", recipe.price);
    setValue("category", recipe.category?.[0]);
  };

  const handleDeleteClick = (recipe) => {
    setModalType("delete");
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedRecipe) return;
    try {
      await axiosPrivetInstance.delete(RECIPES_URLS.DELETE(selectedRecipe.id));
      handleCloseModal();
      toast.success("Recipe deleted successfully");
      fetchRecipes();
    } catch (error) {
      toast.error("Failed to delete recipe");
      console.error("Error deleting recipe:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    reset();
  };

  const handleFormSubmit = async (data) => {
    try {
      if (modalType === "add") {
        await axiosPrivetInstance.post(RECIPES_URLS.ADD, data);
        toast.success("Recipe added successfully");
      } else if (modalType === "update") {
        await axiosPrivetInstance.put(RECIPES_URLS.UPDATE(selectedRecipe.id), data);
        toast.success("Recipe updated successfully");
      }
      handleCloseModal();
      fetchRecipes();
    } catch (error) {
      toast.error(`Failed to ${modalType} recipe`);
      console.error(`Error ${modalType}ing recipe:`, error);
    }
  };

  return (
    <>
      <Header title="Recipes List" description="Manage your recipes here." img={img} />
      <ToastContainer />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Recipes List</h5>
          <button 
            className="btn btn-success" 
            onClick={handleAddRecipe}
          >
            <i className="fa fa-plus me-2"></i>Add New Recipe
          </button>
        </div>

        <DeleteConfirmations
          show={modalType === "delete" && showModal}
          handleClose={handleCloseModal}
          deleteItem="Recipe"
          deleteFuncation={handleDelete}
          deleteId={selectedRecipe?.id}
        />

        <Modal show={modalType !== "delete" && showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{modalType === "add" ? "Add New Recipe" : "Update Recipe"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="mb-3">
                <label htmlFor="recipeName" className="form-label">Recipe Name</label>
                <input
                  id="recipeName"
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter recipe name"
                  {...register("name", { 
                    required: "Recipe name is required", 
                    minLength: { value: 3, message: "Recipe name must be at least 3 characters" } 
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="recipePrice" className="form-label">Price</label>
                <input
                  id="recipePrice"
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  placeholder="Enter recipe price"
                  {...register("price", { 
                    required: "Price is required", 
                    min: { value: 0, message: "Price must be non-negative" } 
                  })}
                />
                {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  {modalType === "add" ? "Save" : "Update"}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recipesList.length > 0 ? (
          <div className="table-responsive rounded">
            <table className="table table-hover rounded border">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Modification Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipesList.map((recipe, index) => (
                  <tr key={recipe.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`https://upskilling-egypt.com:3006/${recipe.imagePath}`}
                        alt={recipe.name}
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                      />
                    </td>
                    <td>{recipe.name}</td>
                    <td>{recipe.category?.join(", ") || "No Category"}</td>
                    <td>${recipe.price?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(recipe.modificationDate).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm me-2" onClick={() => handleEdit(recipe)}>
                        <i className="fa fa-edit text-warning text-lg"></i>
                      </button>
                      <button className="btn btn-sm" onClick={() => handleDeleteClick(recipe)}>
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}