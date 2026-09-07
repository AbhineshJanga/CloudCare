import { apiPost } from "./api";

export const loginUser = async (email, password) => {
  return apiPost("/auth/login", {
    email,
    password,
  });
};