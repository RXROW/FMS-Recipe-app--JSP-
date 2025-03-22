import axios from "axios";

export const baseURL = "https://upskilling-egypt.com:3006/api/v1";
 export const imgURL = "https://upskilling-egypt.com:3006";
const getToken = () => localStorage.getItem("token");
 
 
export const axiosPrivetInstance = axios.create({
  baseURL,
  headers: {
    Authorization: getToken(),
  },
});
 
export const axiosPublicInstance = axios.create({
  baseURL,

});
 
export const USER_URLS = {
  LOGIN: "/Users/Login",
  REGISTER: "/Users/Register",
  FORGET_PASS: "/Users/Reset/Request",
  RESET_PASS: "/Users/Reset",
  LIST:`/Users`,
  GET_USER: (id) => `/Users/${id}`,
  DELETE: (id) => `/Users/${id}`,
};
 
export const RECIPES_URLS = {
  LIST: "/Recipe",
  GET_RECIPE: (id) => `/Recipe/${id}`,
  CREATE: "/Recipe",
  UPDATE: (id) => `/Recipe/${id}`,
  DELETE: (id) => `/Recipe/${id}`,
  DELETE_FROM_FAVORITES: (id) => `/userRecipe/${id}`,
  GET_USER_RECIPES: `/userRecipe`,
  ADD_TO_FAVORITES: `/userRecipe`,
};
//DELETE 

export const CATEGORY_ENDPOINTS = {
  LIST: "/Category",
  CREATE: "/Category",
  UPDATE: (id) => `/Category/${id}`,
  DELETE: (id) => `/Category/${id}`,
};
export const CHANGE_PASS = "/Users/ChangePassword"
export const ALL_TAGS = "/tag"

 