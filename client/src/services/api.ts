import axios from "axios";

const api = axios.create({
  baseURL: "https://leetmentor-ltjj.onrender.com/api",
});

export default api;