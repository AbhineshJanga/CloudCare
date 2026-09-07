import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../services/doctor.service";

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    experience: "",
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

        const response = await getDoctorProfile();
        const doctorProfile = response.profile;

        setProfile(doctorProfile);

        setFormData({
          name: doctorProfile.name || "",
          phone: doctorProfile.phone || "",
          specialization: doctorProfile.specialization || "",
          experience:
            doctorProfile.experience !== null &&
            doctorProfile.experience !== undefined
              ? String(doctorProfile.experience)
              : "",
        });
      } catch (err) {
        setError(
          err.message || "Unable to load your profile."
        );
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

      const response = await updateDoctorProfile({
        ...formData,
        experience:
          formData.experience === ""
            ? null
            : Number(formData.experience),
      });

      const updatedProfile = response.profile;

      setProfile(updatedProfile);

      setFormData({
        name: updatedProfile.name || "",
        phone: updatedProfile.phone || "",
        specialization: updatedProfile.specialization || "",
        experience:
          updatedProfile.experience !== null &&
          updatedProfile.experience !== undefined
            ? String(updatedProfile.experience)
            : "",
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to update your profile."
      );
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
          {error || "Doctor profile could not be loaded."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="View and update your professional information."
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
        {/* Professional account information */}
        <Card
          title="Professional Information"
          description="Information associated with your doctor account."
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
                Doctor ID
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {profile.doctor_id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                License Number
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {profile.license_number}
              </p>
            </div>
          </div>
        </Card>

        {/* Editable information */}
        <Card
          title="Personal & Professional Details"
          description="Keep your doctor information up to date."
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
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
                required
                disabled={isSaving}
              />

              <Input
                label="Years of experience"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter years of experience"
                disabled={isSaving}
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

export default DoctorProfile;