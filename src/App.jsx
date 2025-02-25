import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import React, {  useContext } from "react"; 
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
import { AuthContext } from "./context/AuthContext/AuthContext";

function App() {
   
  const { loginData} = useContext(AuthContext);

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, 
          element: loginData ? <Navigate to="/dashboard" /> : <Login   /> },
        { path: "login", element: <Login   /> },
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
          <MasterLayout  />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "recipes", element: <Recipelist /> },
        { path: "recipes/new-recipe", element: <Recipesform /> },
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
