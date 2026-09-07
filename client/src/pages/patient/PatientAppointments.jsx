import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import {
  getDoctors,
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
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

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [appointmentsResponse, doctorsResponse] =
        await Promise.all([
          getPatientAppointments(),
          getDoctors(),
        ]);

      setAppointments(appointmentsResponse.appointments || []);
      setDoctors(doctorsResponse.doctors || []);
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const openBookingModal = () => {
    setFormData({
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
      reason: "",
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    if (!isBooking) {
      setIsModalOpen(false);
    }
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    if (
      !formData.doctor_id ||
      !formData.appointment_date ||
      !formData.appointment_time
    ) {
      setError(
        "Doctor, date, and time are required."
      );
      return;
    }

    try {
      setIsBooking(true);
      setError("");

      await bookAppointment(formData);

      setSuccess(
        "Appointment booked successfully."
      );

      setIsModalOpen(false);

      await loadAppointments();
    } catch (err) {
      setError(
        err.message || "Unable to book appointment."
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) {
      return;
    }

    try {
      setIsCancelling(true);
      setError("");
      setSuccess("");

      await cancelAppointment(
        selectedAppointment.appointment_id
      );

      setSuccess(
        "Appointment cancelled successfully."
      );

      setSelectedAppointment(null);

      await loadAppointments();
    } catch (err) {
      setError(
        err.message || "Unable to cancel appointment."
      );
    } finally {
      setIsCancelling(false);
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
        title="My Appointments"
        description="View, book, and manage your healthcare appointments."
        actions={
          <Button onClick={openBookingModal}>
            Book Appointment
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

      <Card
        title="Appointment History"
        description="Your scheduled and previous appointments."
      >
        {appointments.length === 0 ? (
          <EmptyState
            title="No appointments"
            message="You don't have any appointments yet. Book your first appointment with a doctor."
            action={
              <Button onClick={openBookingModal}>
                Book Appointment
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-900">
                        Dr. {appointment.doctor_name}
                      </h3>

                      <Badge
                        variant={getStatusVariant(
                          appointment.status
                        )}
                      >
                        {appointment.status}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.specialization}
                    </p>

                    <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
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

                      {appointment.reason && (
                        <p className="sm:col-span-2">
                          <span className="font-medium">
                            Reason:
                          </span>{" "}
                          {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {(appointment.status === "SCHEDULED" ||
                    appointment.status === "CONFIRMED") && (
                    <Button
                      variant="danger"
                      onClick={() =>
                        setSelectedAppointment(appointment)
                      }
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Booking modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeBookingModal}
        title="Book Appointment"
        size="lg"
      >
        <form
          onSubmit={handleBookAppointment}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="doctor_id"
              className="block text-sm font-medium text-slate-700"
            >
              Doctor
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              disabled={isBooking}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                Select a doctor
              </option>

              {doctors.map((doctor) => (
                <option
                  key={doctor.doctor_id}
                  value={doctor.doctor_id}
                >
                  Dr. {doctor.name} — {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Appointment date"
              name="appointment_date"
              type="date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              disabled={isBooking}
            />

            <Input
              label="Appointment time"
              name="appointment_time"
              type="time"
              value={formData.appointment_time}
              onChange={handleChange}
              required
              disabled={isBooking}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-slate-700"
            >
              Reason for appointment
            </label>

            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly describe the reason for your appointment"
              rows={4}
              disabled={isBooking}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={closeBookingModal}
              disabled={isBooking}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isBooking}
            >
              {isBooking
                ? "Booking..."
                : "Book Appointment"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancellation confirmation */}
      <Modal
        isOpen={Boolean(selectedAppointment)}
        onClose={() =>
          !isCancelling &&
          setSelectedAppointment(null)
        }
        title="Cancel Appointment"
        size="sm"
      >
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to cancel this appointment
          with{" "}
          <span className="font-semibold text-slate-800">
            Dr. {selectedAppointment?.doctor_name}
          </span>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() =>
              setSelectedAppointment(null)
            }
            disabled={isCancelling}
          >
            Keep Appointment
          </Button>

          <Button
            variant="danger"
            onClick={handleCancelAppointment}
            disabled={isCancelling}
          >
            {isCancelling
              ? "Cancelling..."
              : "Yes, Cancel"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientAppointments;