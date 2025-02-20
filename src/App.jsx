import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ForgetPass from "./Moduals/Authentication/ForgetPass/ForgetPass";
import Login from "./Moduals/Authentication/Login/Login";
import Register from "./Moduals/Authentication/Register/Register";
import ResetPass from "./Moduals/Authentication/ResetPass/ResetPass";
import VerifyAccount from "./Moduals/Authentication/VerifyAccount/VerifyAccount";
import Categoriedata from "./Moduals/Categories/CategorieData/Categoriedata";
import Categorielist from "./Moduals/Categories/CategorieList/Categorielist";
import Dashboard from "./Moduals/dashboard/Dashboard";
import Favorite from "./Moduals/Recipes/Favorite/Favorite";
import Recipedata from "./Moduals/Recipes/Recipedata/Recipedata";
import Recipelist from "./Moduals/Recipes/Recipelist/Recipelist";
import Recipesform from "./Moduals/Recipes/Recipesform/Recipesform";
import AuthLayout from "./Moduals/Shared/AuthLayout/AuthLayout";
import MasterLayout from "./Moduals/Shared/MasterLayout/MasterLayout";
import NotFound from "./Moduals/Shared/NotFound/NotFound";
import UsersList from "./Moduals/Users/UsersList/UsersList";
import ProtectedRoute from "./Moduals/Shared/ProtectedRoute/ProtectedRoute";

function App() {
  const [loginData, setLoginData] = useState(null);
  console.log(loginData)
 
  useEffect(() => {
    const encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      try {
        const decodedToken = jwtDecode(encodedToken);
        setLoginData(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        setLoginData(null);
      }
    }
  }, []);

  const saveLoginData = () => {
    const encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      try {
        const decodedToken = jwtDecode(encodedToken);
        setLoginData(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        setLoginData(null);
      }
    }
  }; 

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, 
          element: loginData ? <Navigate to="/dashboard" /> : <Login loginData={loginData} saveLoginData={saveLoginData} /> },
        { path: "login", element: <Login  loginData={loginData} saveLoginData={saveLoginData} /> },
        { path: "register", element: <Register /> },
        { path: "forget-password", element: <ForgetPass /> },
        { path: "reset-password", element: <ResetPass /> },
        { path: "verify-account", element: <VerifyAccount /> },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <MasterLayout loginData={loginData} />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard loginData={loginData} /> },
        { path: "recipes", element: <Recipelist /> },
        { path: "recipes/new-recipe", element: <Recipesform /> },
        { path: "recipe-data", element: <Recipedata /> },
        { path: "categories", element: <Categoriedata /> },
        { path: "category-data", element: <Categorielist /> },
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
