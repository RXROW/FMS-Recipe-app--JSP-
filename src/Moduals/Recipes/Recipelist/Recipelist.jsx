import React, { useEffect, useState, useContext } from "react"; 
import { axiosPrivetInstance, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import img from "../../../assets/images/categoryHeader.png";
import NoData from "../../Shared/NoData/NoData";

export default function RecipeList() { 
  const [recipesList, setRecipesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivetInstance.get(RECIPES_URLS.LIST);
      setRecipesList(response.data.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const handleEdit = (recipe) => {
    console.log("Edit Recipe:", recipe);
    // Implement edit logic (e.g., navigate to an edit form with recipe details)
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axiosPrivetInstance.delete(`${RECIPES_URLS.DELETE}/${id}`);
        setRecipesList((prev) => prev.filter((recipe) => recipe.id !== id));
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  return (
    <>
      <Header
        title="Recipes List"
        decsription="You can now add your items that any user can order from the application and edit them."
        img={img}
      />
      <div className="p-4">
        <h5>Recipes List</h5>
        {isLoading ? (
          <p>Loading...</p>
        ) : recipesList.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover border">
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
                    <td>
                      {recipe.category.length > 0
                        ? recipe.category.join(", ")
                        : "No Category"}
                    </td>
                    <td>${recipe.price?.toFixed(2) || "0.00"}</td>
                    <td>{new Date(recipe.modificationDate).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm me-2"
                        onClick={() => handleEdit(recipe)}
                      >
                   
                   <i className="fa fa-edit text-warning text-lg" ></i>
                      </button>
                      <button
                        className="btn  btn-sm"
                        onClick={() => handleDelete(recipe.id)}
                      >
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
