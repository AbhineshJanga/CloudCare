import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import {
  getDoctorPrescriptions,
  getDoctorAppointments,
  createPrescription,
} from "../../services/doctor.service";

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    appointment_id: "",
    prescription_date: "",
    medicines: "",
    instructions: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          prescriptionsResponse,
          appointmentsResponse,
        ] = await Promise.all([
          getDoctorPrescriptions(),
          getDoctorAppointments(),
        ]);

        setPrescriptions(
          prescriptionsResponse.prescriptions || []
        );

        setAppointments(
          appointmentsResponse.appointments || []
        );
      } catch (err) {
        setError(
          err.message || "Unable to load prescriptions."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const openModal = () => {
    setFormData({
      appointment_id: "",
      prescription_date: "",
      medicines: "",
      instructions: "",
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSaving) {
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await createPrescription({
        ...formData,
        appointment_id: Number(formData.appointment_id),
      });

      setPrescriptions((previous) => [
        response.prescription,
        ...previous,
      ]);

      setSuccess(
        "Prescription created successfully."
      );

      setIsModalOpen(false);
    } catch (err) {
      setError(
        err.message || "Unable to create prescription."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Loading message="Loading prescriptions..." />
    );
  }

  // Only appointments without an existing prescription
  // can be selected.
  const prescribedAppointmentIds = new Set(
    prescriptions.map(
      (prescription) => prescription.appointment_id
    )
  );

  const availableAppointments = appointments.filter(
    (appointment) =>
      !prescribedAppointmentIds.has(
        appointment.appointment_id
      )
  );

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="View and create prescriptions for your patients."
        actions={
          <Button
            onClick={openModal}
            disabled={availableAppointments.length === 0}
          >
            Add Prescription
          </Button>
        }
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

      {prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions"
          message="You have not created any prescriptions yet."
          action={
            availableAppointments.length > 0 ? (
              <Button onClick={openModal}>
                Add Prescription
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <Card
              key={prescription.prescription_id}
              title={`Prescription #${prescription.prescription_id} — ${prescription.patient_name}`}
              description={`Prescribed on ${prescription.prescription_date}`}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Patient
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {prescription.patient_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Patient ID: {prescription.patient_id}
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add Prescription"
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="appointment_id"
              className="block text-sm font-medium text-slate-700"
            >
              Appointment
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              id="appointment_id"
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleChange}
              required
              disabled={
                isSaving ||
                availableAppointments.length === 0
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="">
                Select appointment
              </option>

              {availableAppointments.map(
                (appointment) => (
                  <option
                    key={appointment.appointment_id}
                    value={appointment.appointment_id}
                  >
                    {appointment.patient_name} —{" "}
                    {appointment.appointment_date}{" "}
                    {appointment.appointment_time}
                  </option>
                )
              )}
            </select>

            {availableAppointments.length === 0 && (
              <p className="text-xs text-slate-500">
                All available appointments already have
                prescriptions.
              </p>
            )}
          </div>

          <Input
            label="Prescription date"
            name="prescription_date"
            type="date"
            value={formData.prescription_date}
            onChange={handleChange}
            required
            disabled={isSaving}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="medicines"
              className="block text-sm font-medium text-slate-700"
            >
              Medicines
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              id="medicines"
              name="medicines"
              value={formData.medicines}
              onChange={handleChange}
              placeholder="Enter medicines and dosage instructions"
              rows={5}
              required
              disabled={isSaving}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-slate-700"
            >
              Instructions
            </label>

            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Enter additional instructions for the patient"
              rows={4}
              disabled={isSaving}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSaving ||
                availableAppointments.length === 0
              }
            >
              {isSaving
                ? "Saving..."
                : "Create Prescription"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorPrescriptions;