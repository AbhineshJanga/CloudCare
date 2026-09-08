import { useEffect, useState } from "react";
import {
  getAppointments,
  updateAppointmentStatus,
} from "../../services/admin.service";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAppointments();

      setAppointments(response.appointments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      const response = await updateAppointmentStatus(
        appointmentId,
        status
      );

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.appointment_id === appointmentId
            ? response.appointment
            : appointment
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    return <Badge>{status}</Badge>;
  };

  const columns = [
    {
      key: "appointment_id",
      label: "ID",
    },
    {
      key: "patient_name",
      label: "Patient",
      render: (appointment) =>
        appointment.patient_name || "—",
    },
    {
      key: "doctor_name",
      label: "Doctor",
      render: (appointment) =>
        appointment.doctor_name || "—",
    },
    {
      key: "specialization",
      label: "Specialization",
      render: (appointment) =>
        appointment.specialization || "—",
    },
    {
      key: "appointment_date",
      label: "Date",
      render: (appointment) =>
        appointment.appointment_date
          ? new Date(
              appointment.appointment_date
            ).toLocaleDateString()
          : "—",
    },
    {
      key: "appointment_time",
      label: "Time",
      render: (appointment) =>
        appointment.appointment_time || "—",
    },
    {
      key: "reason",
      label: "Reason",
      render: (appointment) =>
        appointment.reason || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) =>
        getStatusBadge(appointment.status),
    },
    {
      key: "actions",
      label: "Update Status",
      render: (appointment) => (
        <div className="flex items-center gap-2">
          <select
            value={appointment.status}
            disabled={
              updatingId === appointment.appointment_id
            }
            onChange={(event) =>
              handleStatusChange(
                appointment.appointment_id,
                event.target.value
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {updatingId === appointment.appointment_id && (
            <span className="text-xs text-slate-500">
              Updating...
            </span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Monitor and manage all appointments across the CloudCare platform."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="There are currently no appointments in the system."
        />
      ) : (
        <DataTable
          columns={columns}
          data={appointments}
          rowKey={(appointment) =>
            appointment.appointment_id
          }
          emptyMessage="No appointments available."
        />
      )}
    </div>
  );
};

export default AdminAppointments;