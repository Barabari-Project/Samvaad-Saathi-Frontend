"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { ENDPOINTS } from "@/lib/api-config";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import {
  DEGREE_OPTIONS,
  EXPERIENCE_OPTIONS,
  MAX_PROFILE_RESUME_SIZE_MB,
  RESUME_FILE_TYPES,
  ROLE_OPTIONS,
  UNIVERSITY_OPTIONS,
} from "@/lib/constants";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftStartOnRectangleIcon,
  DocumentTextIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";

// Create API clients
const usersApiClient = createApiClient(APIService.USERS);

// Zod validation schema
const profileSchema = z.object({
  targetPosition: z.string().min(1, "Target position is required"),
  yearsExperience: z.string().min(1, "Experience level is required"),
  degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type EditableField = keyof ProfileFormData | "resume";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // Separate editing states for each field
  const [isEditingTargetPosition, setIsEditingTargetPosition] = useState(false);
  const [isEditingYearsExperience, setIsEditingYearsExperience] =
    useState(false);
  const [isEditingDegree, setIsEditingDegree] = useState(false);
  const [isEditingUniversity, setIsEditingUniversity] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
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

  // Separate edit handlers for each field
  const handleTargetPositionEdit = () => {
    setIsEditingTargetPosition(true);
    setTempData((prev) => ({
      ...prev,
      targetPosition: user?.authorizedUser.targetPosition || "",
    }));
  };

  const handleYearsExperienceEdit = () => {
    setIsEditingYearsExperience(true);
    setTempData((prev) => ({
      ...prev,
      yearsExperience: user?.authorizedUser.yearsExperience?.toString() || "",
    }));
  };

  const handleDegreeEdit = () => {
    setIsEditingDegree(true);
    setTempData((prev) => ({
      ...prev,
      degree: user?.authorizedUser.degree || "",
    }));
  };

  const handleUniversityEdit = () => {
    setIsEditingUniversity(true);
    setTempData((prev) => ({
      ...prev,
      university: user?.authorizedUser.university || "",
    }));
  };

  const handleResumeEdit = () => {
    setIsEditingResume(true);
  };

  const handleFieldSave = async (field: EditableField) => {
    // Clear previous errors for this field
    if (field !== "resume") {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      // Validate only the specific field
      const fieldValidation = profileSchema.pick({ [field]: true });
      const validationResult = fieldValidation.safeParse({
        [field]: tempData[field],
      });

      if (!validationResult.success) {
        const fieldError = validationResult.error.issues[0]?.message;
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [field]: fieldError,
          }));
          return;
        }
      }
    }

    // Create FormData for the API call with only the specific field
    const submitData = new FormData();

    if (field === "resume") {
      if (resumeFile) {
        submitData.append("resume", resumeFile);
      } else {
        // No file selected, just return
        setIsEditingResume(false);
        return;
      }
    } else {
      submitData.append(
        field === "targetPosition"
          ? "target_position"
          : field === "yearsExperience"
          ? "years_experience"
          : field,
        tempData[field]
      );
    }

    try {
      await updateProfileMutation.mutateAsync(submitData);

      // Reset the specific field's editing state
      if (field === "targetPosition") setIsEditingTargetPosition(false);
      else if (field === "yearsExperience") setIsEditingYearsExperience(false);
      else if (field === "degree") setIsEditingDegree(false);
      else if (field === "university") setIsEditingUniversity(false);
      else if (field === "resume") {
        setIsEditingResume(false);
        setResumeFile(null);
      }
    } catch (error) {
      console.error(`Field update failed for ${field}:`, error);
    }
  };

  // Separate cancel handlers for each field
  const handleTargetPositionCancel = () => {
    setIsEditingTargetPosition(false);
    setErrors((prev) => ({
      ...prev,
      targetPosition: undefined,
    }));
    setTempData((prev) => ({
      ...prev,
      targetPosition: user?.authorizedUser.targetPosition || "",
    }));
  };

  const handleYearsExperienceCancel = () => {
    setIsEditingYearsExperience(false);
    setErrors((prev) => ({
      ...prev,
      yearsExperience: undefined,
    }));
    setTempData((prev) => ({
      ...prev,
      yearsExperience: user?.authorizedUser.yearsExperience?.toString() || "",
    }));
  };

  const handleDegreeCancel = () => {
    setIsEditingDegree(false);
    setErrors((prev) => ({
      ...prev,
      degree: undefined,
    }));
    setTempData((prev) => ({
      ...prev,
      degree: user?.authorizedUser.degree || "",
    }));
  };

  const handleUniversityCancel = () => {
    setIsEditingUniversity(false);
    setErrors((prev) => ({
      ...prev,
      university: undefined,
    }));
    setTempData((prev) => ({
      ...prev,
      university: user?.authorizedUser.university || "",
    }));
  };

  const handleResumeCancel = () => {
    setIsEditingResume(false);
    setResumeFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= MAX_PROFILE_RESUME_SIZE_MB * 1024 * 1024) {
      setResumeFile(file);
    } else if (file) {
      alert(`File size must be less than ${MAX_PROFILE_RESUME_SIZE_MB}MB`);
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

  // Check if any field is being edited
  const hasAnyFieldEditing =
    isEditingTargetPosition ||
    isEditingYearsExperience ||
    isEditingDegree ||
    isEditingUniversity ||
    isEditingResume;

  // Get the currently editing field for the update button
  const getCurrentEditingField = (): EditableField | null => {
    if (isEditingTargetPosition) return "targetPosition";
    if (isEditingYearsExperience) return "yearsExperience";
    if (isEditingDegree) return "degree";
    if (isEditingUniversity) return "university";
    if (isEditingResume) return "resume";
    return null;
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
      <main className="max-w-md mx-auto">
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
    <main className="max-w-md mx-auto">
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

        <div className="flex justify-between items-center font-semibold gap-8 text-primary">
          <span>Interviews attempted:</span>
          <span>20</span>
        </div>

        <div className="divider" />

        {/* Profile Information */}
        <div className=" space-y-4 my-4">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center">
            <h3 className="card-title">Profile Information</h3>
            {hasAnyFieldEditing && (
              <button
                onClick={() =>
                  handleFieldSave(getCurrentEditingField() as EditableField)
                }
                className="btn btn-xs btn-success"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Update"}
              </button>
            )}
          </div>

          {/* Profile Data */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label flex justify-between items-center mb-2">
                <span className="label-text">Target Position</span>

                {isEditingTargetPosition ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTargetPositionCancel();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTargetPositionEdit();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <PencilIcon className="size-4" />
                  </button>
                )}
              </label>
              <select
                disabled={!isEditingTargetPosition}
                className={`select select-bordered w-full ${
                  errors.targetPosition ? "select-error" : ""
                }`}
                value={
                  isEditingTargetPosition
                    ? tempData.targetPosition
                    : user.authorizedUser.targetPosition || ""
                }
                onChange={(e) =>
                  handleInputChange("targetPosition", e.target.value)
                }
              >
                <option value="">Not specified</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
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
              <label className="label flex justify-between items-center mb-2">
                <span className="label-text">Years of Experience</span>

                {isEditingYearsExperience ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleYearsExperienceCancel();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleYearsExperienceEdit();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <PencilIcon className="size-4" />
                  </button>
                )}
              </label>
              <select
                disabled={!isEditingYearsExperience}
                className={`select select-bordered w-full ${
                  errors.yearsExperience ? "select-error" : ""
                }`}
                value={
                  isEditingYearsExperience
                    ? tempData.yearsExperience
                    : user.authorizedUser.yearsExperience?.toString() || ""
                }
                onChange={(e) =>
                  handleInputChange("yearsExperience", e.target.value)
                }
              >
                <option value="">Not specified</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp === "0"
                      ? "0 (Fresher)"
                      : `${exp} year${exp === "1" ? "" : "s"}`}
                  </option>
                ))}
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
              <label className="label flex justify-between items-center mb-2">
                <span className="label-text">Degree</span>

                {isEditingDegree ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDegreeCancel();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDegreeEdit();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <PencilIcon className="size-4" />
                  </button>
                )}
              </label>
              <select
                disabled={!isEditingDegree}
                className={`select select-bordered w-full ${
                  errors.degree ? "select-error" : ""
                }`}
                value={
                  isEditingDegree
                    ? tempData.degree
                    : user.authorizedUser.degree || ""
                }
                onChange={(e) => handleInputChange("degree", e.target.value)}
              >
                <option value="">Not specified</option>
                {DEGREE_OPTIONS.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
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
              <label className="label flex justify-between items-center mb-2">
                <span className="label-text">University</span>

                {isEditingUniversity ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUniversityCancel();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUniversityEdit();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <PencilIcon className="size-4" />
                  </button>
                )}
              </label>
              <select
                disabled={!isEditingUniversity}
                className={`select select-bordered w-full ${
                  errors.university ? "select-error" : ""
                }`}
                value={
                  isEditingUniversity
                    ? tempData.university
                    : user.authorizedUser.university || ""
                }
                onChange={(e) =>
                  handleInputChange("university", e.target.value)
                }
              >
                <option value="">Not specified</option>
                {UNIVERSITY_OPTIONS.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
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
              <label className="label flex justify-between items-center mb-2">
                <span className="label-text">
                  Resume (Optional, Max {MAX_PROFILE_RESUME_SIZE_MB}MB)
                </span>

                {isEditingResume ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleResumeCancel();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleResumeEdit();
                    }}
                    className="btn btn-xs btn-ghost"
                    type="button"
                  >
                    <PencilIcon className="size-4" />
                  </button>
                )}
              </label>
              <div className="w-full">
                <input
                  type="file"
                  disabled={!isEditingResume}
                  className="file-input w-full"
                  accept={RESUME_FILE_TYPES}
                  onChange={handleFileChange}
                />
              </div>
              {isEditingResume && resumeFile && (
                <label className="label">
                  <span className="label-text-alt text-success flex items-center gap-1">
                    <DocumentTextIcon className="size-3" />
                    File selected successfully
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions flex-col space-y-2 pb-6">
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
