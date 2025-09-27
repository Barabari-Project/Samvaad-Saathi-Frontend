"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { ENDPOINTS } from "@/lib/api-config";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftStartOnRectangleIcon,
  CheckIcon,
  DocumentTextIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

// Create API clients
const usersApiClient = createApiClient(APIService.USERS);
const resumeApiClient = createApiClient(APIService.RESUME);

// Zod validation schema
const profileSchema = z.object({
  targetPosition: z.string().min(1, "Target position is required"),
  yearsExperience: z.string().min(1, "Experience level is required"),
  degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<ProfileFormData>({
    targetPosition: "",
    yearsExperience: "",
    degree: "",
    university: "",
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  // Set up mutations
  const updateProfileMutation = usersApiClient.useMutation({
    url: ENDPOINTS.USERS.PROFILE,
    method: "put",
    successMessage: "Profile updated successfully!",
    errorMessage: "Failed to update profile. Please try again.",
    keyToInvalidate: {
      queryKey: [ENDPOINTS.AUTH.ABOUT_ME],
    },
  });

  const extractResumeMutation = resumeApiClient.useMutation({
    url: ENDPOINTS.RESUME.EXTRACT,
    method: "post",
    successMessage: "Resume processed successfully!",
    errorMessage: "Failed to process resume. Please try again.",
    config: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  const handleEdit = () => {
    setTempData({
      targetPosition: user?.authorizedUser.targetPosition || "",
      yearsExperience: user?.authorizedUser.yearsExperience?.toString() || "",
      degree: user?.authorizedUser.degree || "",
      university: user?.authorizedUser.university || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form data
    const validationResult = profileSchema.safeParse(tempData);

    if (!validationResult.success) {
      const fieldErrors: Partial<ProfileFormData> = {};
      validationResult.error.issues.forEach((error) => {
        const field = error.path[0] as keyof ProfileFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Call resume extraction API if resume is selected
    if (resumeFile) {
      try {
        const formData = new FormData();
        formData.append("file", resumeFile);
        await extractResumeMutation.mutateAsync(formData);
      } catch (error) {
        toast.error("Resume extraction failed");
        // Don't prevent form submission if extraction fails
      }
    }

    // Create FormData for the API call
    const submitData = new FormData();
    submitData.append("degree", tempData.degree);
    submitData.append("university", tempData.university);
    submitData.append("target_position", tempData.targetPosition);
    submitData.append("years_experience", tempData.yearsExperience);
    if (resumeFile) {
      submitData.append("resume", resumeFile);
    }

    try {
      await updateProfileMutation.mutateAsync(submitData);
      setIsEditing(false);
      setResumeFile(null); // Reset resume file after successful update
    } catch (error) {
      // Error handling is done by the mutation's onError callback
      console.error("Profile update failed:", error);
    }
  };

  const handleCancel = () => {
    setTempData({
      targetPosition: "",
      yearsExperience: "",
      degree: "",
      university: "",
    });
    setErrors({});
    setIsEditing(false);
    setResumeFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 1024 * 1024) {
      // max 1MB
      setResumeFile(file);
    } else if (file) {
      alert("File size must be less than 1MB");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ProfileFormData]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleHelpClick = () => {
    window.open("https://www.youtube.com", "_blank");
  };

  const handleSupportClick = () => {
    const phoneNumber = "+918639322365";
    const message = "Hi, I need support with Samvaad Saathi app.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!user) {
    return (
      <main className="p-8 max-w-md mx-auto">
        <section className="card bg-base-200 shadow-xl">
          {/* Avatar Skeleton */}
          <div className="card-body items-center text-center">
            <div className="avatar">
              <div className="w-20 rounded-full">
                <div className="skeleton w-full h-full"></div>
              </div>
            </div>
            <div className="skeleton h-8 w-32 mt-4"></div>
            <div className="skeleton h-4 w-24 mt-2"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="stats shadow">
            <div className="stat">
              <div className="skeleton h-3 w-24 mb-2"></div>
              <div className="skeleton h-8 w-12"></div>
            </div>
          </div>

          {/* Profile Information Skeleton */}
          <div className="card-body space-y-4">
            <div className="flex justify-between items-center">
              <div className="skeleton h-6 w-40"></div>
              <div className="skeleton h-10 w-10 rounded-lg"></div>
            </div>

            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <div className="skeleton h-4 w-20 mb-2"></div>
                  <div className="skeleton h-12 w-full rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="card-actions">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-full">
                <div className="flex items-center gap-3 p-4">
                  <div className="skeleton h-6 w-6"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      {/* Card */}
      <section className=" ">
        {/* Avatar */}
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-20 rounded-full">
              <Image
                src="https://avatar.iran.liara.run/public"
                alt="User avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          <h2 className="card-title text-2xl">{user.authorizedUser.name}</h2>
          <p className="text-base-content/70">
            {user.authorizedUser.targetPosition || "No position set"}
          </p>
        </div>

        {/* Stats */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Interviews attempted</div>
            <div className="stat-value text-primary">20</div>
          </div>
        </div>

        {/* Profile Information */}
        <div className=" space-y-4 my-10">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center">
            <h3 className="card-title">Profile Information</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="btn btn-ghost btn-sm"
                title="Edit Profile"
              >
                <PencilIcon className="size-5" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="btn btn-success btn-sm"
                  title="Save Changes"
                >
                  {updateProfileMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <CheckIcon className="size-5" />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="btn btn-error btn-sm"
                  title="Cancel"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>
            )}
          </div>

          {/* Profile Data - View Mode */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Target Position</span>
                </label>
                <select
                  disabled
                  className="select select-bordered w-full"
                  value={user.authorizedUser.targetPosition || ""}
                >
                  <option value="">Not specified</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Experience Level</span>
                </label>
                <select
                  disabled
                  className="select select-bordered w-full"
                  value={user.authorizedUser.yearsExperience?.toString() || ""}
                >
                  <option value="">Not specified</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Degree</span>
                </label>
                <select
                  disabled
                  className="select select-bordered w-full"
                  value={user.authorizedUser.degree || ""}
                >
                  <option value="">Not specified</option>
                  <option value="BBA">BBA</option>
                  <option value="BCA">BCA</option>
                  <option value="Bcom Computers">Bcom Computers</option>
                  <option value="BSc Al/ML">BSc Al/ML</option>
                  <option value="BSc Computer Science">
                    BSc Computer Science
                  </option>
                  <option value="BSc Life Science">BSc Life Science</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">University</span>
                </label>
                <select
                  disabled
                  className="select select-bordered w-full"
                  value={user.authorizedUser.university || ""}
                >
                  <option value="">Not specified</option>
                  <option value="GDC Begumpet">GDC Begumpet</option>
                  <option value="GDC Nampally">GDC Nampally</option>
                  <option value="Government City College">
                    Government City College
                  </option>
                  <option value="GDC Husaini Alam">GDC Husaini Alam</option>
                  <option value="GDC Narayanguda">GDC Narayanguda</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Resume (Optional, Max 1MB)</span>
                </label>
                <div className="file-input file-input-bordered w-full">
                  <input type="file" disabled className="file-input w-full" />
                </div>
              </div>
            </div>
          ) : (
            /* Profile Data - Edit Mode */
            <div className="space-y-4">
              <div className="form-control">
                <label htmlFor="targetPosition" className="label">
                  <span className="label-text">Target Position</span>
                </label>
                <select
                  id="targetPosition"
                  value={tempData.targetPosition}
                  onChange={(e) =>
                    handleInputChange("targetPosition", e.target.value)
                  }
                  disabled={updateProfileMutation.isPending}
                  className={`select select-bordered w-full ${
                    errors.targetPosition ? "select-error" : ""
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
                {errors.targetPosition && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.targetPosition}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="yearsExperience" className="label">
                  <span className="label-text">Experience Level</span>
                </label>
                <select
                  id="yearsExperience"
                  value={tempData.yearsExperience}
                  onChange={(e) =>
                    handleInputChange("yearsExperience", e.target.value)
                  }
                  disabled={updateProfileMutation.isPending}
                  className={`select select-bordered w-full ${
                    errors.yearsExperience ? "select-error" : ""
                  }`}
                >
                  <option value="">Select Experience Level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
                {errors.yearsExperience && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.yearsExperience}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="degree" className="label">
                  <span className="label-text">Degree</span>
                </label>
                <select
                  id="degree"
                  value={tempData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  disabled={updateProfileMutation.isPending}
                  className={`select select-bordered w-full ${
                    errors.degree ? "select-error" : ""
                  }`}
                >
                  <option value="">Select Degree</option>
                  <option value="BBA">BBA</option>
                  <option value="BCA">BCA</option>
                  <option value="Bcom Computers">Bcom Computers</option>
                  <option value="BSc Al/ML">BSc Al/ML</option>
                  <option value="BSc Computer Science">
                    BSc Computer Science
                  </option>
                  <option value="BSc Life Science">BSc Life Science</option>
                </select>
                {errors.degree && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.degree}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="university" className="label">
                  <span className="label-text">University</span>
                </label>
                <select
                  id="university"
                  value={tempData.university}
                  onChange={(e) =>
                    handleInputChange("university", e.target.value)
                  }
                  disabled={updateProfileMutation.isPending}
                  className={`select select-bordered w-full ${
                    errors.university ? "select-error" : ""
                  }`}
                >
                  <option value="">Select University</option>
                  <option value="GDC Begumpet">GDC Begumpet</option>
                  <option value="GDC Nampally">GDC Nampally</option>
                  <option value="Government City College">
                    Government City College
                  </option>
                  <option value="GDC Husaini Alam">GDC Husaini Alam</option>
                  <option value="GDC Narayanguda">GDC Narayanguda</option>
                </select>
                {errors.university && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.university}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="resume" className="label">
                  <span className="label-text">Resume (Optional, Max 1MB)</span>
                </label>
                <div className="file-input w-full">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={updateProfileMutation.isPending}
                    className="file-input w-full"
                  />
                </div>
                {resumeFile && (
                  <label className="label">
                    <span className="label-text-alt text-success flex items-center gap-1">
                      <DocumentTextIcon className="size-3" />
                      File selected successfully
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions flex-col space-y-2">
          <div className="flex items-center gap-10 justify-between w-full">
            <button
              onClick={handleHelpClick}
              className="btn btn-ghost  justify-center flex-1"
            >
              <QuestionMarkCircleIcon className="size-6" />
              Help
            </button>
            <button
              onClick={handleSupportClick}
              className="btn btn-ghost  justify-center  flex-1"
            >
              <ChatBubbleLeftRightIcon className="size-6" />
              Support
            </button>
          </div>

          <button
            onClick={signOut}
            className="btn btn-soft btn-error w-full justify-start"
          >
            <ArrowLeftStartOnRectangleIcon className="size-6" />
            Log Out
          </button>
        </div>
      </section>
    </main>
  );
}
