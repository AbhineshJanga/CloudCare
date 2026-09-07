import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

import { getMedicalRecords } from "../../services/patient.service";

const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMedicalRecords();

        setRecords(response.records || []);
      } catch (err) {
        setError(
          err.message || "Unable to load medical records."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, []);

  if (isLoading) {
    return (
      <Loading message="Loading your medical records..." />
    );
  }

  return (
    <div>
      <PageHeader
        title="Medical Records"
        description="View your medical history and clinical records."
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {records.length === 0 ? (
        <EmptyState
          title="No medical records"
          message="No medical records are currently available for your account."
        />
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <Card
              key={record.record_id}
              title={`Medical Record #${record.record_id}`}
              description={`Recorded on ${record.record_date}`}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Doctor
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    Dr. {record.doctor_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {record.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Appointment
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {record.appointment_date}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {record.appointment_time}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Diagnosis
                  </p>

                  <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {record.diagnosis}
                  </p>
                </div>

                {record.notes && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Doctor's Notes
                    </p>

                    <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientMedicalRecords;