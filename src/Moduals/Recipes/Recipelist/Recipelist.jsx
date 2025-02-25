import React, { useEffect, useState, useContext } from "react"; 
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { axiosPrivetInstance, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import img from "../../../assets/images/categoryHeader.png"; 
import NoData from "../../Shared/NoData/NoData";

export default function RecipeList() {
  const { loginData } = useContext(AuthContext);
  const [recipesList, setRecipesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivetInstance.get(RECIPES_URLS.LIST);
      setRecipesList(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <>
     <Header
        title={`Recpies Item`}
        decsription="You can now add your items that any user can order it from the Application and you can edit"
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
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {recipesList.map((recipe, index) => (
                <tr key={recipe.id}>
                  <td>{index + 1}</td>
                  <td>{recipe.name}</td>
                  <td>{recipe.category || "No Category"}</td>
                  <td>${recipe.price?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <NoData/>
      )}
    </div>
    </>
  );
}
