import "./App.css";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ForgetPass from "./Moduals/Authentication/ForgetPass/ForgetPass";
import Login from "./Moduals/Authentication/Login/Login";
import Registration from "./Moduals/Authentication/Register/Register";
import ResetPass from "./Moduals/Authentication/ResetPass/ResetPass";
import VerifyAccount from "./Moduals/Authentication/VerifyAccount/VerifyAccount";
import Categorielist from "./Moduals/Categories/CategorieList/Categorielist";
import Dashboard from "./Moduals/dashboard/Dashboard";
import Favorite from "./Moduals/Recipes/Favorite/Favorite";
import Recipedata from "./Moduals/Recipes/Recipedata/Recipedata";
import Recipelist from "./Moduals/Recipes/Recipelist/Recipelist";
import AuthLayout from "./Moduals/Shared/AuthLayout/AuthLayout";
import MasterLayout from "./Moduals/Shared/MasterLayout/MasterLayout";
import NotFound from "./Moduals/Shared/NotFound/NotFound";
import UsersList from "./Moduals/Users/UsersList/UsersList";
import ProtectedRoute from "./Moduals/Shared/ProtectedRoute/ProtectedRoute";
import { AuthContext } from "./context/AuthContext/AuthContext";
import RecipeForm from "./Moduals/Recipes/Recipesform/Recipesform";

function App() {
  const { loginData } = useContext(AuthContext);

  const routes = createHashRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: loginData ? <Navigate to="/dashboard" /> : <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Registration /> },
        { path: "forget-password", element: <ForgetPass /> },
        { path: "reset-password", element: <ResetPass /> },
        { path: "verify-account", element: <VerifyAccount /> },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "recipes", element: <Recipelist /> },
        { path: "recipes/add", element: <RecipeForm /> },
        { path: "recipes/edit/:id", element: <RecipeForm /> },
        { path: "recipe-data", element: <Recipedata /> },
        { path: "categories", element: <Categorielist /> },
        { path: "users", element: <UsersList /> },
        { path: "favorites", element: <Favorite /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
