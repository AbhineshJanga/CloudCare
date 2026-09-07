import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import { getPatientProfile, updatePatientProfile } from "../../services/patient.service";

const PatientProfile = () => {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        address: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await getPatientProfile();

                setProfile(response.data);

                setProfile(response.profile);

                setFormData({
                    name: response.profile.name || "",
                    phone: response.profile.phone || "",
                    date_of_birth: response.profile.date_of_birth
                        ? String(response.profile.date_of_birth).slice(0, 10)
                        : "",
                    gender: response.profile.gender || "",
                    address: response.profile.address || "",
                });
            } catch (err) {
                setError(err.message || "Unable to load your profile.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSaving(true);
            setError("");
            setSuccess("");

            const response = await updatePatientProfile(formData);

            setProfile(response.profile);

            setFormData({
                name: response.profile.name || "",
                phone: response.profile.phone || "",
                date_of_birth: response.profile.date_of_birth
                    ? String(response.profile.date_of_birth).slice(0, 10)
                    : "",
                gender: response.profile.gender || "",
                address: response.profile.address || "",
            });

            setSuccess("Profile updated successfully.");
        } catch (err) {
            setError(err.message || "Unable to update your profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Loading message="Loading your profile..." />;
    }

    if (!profile) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-700">
                    {error || "Patient profile could not be loaded."}
                </p>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="My Profile"
                description="View and update your personal information."
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

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Account information */}
                <Card
                    title="Account Information"
                    description="Information associated with your CloudCare account."
                    className="lg:col-span-1"
                >
                    <div className="space-y-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm font-medium text-slate-800">
                                {profile.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Account Role
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {profile.role}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Patient ID
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {profile.patient_id}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Profile form */}
                <Card
                    title="Personal Information"
                    description="Keep your healthcare information up to date."
                    className="lg:col-span-2"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Input
                                label="Full name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                disabled={isSaving}
                            />

                            <Input
                                label="Phone number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                disabled={isSaving}
                            />

                            <Input
                                label="Date of birth"
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                disabled={isSaving}
                            />

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Gender
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                rows={4}
                                disabled={isSaving}
                                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                        </div>

                        <div className="flex justify-end border-t border-slate-100 pt-5">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default PatientProfile;