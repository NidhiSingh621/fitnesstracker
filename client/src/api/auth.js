import axios from "axios";

// API function to handle user sign-in
export const UserSignIn = async (credentials) => {
  const response = await axios.post("http://localhost:8080/signin", credentials);
  return response;
};
