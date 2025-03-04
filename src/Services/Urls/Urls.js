import axios from "axios";

export const baseURL = "https://upskilling-egypt.com:3006/api/v1";
 
const getToken = () => localStorage.getItem("token");
console.log(getToken)
 
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
  GET_USER: (id) => `/Users/${id}`,
};
 
export const RECIPES_URLS = {
  LIST: "/Recipe",
  GET_RECIPE: (id) => `/Recipe/${id}`,
  CREATE: "/Recipe",
  UPDATE: (id) => `/Recipe/${id}`,
  DELETE: (id) => `/Recipe/${id}`,
};

export const CATEGORY_ENDPOINTS = {
  LIST: "/Category",
  CREATE: "/Category",
  UPDATE: (id) => `/Category/${id}`,
  DELETE: (id) => `/Category/${id}`,
};
export const CHANGE_PASS =  "/Users/ChangePassword"