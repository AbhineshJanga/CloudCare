import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import {
    getDoctorAppointments,
    updateAppointmentStatus,
} from "../../services/doctor.service";

const STATUS_OPTIONS = [
    "SCHEDULED",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
];

const getStatusVariant = (status) => {
    switch (status) {
        case "CONFIRMED":
        case "COMPLETED":
            return "success";
        case "CANCELLED":
            return "danger";
        case "SCHEDULED":
            return "info";
        default:
            return "default";
    }
};

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadAppointments = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await getDoctorAppointments();

            setAppointments(response.appointments || []);
        } catch (err) {
            setError(
                err.message || "Unable to load appointments."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const handleStatusChange = async (
        appointmentId,
        status
    ) => {
        try {
            setUpdatingId(appointmentId);
            setError("");
            setSuccess("");

            const response = await updateAppointmentStatus(
                appointmentId,
                status
            );

            const updatedAppointment = response.appointment;

            setAppointments((previous) =>
                previous.map((appointment) =>
                    appointment.appointment_id === appointmentId
                        ? updatedAppointment
                        : appointment
                )
            );

            setSuccess(
                "Appointment status updated successfully."
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to update appointment status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return (
            <Loading message="Loading your appointments..." />
        );
    }

    return (
        <div>
            <PageHeader
                title="Appointments"
                description="View and manage appointments with your patients."
            />

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            <Card
                title="Appointment List"
                description="Manage the status of your patient appointments."
            >
                {appointments.length === 0 ? (
                    <EmptyState
                        title="No appointments"
                        message="There are no appointments associated with your account."
                    />
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.appointment_id}
                                className="rounded-xl border border-slate-200 p-5"
                            >
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                    {/* Patient details */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {appointment.patient_name}
                                            </h3>

                                            <Badge
                                                variant={getStatusVariant(
                                                    appointment.status
                                                )}
                                            >
                                                {appointment.status}
                                            </Badge>
                                        </div>

                                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                            <p>
                                                <span className="font-medium">
                                                    Email:
                                                </span>{" "}
                                                {appointment.patient_email}
                                            </p>

                                            <p>
                                                <span className="font-medium">
                                                    Phone:
                                                </span>{" "}
                                                {appointment.patient_phone ||
                                                    "Not provided"}
                                            </p>

                                            <p>
                                                <span className="font-medium">
                                                    Date:
                                                </span>{" "}
                                                {appointment.appointment_date}
                                            </p>

                                            <p>
                                                <span className="font-medium">
                                                    Time:
                                                </span>{" "}
                                                {appointment.appointment_time}
                                            </p>
                                        </div>

                                        {appointment.reason && (
                                            <div className="mt-4 rounded-lg bg-slate-50 p-4">
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                    Reason
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-slate-700">
                                                    {appointment.reason}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status controls */}
                                    <div className="w-full xl:w-56">
                                        <label
                                            htmlFor={`status-${appointment.appointment_id}`}
                                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
                                        >
                                            Update Status
                                        </label>

                                        <select
                                            id={`status-${appointment.appointment_id}`}
                                            value={appointment.status}
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    appointment.appointment_id,
                                                    event.target.value
                                                )
                                            }
                                            disabled={
                                                updatingId ===
                                                appointment.appointment_id
                                            }
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        {updatingId ===
                                            appointment.appointment_id && (
                                                <p className="mt-2 text-xs text-slate-400">
                                                    Updating...
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DoctorAppointments;