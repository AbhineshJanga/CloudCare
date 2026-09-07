import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import {
  getDoctorMedicalRecords,
  getDoctorPatients,
  getDoctorAppointments,
  createMedicalRecord,
} from "../../services/doctor.service";

const DoctorMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_id: "",
    record_date: "",
    diagnosis: "",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          recordsResponse,
          patientsResponse,
          appointmentsResponse,
        ] = await Promise.all([
          getDoctorMedicalRecords(),
          getDoctorPatients(),
          getDoctorAppointments(),
        ]);

        setRecords(recordsResponse.records || []);
        setPatients(patientsResponse.patients || []);
        setAppointments(
          appointmentsResponse.appointments || []
        );
      } catch (err) {
        setError(
          err.message || "Unable to load medical records."
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
      patient_id: "",
      appointment_id: "",
      record_date: "",
      diagnosis: "",
      notes: "",
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

      const response = await createMedicalRecord({
        ...formData,
        patient_id: Number(formData.patient_id),
        appointment_id: Number(formData.appointment_id),
      });

      setRecords((previous) => [
        response.record,
        ...previous,
      ]);

      setSuccess(
        "Medical record created successfully."
      );

      setIsModalOpen(false);
    } catch (err) {
      setError(
        err.message || "Unable to create medical record."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Loading message="Loading medical records..." />
    );
  }

  return (
    <div>
      <PageHeader
        title="Medical Records"
        description="View and create clinical records for your patients."
        actions={
          <Button onClick={openModal}>
            Add Medical Record
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

      {records.length === 0 ? (
        <EmptyState
          title="No medical records"
          message="You have not created any medical records yet."
          action={
            <Button onClick={openModal}>
              Add Medical Record
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <Card
              key={record.record_id}
              title={`Record #${record.record_id} — ${record.patient_name}`}
              description={`Recorded on ${record.record_date}`}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Patient
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {record.patient_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Patient ID: {record.patient_id}
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
                      Notes
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add Medical Record"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="patient_id"
              className="block text-sm font-medium text-slate-700"
            >
              Patient
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="">
                Select patient
              </option>

              {patients.map((patient) => (
                <option
                  key={patient.patient_id}
                  value={patient.patient_id}
                >
                  {patient.name} — ID {patient.patient_id}
                </option>
              ))}
            </select>
          </div>

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
              disabled={isSaving}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="">
                Select appointment
              </option>

              {appointments.map((appointment) => (
                <option
                  key={appointment.appointment_id}
                  value={appointment.appointment_id}
                >
                  {appointment.patient_name} —{" "}
                  {appointment.appointment_date}{" "}
                  {appointment.appointment_time}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Record date"
            name="record_date"
            type="date"
            value={formData.record_date}
            onChange={handleChange}
            required
            disabled={isSaving}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="diagnosis"
              className="block text-sm font-medium text-slate-700"
            >
              Diagnosis
              <span className="ml-1 text-red-500">*</span>
            </label>

            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis"
              rows={3}
              required
              disabled={isSaving}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter additional clinical notes"
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
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Create Record"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorMedicalRecords;