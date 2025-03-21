import React, { useEffect, useState } from "react";
import { axiosPrivetInstance, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import img from "../../../assets/images/categoryHeader.png";
import NoData from "../../Shared/NoData/NoData";
import DeleteConfirmations from "../../Shared/DeleteConfirmations/DeleteConfirmations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function RecipeList() {
  const [recipesList, setRecipesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigate = useNavigate();

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
    navigate("/dashboard/recipes/add");
  };

  const handleEdit = (recipe) => {
    navigate(`/dashboard/recipes/edit/${recipe.id}`, { state: { recipe } });
  };

  const handleDeleteClick = (recipe) => {
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
  };

  return (
    <>
      <Header
        title="Recipes List"
        description="You can now add your items that any user can order it from the Application and you can edit"
        img={img}
      />
      <ToastContainer />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3>Recipes Management</h3>
            <p className="text-muted mb-0">You can check all details</p>
          </div>
          <button
            className="btn btn-success"
            onClick={handleAddRecipe}
          >
            <i className="fa fa-plus me-2"></i>Add New Recipe
          </button>
        </div>

        <DeleteConfirmations
          show={showModal}
          handleClose={handleCloseModal}
          deleteItem="Recipe"
          deleteFuncation={handleDelete}
          deleteId={selectedRecipe?.id}
        />

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recipesList.length > 0 ? (
          <div className="table-responsive rounded">
            <table className="table table-hover rounded border">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Modification Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {recipesList.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>{recipe.name}</td>
                    <td>
                      {recipe.imagePath ? (
                        <img
                          src={`https://upskilling-egypt.com:3006/${recipe.imagePath}`}
                          alt={recipe.name}
                          width="40"
                          height="40"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{recipe.category ? recipe.category.name : "No Category"}</td>
                    <td>${Number(recipe.price)?.toFixed(2) || "0.00"}</td>
                    <td>
                      {recipe.modificationDate
                        ? new Date(recipe.modificationDate).toLocaleString()
                        : "No Date"}
                    </td>
                    <td className="text-end">
                      <div className="dropdown">
                        <button
                          className="btn"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa fa-ellipsis-v"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleEdit(recipe)}
                            >
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDeleteClick(recipe)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
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