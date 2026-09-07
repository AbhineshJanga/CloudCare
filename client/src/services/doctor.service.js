import { apiGet, apiPost, apiPut } from "./api";

export const getDoctorProfile = async () => {
  return apiGet("/doctors/profile");
};

export const updateDoctorProfile = async (profileData) => {
  return apiPut("/doctors/profile", profileData);
};

export const getDoctorAppointments = async () => {
  return apiGet("/doctors/appointments");
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  return apiPut(`/doctors/appointments/${appointmentId}/status`, {
    status,
  });
};

export const getDoctorPatients = async () => {
  return apiGet("/doctors/patients");
};

export const getDoctorPatientById = async (patientId) => {
  return apiGet(`/doctors/patients/${patientId}`);
};

export const getDoctorMedicalRecords = async () => {
  return apiGet("/doctors/medical-records");
};

export const createMedicalRecord = async (recordData) => {
  return apiPost("/doctors/medical-records", recordData);
};

export const getDoctorPrescriptions = async () => {
  return apiGet("/doctors/prescriptions");
};

export const createPrescription = async (prescriptionData) => {
  return apiPost("/doctors/prescriptions", prescriptionData);
};