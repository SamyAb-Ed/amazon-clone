import axios from "axios";
const axiosInstance = axios.create({
  //deployed version of firebase function
  // baseURL: "https://api-pk4tgockea-uc.a.run.app",
  //deployed version of amazon server on render.com
  baseURL: "https://amazon-api-deploy-gfkb.onrender.com",
});
export default axiosInstance;
