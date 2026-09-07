import { apiGet, apiPost, apiPut } from "./api";

export const getPatientProfile = async () => {
  return apiGet("/patients/profile");
};

export const updatePatientProfile = async (profileData) => {
  return apiPut("/patients/profile", profileData);
};

export const getDoctors = async () => {
  return apiGet("/patients/doctors");
};

export const bookAppointment = async (appointmentData) => {
  return apiPost("/patients/appointments", appointmentData);
};

export const getPatientAppointments = async () => {
  return apiGet("/patients/appointments");
};

export const cancelAppointment = async (appointmentId) => {
  return apiPut(`/patients/appointments/${appointmentId}/cancel`);
};

export const getMedicalRecords = async () => {
  return apiGet("/patients/medical-records");
};

export const getPrescriptions = async () => {
  return apiGet("/patients/prescriptions");
};