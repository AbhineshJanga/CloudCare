import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import {
    getDoctorPatients,
    getDoctorPatientById,
} from "../../services/doctor.service";

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const [error, setError] = useState("");
    const [detailError, setDetailError] = useState("");

    useEffect(() => {
        const loadPatients = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await getDoctorPatients();

                setPatients(response.patients || []);
            } catch (err) {
                setError(
                    err.message || "Unable to load your patients."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadPatients();
    }, []);

    const handleViewPatient = async (patientId) => {
        try {
            setIsLoadingDetails(true);
            setDetailError("");
            setSelectedPatient(null);

            const response = await getDoctorPatientById(patientId);

            setSelectedPatient(response.patient);
        } catch (err) {
            setDetailError(
                err.message || "Unable to load patient details."
            );
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const closeDetails = () => {
        if (!isLoadingDetails) {
            setSelectedPatient(null);
            setDetailError("");
        }
    };

    if (isLoading) {
        return (
            <Loading message="Loading your patients..." />
        );
    }

    return (
        <div>
            <PageHeader
                title="My Patients"
                description="View patients who have appointments with you."
            />

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {patients.length === 0 ? (
                <EmptyState
                    title="No patients"
                    message="You currently have no patients with appointments."
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {patients.map((patient) => (
                        <Card
                            key={patient.patient_id}
                            title={patient.name}
                            description={`Patient ID: ${patient.patient_id}`}
                        >
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm text-slate-700">
                                        {patient.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {patient.phone || "Not provided"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Gender
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {patient.gender || "Not provided"}
                                    </p>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() =>
                                            handleViewPatient(patient.patient_id)
                                        }
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Patient details modal */}
            <Modal
                isOpen={
                    Boolean(selectedPatient) ||
                    isLoadingDetails ||
                    Boolean(detailError)
                }
                onClose={closeDetails}
                title="Patient Details"
                size="lg"
            >
                {isLoadingDetails ? (
                    <Loading message="Loading patient details..." />
                ) : detailError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {detailError}
                    </div>
                ) : selectedPatient ? (
                    <div className="space-y-6">
                        <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Patient
                            </p>

                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                {selectedPatient.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Patient ID: {selectedPatient.patient_id}
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Email
                                </p>

                                <p className="mt-1 break-all text-sm text-slate-700">
                                    {selectedPatient.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedPatient.phone || "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Date of Birth
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedPatient.date_of_birth
                                        ? String(
                                            selectedPatient.date_of_birth
                                        ).slice(0, 10)
                                        : "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Gender
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {selectedPatient.gender ||
                                        "Not provided"}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Address
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-700">
                                    {selectedPatient.address ||
                                        "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-100 pt-5">
                            <Button
                                variant="outline"
                                onClick={closeDetails}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
};

export default DoctorPatients;