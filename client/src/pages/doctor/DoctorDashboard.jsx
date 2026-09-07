import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import {
  getDoctorProfile,
  getDoctorAppointments,
  getDoctorPatients,
  getDoctorMedicalRecords,
  getDoctorPrescriptions,
} from "../../services/doctor.service";

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

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
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
          patientsResponse,
          recordsResponse,
          prescriptionsResponse,
        ] = await Promise.all([
          getDoctorProfile(),
          getDoctorAppointments(),
          getDoctorPatients(),
          getDoctorMedicalRecords(),
          getDoctorPrescriptions(),
        ]);

        setProfile(profileResponse.profile);
        setAppointments(appointmentsResponse.appointments || []);
        setPatients(patientsResponse.patients || []);
        setMedicalRecords(recordsResponse.records || []);
        setPrescriptions(
          prescriptionsResponse.prescriptions || []
        );
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
        title={`Welcome, Dr. ${profile?.name || "Doctor"}`}
        description="Here's an overview of your healthcare activities."
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          description="Scheduled or confirmed"
        />

        <StatCard
          title="My Patients"
          value={patients.length}
          description="Patients with appointments"
        />

        <StatCard
          title="Medical Records"
          value={medicalRecords.length}
          description="Records created"
        />

        <StatCard
          title="Prescriptions"
          value={prescriptions.length}
          description="Prescriptions created"
        />
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        {/* Recent appointments */}
        <Card
          title="Recent Appointments"
          description="Your latest patient appointments."
        >
          {recentAppointments.length === 0 ? (
            <EmptyState
              title="No appointments"
              message="There are no appointments associated with your account."
            />
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="rounded-lg border border-slate-100 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {appointment.patient_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.appointment_date} at{" "}
                        {appointment.appointment_time}
                      </p>

                      {appointment.reason && (
                        <p className="mt-2 text-xs text-slate-400">
                          {appointment.reason}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant={getStatusVariant(
                        appointment.status
                      )}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Doctor profile */}
        <Card
          title="Professional Summary"
          description="Your current professional information."
        >
          {profile && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-1 font-medium text-slate-800">
                  Dr. {profile.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Specialization
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {profile.specialization}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Experience
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {profile.experience !== null &&
                  profile.experience !== undefined
                    ? `${profile.experience} years`
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  License Number
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {profile.license_number}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;