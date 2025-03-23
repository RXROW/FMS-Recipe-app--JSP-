import React, { useEffect, useState } from "react";
import { axiosPrivetInstance, CATEGORY_ENDPOINTS, RECIPES_URLS } from "../../../Services/Urls/Urls";
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

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

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
      navigate("/dashboard/recipes");
    }
    setIsLoading(false);
  };

  const populateForm = (recipe) => {
    setValue("name", recipe.name);
    setValue("price", recipe.price);
    setValue("description", recipe.description);
    setValue("quantity", recipe.quantity || "100");

    // Handle categories (might be single or multiple)
    if (Array.isArray(recipe.categories)) {
      const categoryIds = recipe.categories.map(cat => parseInt(cat.id, 10));
      setValue("categoriesIds", categoryIds[0]); // For this UI, we only use first category
    } else if (recipe.category) {
      // If single category is used
      setValue("categoriesIds", parseInt(recipe.category, 10));
    }

    // Handle tag
    if (recipe.tag) {
      setValue("tagId", parseInt(recipe.tag.id, 10));
    } else if (recipe.tagId) {
      setValue("tagId", parseInt(recipe.tagId, 10));
    }
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    // Create FormData object for file upload
    const formData = new FormData();

    // Convert data to expected types
    formData.append("name", String(data.name));
    formData.append("price", parseInt(data.price, 10));
    formData.append("description", String(data.description || ""));
    formData.append("quantity", String(data.quantity || "100"));

    if (data.tagId) {
      formData.append("tagId", parseInt(data.tagId, 10));
    }

    // Convert categoriesIds to array format expected by API
    if (data.categoriesIds) {
      formData.append("categoriesIds", String(data.categoriesIds));
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

      <div className="container py-4">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Recipe Name */}
          <div className="mb-3">
            <input
              type="text"
              className={`form-control bg-light ${errors.name ? "is-invalid" : ""}`}
              placeholder="Recipe Name"
              {...register("name", {
                required: "Recipe name is required",
                minLength: { value: 3, message: "Recipe name must be at least 3 characters" }
              })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* Category Dropdown */}
          <div className="mb-3">
            <div className="form-select bg-light d-flex justify-content-between align-items-center">
              {categories.length > 0 ? (
                <select
                  className="form-select bg-light border-0"
                  {...register("categoriesIds", { required: "Category is required" })}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={parseInt(category.id, 10)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>Noodles</span>
              )}
            </div>
            {errors.categoriesIds && <div className="invalid-feedback d-block">{errors.categoriesIds.message}</div>}
          </div>

          {/* Price */}
          <div className="mb-3">
            <div className="form-control bg-light d-flex justify-content-between align-items-center">
              <input
                type="number"
                step="0.01"
                className={`form-control bg-light border-0 ${errors.price ? "is-invalid" : ""}`}
                placeholder="Price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be non-negative" }
                })}
              />
              <span>EGP</span>
            </div>
            {errors.price && <div className="invalid-feedback d-block">{errors.price.message}</div>}
          </div>

          {/* Tags Dropdown */}
          <div className="mb-3">
            <div className="form-select bg-light d-flex justify-content-between align-items-center">
              {tags.length > 0 ? (
                <select
                  className="form-select bg-light border-0"
                  {...register("tagId")}
                >
                  <option value="">Select a tag</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={parseInt(tag.id, 10)}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>No tags available</span>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <div className="form-control bg-light d-flex justify-content-between align-items-center">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="100"
                {...register("quantity")}
              />
              <span>g</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control bg-light ${errors.description ? "is-invalid" : ""}`}
              rows="6"
              placeholder="Enter recipe description"
              {...register("description", {
                required: "Description is required"
              })}
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
          </div>

          {/* Image Upload */}
          <div className="mb-4 p-4 border border-success border-dashed rounded text-center bg-light bg-opacity-25">
            <div className="text-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-upload text-secondary" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
              </svg>
            </div>
            <p className="mb-0">
              Drag & Drop or <span className="text-success fw-medium">Choose a Item Image</span> to Upload
            </p>
            <input
              type="file"
              className="d-none"
              accept="image/*"
              id="recipeImage"
              {...register("image")}
            />
            <label htmlFor="recipeImage" className="d-block mt-2 cursor-pointer">
              <span>Choose file</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={() => navigate("/dashboard/recipes")}
              style={{ borderRadius: "4px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success px-4 py-2"
              disabled={isLoading}
              style={{ borderRadius: "4px" }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}