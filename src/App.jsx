 
import './App.css'
import ForgetPass from './Moduals/Authentication/ForgetPass/ForgetPass';
import Login from './Moduals/Authentication/Login/Login'
import Register from './Moduals/Authentication/Register/Register' 
import ResetPass from './Moduals/Authentication/ResetPass/ResetPass';
import VerifyAccount from './Moduals/Authentication/VerifyAccount/VerifyAccount';
import Categoriedata from './Moduals/Categories/CategorieData/Categoriedata';
import Categorielist from './Moduals/Categories/CategorieList/Categorielist';
import Dashboard from './Moduals/dashboard/Dashboard';
import Favorite from './Moduals/Recipes/Favorite/Favorite';
import Recipedata from './Moduals/Recipes/Recipedata/Recipedata';
import Recipelist from './Moduals/Recipes/Recipelist/Recipelist';
import Recipesform from './Moduals/Recipes/Recipesform/Recipesform';
import AuthLayout from './Moduals/Shared/AuthLayout/AuthLayout';
import MasterLayout from './Moduals/Shared/MasterLayout/MasterLayout';
import NotFound from './Moduals/Shared/NotFound/NotFound';
import UsersList from './Moduals/Users/UsersList/UsersList';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() { 

  const routes = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout/>,
      errorElement: <NotFound />,
      children: [
        { path: "", element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register/> },
        { path: "forget-password", element: <ForgetPass /> },
        { path: "reset-password", element: <ResetPass/> },
        { path: "verify-account", element: <VerifyAccount /> }, 
      ],
    },
    {
      path: "/dashboard",
      element: <MasterLayout/>,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard  /> },
        { path: "recipes", element: <Recipelist /> },
        { path: "recipes/new-recipe", element: <Recipesform /> },  
        { path: "recipe-data", element: <Recipedata /> },
        { path: "Categories", element: <Categoriedata /> },
        { path: "Category-data", element: <Categorielist /> },
        { path: "users", element: <UsersList /> },
        { path: "favorites", element: <Favorite /> }, 
      ],
    },
  ]);
  return (
   <>
         <ToastContainer />
         <RouterProvider router={routes} />
   
   </>
  )
}

export default App
