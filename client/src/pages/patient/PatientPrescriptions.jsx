import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import { getPrescriptions } from "../../services/patient.service";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getPrescriptions();

        setPrescriptions(response.prescriptions || []);
      } catch (err) {
        setError(
          err.message || "Unable to load prescriptions."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPrescriptions();
  }, []);

  if (isLoading) {
    return (
      <Loading message="Loading your prescriptions..." />
    );
  }

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="View medicines and instructions prescribed by your doctors."
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions"
          message="No prescriptions are currently available for your account."
        />
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <Card
              key={prescription.prescription_id}
              title={`Prescription #${prescription.prescription_id}`}
              description={`Prescribed on ${prescription.prescription_date}`}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Doctor
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    Dr. {prescription.doctor_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {prescription.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Appointment
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {prescription.appointment_date}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {prescription.appointment_time}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Medicines
                  </p>

                  <div className="mt-2 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {prescription.medicines}
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Instructions
                    </p>

                    <div className="mt-2 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      {prescription.instructions}
                    </div>
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

export default PatientPrescriptions;