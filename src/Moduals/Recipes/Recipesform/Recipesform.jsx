import React, { useEffect, useState } from "react";
import { axiosPrivetInstance, CATEGORY_ENDPOINTS, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import img from "../../../assets/images/categoryHeader.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  // Watch the categoriesIds field to monitor its value
  const selectedCategories = watch("categoriesIds");

  // Create a custom notification function to ensure toast works
  const notify = (message, type = "success") => {
    switch (type) {
      case "success":
        toast.success(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        break;
      case "error":
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        break;
      default:
        toast(message);
    }
  };

  useEffect(() => {
    // Fetch categories and tags
    fetchCategories();
    fetchTags();

    // If editing, populate form with recipe data
    if (isEditing) {
      if (location.state?.recipe) {
        populateForm(location.state.recipe);
      } else {
        fetchRecipe(id);
      }
    }
  }, [id, isEditing, location.state]);

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivetInstance.get(CATEGORY_ENDPOINTS.LIST);
      setCategories(response.data.data || []);
    } catch (error) {
      notify("Failed to fetch categories", "error");
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosPrivetInstance.get("/tag");
      setTags(response.data || []);
    } catch (error) {
      notify("Failed to fetch tags", "error");
      console.error("Error fetching tags:", error);
    }
  };

  const fetchRecipe = async (recipeId) => {
    setIsLoading(true);
    try {
      const response = await axiosPrivetInstance.get(RECIPES_URLS.GET(recipeId));
      if (response.data.data) {
        populateForm(response.data.data);
      }
    } catch (error) {
      notify("Failed to fetch recipe details", "error");
      console.error("Error fetching recipe:", error);
      navigate("dashboard/recipes");
    }
    setIsLoading(false);
  };

  const populateForm = (recipe) => {
    setValue("name", recipe.name);
    setValue("price", recipe.price);
    setValue("description", recipe.description);

    // Handle categories (might be single or multiple)
    if (Array.isArray(recipe.categories)) {
      const categoryIds = recipe.categories.map(cat => parseInt(cat.id, 10));
      setValue("categoriesIds", categoryIds);
    } else if (recipe.category) {
      // If single category is used
      setValue("categoriesIds", [parseInt(recipe.category, 10)]);
    }

    // Handle tag
    if (recipe.tag) {
      setValue("tagId", parseInt(recipe.tag.id, 10));
    } else if (recipe.tagId) {
      setValue("tagId", parseInt(recipe.tagId, 10));
    }

    // For image, we can only show the current image but can't populate the file input
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    // Create FormData object for file upload
    const formData = new FormData();

    // Convert data to expected types
    formData.append("name", String(data.name));
    formData.append("price", parseInt(data.price, 10));
    formData.append("description", String(data.description || ""));
    formData.append("tagId", parseInt(data.tagId, 10));

    // Convert categoriesIds array to comma-separated string
    if (Array.isArray(data.categoriesIds) && data.categoriesIds.length > 0) {
      formData.append("categoriesIds", data.categoriesIds.join(','));
    }

    // Handle image file if present
    if (data?.image?.[0]) {
      formData.append("recipeImage", data.image[0]);
    }

    try {
      if (isEditing) {
        await axiosPrivetInstance.put(
          RECIPES_URLS.UPDATE(id),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        notify("Recipe updated successfully");
      } else {
        await axiosPrivetInstance.post(
          RECIPES_URLS.CREATE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        notify("Recipe added successfully");
      }
      navigate("/dashboard/recipes");
    } catch (error) {
      notify(`Failed to ${isEditing ? "update" : "add"} recipe`, "error");
      console.error(`Error ${isEditing ? "updating" : "adding"} recipe:`, error);

      // Log the error response if available
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header
        title={isEditing ? "Edit Recipe" : "Add New Recipe"}
        description="Manage your recipe details"
        img={img}
      />

      {/* Configure ToastContainer with explicit settings */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container-fluid p-4">
        <div className="mb-4">
          <h3>{isEditing ? "Edit Recipe" : "Add New Recipe"}</h3>
          <p className="text-muted">Update recipe information here</p>
        </div>

        <div className="card">
          <div className="card-body">
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

              <div className="mb-3">
                <label htmlFor="recipeCategories" className="form-label">Categories</label>
                <select
                  id="recipeCategories"
                  className={`form-select ${errors.categoriesIds ? "is-invalid" : ""}`}
                  multiple
                  {...register("categoriesIds", { required: "At least one category is required" })}
                >
                  {categories.map(category => (
                    <option key={category.id} value={parseInt(category.id, 10)}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoriesIds && <div className="invalid-feedback">{errors.categoriesIds.message}</div>}
                <small className="form-text text-muted">Hold Ctrl/Cmd to select multiple categories</small>

                {/* Display selected categories for verification */}
                {selectedCategories && selectedCategories.length > 0 && (
                  <div className="mt-2 text-muted">
                    Selected: {Array.from(selectedCategories).map(id => parseInt(id, 10)).join(', ')}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="recipeTag" className="form-label">Tag</label>
                <select
                  id="recipeTag"
                  className={`form-select ${errors.tagId ? "is-invalid" : ""}`}
                  {...register("tagId", { required: "Tag is required" })}
                >
                  <option value="">Select a tag</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={parseInt(tag.id, 10)}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                {errors.tagId && <div className="invalid-feedback">{errors.tagId.message}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="recipeDescription" className="form-label">Description</label>
                <textarea
                  id="recipeDescription"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  placeholder="Enter recipe description"
                  rows="3"
                  {...register("description")}
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="recipeImage" className="form-label">Recipe Image</label>
                <input
                  id="recipeImage"
                  type="file"
                  className={`form-control ${errors.image ? "is-invalid" : ""}`}
                  accept="image/*"
                  {...register("image")}
                />
                {errors.image && <div className="invalid-feedback">{errors.image.message}</div>}
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-success" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {isEditing ? "Updating..." : "Saving..."}
                    </>
                  ) : isEditing ? "Update Recipe" : "Save Recipe"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/dashboard/recipes")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}