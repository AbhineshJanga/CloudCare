import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import {
  getPatientProfile,
  getPatientAppointments,
  getMedicalRecords,
  getPrescriptions,
} from "../../services/patient.service";

const getStatusVariant = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "success";
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

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          profileResponse,
          appointmentsResponse,
          recordsResponse,
          prescriptionsResponse,
        ] = await Promise.all([
          getPatientProfile(),
          getPatientAppointments(),
          getMedicalRecords(),
          getPrescriptions(),
        ]);

        setProfile(profileResponse.data);
        setAppointments(appointmentsResponse.data || []);
        setMedicalRecords(recordsResponse.data || []);
        setPrescriptions(prescriptionsResponse.data || []);
      } catch (err) {
        setError(
          err.message || "Unable to load your dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="font-semibold text-red-800">
          Unable to load dashboard
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "SCHEDULED" ||
      appointment.status === "CONFIRMED"
  );

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.name || "Patient"}`}
        description="Here's an overview of your healthcare activity."
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          description="Scheduled or confirmed"
        />

        <StatCard
          title="Total Appointments"
          value={appointments.length}
          description="Your appointment history"
        />

        <StatCard
          title="Medical Records"
          value={medicalRecords.length}
          description="Available records"
        />

        <StatCard
          title="Prescriptions"
          value={prescriptions.length}
          description="Available prescriptions"
        />
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        {/* Recent appointments */}
        <Card
          title="Recent Appointments"
          description="Your latest appointment activity."
        >
          {recentAppointments.length === 0 ? (
            <EmptyState
              title="No appointments"
              message="You don't have any appointments yet."
            />
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      Dr. {appointment.doctor_name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.specialization}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {appointment.appointment_date} at{" "}
                      {appointment.appointment_time}
                    </p>
                  </div>

                  <Badge
                    variant={getStatusVariant(appointment.status)}
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Profile summary */}
        <Card
          title="Profile Summary"
          description="Your basic account information."
        >
          {profile && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {profile.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {profile.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {profile.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Gender
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {profile.gender || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;