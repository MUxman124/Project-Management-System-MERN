import axios from "axios";
import { useAuth } from '@/context/AuthContext'
import Cookies from "js-cookie";
const useAxios = () => {
  const token = Cookies.get("token");
  // console.log(token, "token");
  const instance = axios.create({
    baseURL: `http://localhost:5000/api/`,
  });

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export default useAxios;
