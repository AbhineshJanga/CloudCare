import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export const getDashboardStats = async () => {
  return apiGet("/admin/dashboard");
};

export const getUsers = async () => {
  return apiGet("/admin/users");
};

export const createUser = async (userData) => {
  return apiPost("/admin/users", userData);
};

export const updateUser = async (userId, userData) => {
  return apiPut(`/admin/users/${userId}`, userData);
};

export const deleteUser = async (userId) => {
  return apiDelete(`/admin/users/${userId}`);
};

export const getDoctors = async () => {
  return apiGet("/admin/doctors");
};

export const getPatients = async () => {
  return apiGet("/admin/patients");
};

export const getAppointments = async () => {
  return apiGet("/admin/appointments");
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  return apiPut(`/admin/appointments/${appointmentId}/status`, {
    status,
  });
};