import { useEffect, useState } from "react";
import { getDoctors } from "../../services/admin.service";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getDoctors();

                setDoctors(response.doctors || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load doctors."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDoctors();
    }, []);

    const columns = [
        {
            key: "doctor_id",
            label: "ID",
        },
        {
            key: "name",
            label: "Doctor",
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "phone",
            label: "Phone",
            render: (doctor) => doctor.phone || "—",
        },
        {
            key: "specialization",
            label: "Specialization",
        },
        {
            key: "license_number",
            label: "License",
        },
        {
            key: "experience",
            label: "Experience",
            render: (doctor) =>
                doctor.experience !== null &&
                    doctor.experience !== undefined
                    ? `${doctor.experience} years`
                    : "—",
        },
        {
            key: "status",
            label: "Status",
            render: () => <Badge>ACTIVE</Badge>,
        },
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Doctors"
                description="View and monitor registered doctors on the CloudCare platform."
            />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {doctors.length === 0 ? (
                <EmptyState
                    title="No doctors found"
                    description="There are currently no doctors registered in the system."
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={doctors}
                    rowKey={(doctor) => doctor.doctor_id}
                    emptyMessage="No doctors available."
                />
            )}
        </div>
    );
};

export default AdminDoctors;