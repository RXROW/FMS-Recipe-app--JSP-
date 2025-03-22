import React, { useContext, useEffect, useState } from "react";
import { ALL_TAGS, axiosPrivetInstance, axiosPublicInstance, CATEGORY_ENDPOINTS, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import img from "../../../assets/images/categoryHeader.png";
import NoData from "../../Shared/NoData/NoData";
import DeleteConfirmations from "../../Shared/DeleteConfirmations/DeleteConfirmations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

export default function RecipeList() {
  const [recipesList, setRecipesList] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Recipe detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [recipeDetail, setRecipeDetail] = useState(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: "", max: "" });

  const { loginData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determine user role based on userGroup
  const userRole = loginData?.userGroup === 'SuperAdmin' ? 'admin' : 'user';

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [recipesList, categoryFilter, tagFilter, nameFilter, dateFilter, priceRangeFilter]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivetInstance.get(RECIPES_URLS.LIST);
      const recipes = response.data.data || [];
      setRecipesList(recipes);
      setFilteredRecipes(recipes);
    } catch (error) {
      toast.error("Failed to fetch recipes");
      console.error("Error fetching recipes:", error);
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivetInstance.get(CATEGORY_ENDPOINTS.LIST);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosPublicInstance.get(ALL_TAGS);
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipesList];

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(recipe => {
        if (recipe.category && Array.isArray(recipe.category)) {
          return recipe.category.some(cat => cat.id.toString() === categoryFilter);
        } else if (recipe.category && recipe.category.id) {
          return recipe.category.id.toString() === categoryFilter;
        }
        return false;
      });
    }

    // Apply tag filter
    if (tagFilter) {
      filtered = filtered.filter(recipe =>
        recipe.tag && recipe.tag.id.toString() === tagFilter
      );
    }

    // Apply name filter
    if (nameFilter) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(recipe => {
        if (!recipe.modificationDate) return false;
        const recipeDate = new Date(recipe.modificationDate);
        return recipeDate.toDateString() === filterDate.toDateString();
      });
    }

    // Apply price range filter
    if (priceRangeFilter.min) {
      filtered = filtered.filter(recipe =>
        Number(recipe.price) >= Number(priceRangeFilter.min)
      );
    }
    if (priceRangeFilter.max) {
      filtered = filtered.filter(recipe =>
        Number(recipe.price) <= Number(priceRangeFilter.max)
      );
    }

    setFilteredRecipes(filtered);
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setTagFilter("");
    setNameFilter("");
    setDateFilter("");
    setPriceRangeFilter({ min: "", max: "" });
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

  const handleAddToFavorites = async (recipe) => {
    try {
      await axiosPrivetInstance.post(RECIPES_URLS.ADD_TO_FAVORITES, { recipeId: recipe.id });
      toast.success("Recipe added to favorites");
    } catch (error) {
      toast.error("Failed to add recipe to favorites");
      console.error("Error adding recipe to favorites:", error);
    }
  };

  const handleShowRecipe = (recipe) => {
    // For detail modal approach
    setRecipeDetail(recipe);
    setShowDetailModal(true);

    // For navigation approach (original)
    // navigate(`/recipes/${recipe.id}`, { state: { recipe } });
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setRecipeDetail(null);
  };

  // Helper function to get category names
  const getCategoryNames = (recipe) => {
    if (!recipe.category) return "No Category";

    if (Array.isArray(recipe.category)) {
      return recipe.category.map(cat => cat.name).join(", ");
    } else if (typeof recipe.category === 'object') {
      return recipe.category.name;
    }

    return "No Category";
  };

  return (
    <>
      <Header
        title="Recipes List"
        decsription="Browse through our delicious recipe collection and save your favorites"
        img={img}
      />
      <ToastContainer />

      <div className="container-fluid p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3>Recipes {userRole === "admin" ? "Management" : "Collection"}</h3>
            <p className="text-muted mb-0">
              {userRole === "admin"
                ? "You can check all details and manage recipes"
                : "Discover new dishes and save your favorites"}
            </p>
          </div>
          {userRole === "admin" && (
            <button
              className="btn btn-success"
              onClick={handleAddRecipe}
            >
              <i className="fa fa-plus me-2"></i>Add New Recipe
            </button>
          )}
        </div>


        {/* Filters Section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="nameFilter" className="form-label">Recipe Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameFilter"
                  placeholder="Search by name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="categoryFilter" className="form-label">Category</label>
                <select
                  className="form-select"
                  id="categoryFilter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-2">
                <label htmlFor="tagFilter" className="form-label">Tag</label>
                <select
                  className="form-select"
                  id="tagFilter"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-2">
                <label htmlFor="dateFilter" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="dateFilter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div className="col-12 col-lg-2">
                <label className="form-label">Price Range</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    value={priceRangeFilter.min}
                    onChange={(e) => setPriceRangeFilter({ ...priceRangeFilter, min: e.target.value })}
                  />
                  <span className="input-group-text">-</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    value={priceRangeFilter.max}
                    onChange={(e) => setPriceRangeFilter({ ...priceRangeFilter, max: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray p-4 my-3 mx-0 rounded d-flex justify-content-between align-items-center">
          <p>Name</p>
          <p>Action</p>
          <p> Image</p>
          <p>  Category</p>
          <p>Tag</p>
          <p> Price</p>
          <p>
            Updated</p>
          <p>Actions</p>
          
         
        </div>
        {/* Confirmation Modal for Delete */}
        {userRole === "admin" && (
          <DeleteConfirmations
            show={showModal}
            handleClose={handleCloseModal}
            deleteItem="Recipe"
            deleteFuncation={handleDelete}
            deleteId={selectedRecipe?.id}
          />
        )}

        {/* Recipe Detail Modal */}
        {showDetailModal && recipeDetail && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{recipeDetail.name}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetailModal}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-5 mb-3 mb-md-0">
                      {recipeDetail.imagePath ? (
                        <img
                          src={`https://upskilling-egypt.com:3006/${recipeDetail.imagePath}`}
                          alt={recipeDetail.name}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light text-center rounded p-5" style={{ height: '250px' }}>
                          <i className="fa fa-image fa-3x text-muted mt-5"></i>
                        </div>
                      )}
                    </div>
                    <div className="col-md-7">
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">Categories:</h6>
                        <div>
                          {getCategoryNames(recipeDetail) === "No Category" ? (
                            <span className="badge bg-light text-dark">No Category</span>
                          ) : (
                            Array.isArray(recipeDetail.category) ?
                              recipeDetail.category.map(cat => (
                                <span key={cat.id} className="badge bg-success me-1 mb-1">{cat.name}</span>
                              )) :
                              <span className="badge bg-success">{recipeDetail.category.name}</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="text-muted mb-2">Tag:</h6>
                        {recipeDetail.tag ? (
                          <span className="badge bg-primary">{recipeDetail.tag.name}</span>
                        ) : (
                          <span className="badge bg-light text-dark">No Tag</span>
                        )}
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <h6 className="text-muted mb-2">Price:</h6>
                          <p className="fw-bold text-success">${Number(recipeDetail.price)?.toFixed(2) || "0.00"}</p>
                        </div>
                        <div className="col-6">
                          <h6 className="text-muted mb-2">Last Updated:</h6>
                          <p>{recipeDetail.modificationDate ? new Date(recipeDetail.modificationDate).toLocaleDateString() : "No Date"}</p>
                        </div>
                      </div>

                      {recipeDetail.description && (
                        <div className="mb-3">
                          <h6 className="text-muted mb-2">Description:</h6>
                          <p>{recipeDetail.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipe details like ingredients and instructions would go here if available */}
                  {recipeDetail.ingredients && (
                    <div className="mt-4">
                      <h6 className="text-muted mb-2">Ingredients:</h6>
                      <p>{recipeDetail.ingredients}</p>
                    </div>
                  )}

                  {recipeDetail.instructions && (
                    <div className="mt-4">
                      <h6 className="text-muted mb-2">Instructions:</h6>
                      <p>{recipeDetail.instructions}</p>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  {userRole === "admin" ? (
                    <>
                      <button className="btn btn-outline-success" onClick={() => handleEdit(recipeDetail)}>
                        <i className="fa fa-edit me-2"></i>Edit Recipe
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => {
                        handleCloseDetailModal();
                        handleDeleteClick(recipeDetail);
                      }}>
                        <i className="fa fa-trash me-2"></i>Delete Recipe
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-outline-success" onClick={() => handleAddToFavorites(recipeDetail)}>
                      <i className="fa fa-heart me-2"></i>Add to Favorites
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={handleCloseDetailModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Backdrop */}
        {showDetailModal && (
          <div className="modal-backdrop fade show"></div>
        )}

        {isLoading ? (
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Name</th>
                      <th>Image</th>
                      <th className="d-none d-md-table-cell">Category</th>
                      <th className="d-none d-md-table-cell">Tag</th>
                      <th className="d-none d-lg-table-cell">Price</th>
                      <th className="d-none d-lg-table-cell">Updated</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecipes.map((recipe) => (
                      <tr key={recipe.id}>
                        <td className="align-middle">
                          {recipe.name}
                          <div className="d-md-none text-muted small">
                            ${Number(recipe.price)?.toFixed(2) || "0.00"}
                          </div>
                        </td>
                        <td className="align-middle">
                          {recipe.imagePath ? (
                            <img
                              src={`https://upskilling-egypt.com:3006/${recipe.imagePath}`}
                              alt={recipe.name}
                              width="50"
                              height="50"
                              style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                          ) : (
                            <div className="bg-light text-center rounded" style={{ width: "50px", height: "50px", lineHeight: "50px" }}>
                              <i className="fa fa-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td className="align-middle d-none d-md-table-cell">
                          {Array.isArray(recipe.category) && recipe.category.length > 0 ? (
                            recipe.category.map(cat => (
                              <span key={cat.id} className="  text-dark me-1">
                                {cat.name}
                              </span>
                            ))
                          ) : recipe.category && recipe.category.name ? (
                            <span className="  text-dark">
                              {recipe.category.name}
                            </span>
                          ) : (
                            "No Category"
                          )}
                        </td>
                        <td className="align-middle d-none d-md-table-cell">
                          {recipe.tag ? (
                            <span className="  text-dark">
                              {recipe.tag.name}
                            </span>
                          ) : (
                            "No Tag"
                          )}
                        </td>
                        <td className="align-middle d-none d-lg-table-cell">${Number(recipe.price)?.toFixed(2) || "0.00"}</td>
                        <td className="align-middle d-none d-lg-table-cell">
                          {recipe.modificationDate
                            ? new Date(recipe.modificationDate).toLocaleDateString()
                            : "No Date"}
                        </td>
                        <td className="text-end align-middle">
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-light"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fa fa-ellipsis-v"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                              <li>
                                <button
                                  className="dropdown-item text-success"
                                  onClick={() => handleShowRecipe(recipe)}
                                >
                                  <i className="fa fa-eye me-2 text-success"></i>View Details
                                </button>
                              </li>
                              {userRole === "admin" ? (
                                // Admin actions
                                <>
                                  <li>
                                    <button
                                      className="dropdown-item text-success"
                                      onClick={() => handleEdit(recipe)}
                                    >
                                      <i className="fa fa-edit me-2 text-success"></i>Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item text-success"
                                      onClick={() => handleDeleteClick(recipe)}
                                    >
                                      <i className="fa fa-trash me-2 text-success"></i>Delete
                                    </button>
                                  </li>
                                </>
                              ) : (
                                // User actions
                                <li>
                                  <button
                                    className="dropdown-item text-success"
                                    onClick={() => handleAddToFavorites(recipe)}
                                  >
                                    <i className="fa fa-heart me-2 text-success"></i>Add to Favorites
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <NoData />
              {filteredRecipes.length === 0 && recipesList.length > 0 && (
                <div className="text-center mt-3">
                  <p>No recipes match your filter criteria</p>
                  <button className="btn btn-outline-success" onClick={resetFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}