import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/auth/Login";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientProfile from "../pages/patient/PatientProfile";
import PatientAppointments from "../pages/patient/PatientAppointments";
import PatientMedicalRecords from "../pages/patient/PatientMedicalRecords";
import PatientPrescriptions from "../pages/patient/PatientPrescriptions";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorPatients from "../pages/doctor/DoctorPatients";
import DoctorMedicalRecords from "../pages/doctor/DoctorMedicalRecords";
import DoctorPrescriptions from "../pages/doctor/DoctorPrescriptions";

const Unauthorized = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
                Unauthorized Access
            </h1>

            <p className="mt-2 text-slate-500">
                You do not have permission to access this page.
            </p>
        </div>
    </div>
);

const NotFound = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
                Page Not Found
            </h1>

            <p className="mt-2 text-slate-500">
                The page you are looking for does not exist.
            </p>
        </div>
    </div>
);

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />

                {/* Authenticated routes */}
                <Route element={<ProtectedRoute />}>
                    {/* Patient Portal */}
                    <Route element={<RoleRoute allowedRoles={["PATIENT"]} />}>
                        <Route element={<DashboardLayout />}>
                            <Route
                                path="/patient"
                                element={<PatientDashboard />}
                            />
                            <Route
                                path="/patient/profile"
                                element={<PatientProfile />}
                            />
                            <Route
                                path="/patient/appointments"
                                element={<PatientAppointments />}
                            />
                            <Route
                                path="/patient/medical-records"
                                element={<PatientMedicalRecords />}
                            />
                            <Route
                                path="/patient/prescriptions"
                                element={<PatientPrescriptions />}
                            />
                        </Route>
                    </Route>

                    {/* Doctor Portal */}
                    <Route element={<RoleRoute allowedRoles={["DOCTOR"]} />}>
                        <Route element={<DashboardLayout />}>
                            <Route
                                path="/doctor"
                                element={<DoctorDashboard />}
                            />
                            <Route
                                path="/doctor/profile"
                                element={<DoctorProfile />}
                            />
                            <Route
                                path="/doctor/appointments"
                                element={<DoctorAppointments />}
                            />
                            <Route
                                path="/doctor/patients"
                                element={<DoctorPatients />}
                            />
                            <Route
                                path="/doctor/medical-records"
                                element={<DoctorMedicalRecords />}
                            />
                            <Route
                                path="/doctor/prescriptions"
                                element={<DoctorPrescriptions />}
                            />
                        </Route>
                    </Route>

                    {/* Admin Portal */}
                    <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                        <Route element={<DashboardLayout />}>
                            <Route
                                path="/admin"
                                element={
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">
                                            Admin Dashboard
                                        </h1>

                                        <p className="mt-2 text-slate-500">
                                            Welcome to your CloudCare administration portal.
                                        </p>
                                    </div>
                                }
                            />
                        </Route>
                    </Route>
                </Route>

                {/* Unauthorized */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Default */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;