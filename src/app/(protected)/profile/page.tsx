"use client";

import {
  AcademicCapIcon,
  ArrowLeftStartOnRectangleIcon,
  CheckIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experience, setExperience] = useState("3-5");
  const [degree, setDegree] = useState("B.Tech Computer Science");
  const [university, setUniversity] = useState("IIT Delhi");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({
    targetRole: "",
    experience: "",
    degree: "",
    university: "",
  });

  const handleEdit = () => {
    setTempData({
      targetRole,
      experience,
      degree,
      university,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setTargetRole(tempData.targetRole);
    setExperience(tempData.experience);
    setDegree(tempData.degree);
    setUniversity(tempData.university);
    setIsEditing(false);
    // Handle form submission here
    console.log({
      targetRole: tempData.targetRole,
      experience: tempData.experience,
      degree: tempData.degree,
      university: tempData.university,
      resumeFile: resumeFile?.name,
    });
  };

  const handleCancel = () => {
    setTempData({
      targetRole: "",
      experience: "",
      degree: "",
      university: "",
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main className="pt-20 pb-8 max-w-md mx-auto">
      {/* Card */}
      <section className="">
        {/* Avatar */}
        <div className="flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-full ring-4 ring-white/80 overflow-hidden shadow-md">
            <Image
              src="https://avatar.iran.liara.run/public"
              alt="User avatar"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <h2 className=" text-2xl font-semibold">Emma Phillips</h2>
          <p className="text-sm font-medium">React Developer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 px-6 py-4 border-y border-white/10 bg-white/5">
          <div>
            <p className="text-xs">Interviews attempted</p>
            <p className=" text-2xl font-semibold mt-1">20</p>
          </div>
          <div className="text-right">
            <p className="text-xs">Highest Score</p>
            <p className=" text-2xl font-semibold mt-1">85%</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="px-6 py-4 space-y-4">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              Profile Information
            </h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                title="Edit Profile"
              >
                <PencilIcon className="size-5" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-green-400 hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  title="Save Changes"
                >
                  <CheckIcon className="size-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target Role
                </label>
                <p className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {targetRole || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Experience
                </label>
                <p className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {experience ? `${experience} years` : "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Degree
                </label>
                <p className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {degree || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  University
                </label>
                <p className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {university || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Resume
                </label>
                <div className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  {resumeFile ? (
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="size-4 text-blue-400" />
                      <span className="text-sm">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No file uploaded</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Profile Data - Edit Mode */
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="targetRole"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Target Role
                </label>
                <input
                  type="text"
                  id="targetRole"
                  value={tempData.targetRole}
                  onChange={(e) =>
                    handleInputChange("targetRole", e.target.value)
                  }
                  placeholder="e.g., Software Engineer, Data Scientist"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Experience
                </label>
                <select
                  id="experience"
                  value={tempData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">
                    Select experience level
                  </option>
                  <option value="0-1" className="bg-gray-800">
                    0-1 years
                  </option>
                  <option value="1-3" className="bg-gray-800">
                    1-3 years
                  </option>
                  <option value="3-5" className="bg-gray-800">
                    3-5 years
                  </option>
                  <option value="5-10" className="bg-gray-800">
                    5-10 years
                  </option>
                  <option value="10+" className="bg-gray-800">
                    10+ years
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  value={tempData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  placeholder="e.g., B.Tech Computer Science, MBA"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="university"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  University
                </label>
                <select
                  id="university"
                  value={tempData.university}
                  onChange={(e) =>
                    handleInputChange("university", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">
                    Select University
                  </option>
                  <option value="IIT Delhi" className="bg-gray-800">
                    IIT Delhi
                  </option>
                  <option value="IIT Bombay" className="bg-gray-800">
                    IIT Bombay
                  </option>
                  <option value="IIT Madras" className="bg-gray-800">
                    IIT Madras
                  </option>
                  <option value="IIT Kanpur" className="bg-gray-800">
                    IIT Kanpur
                  </option>
                  <option value="IIT Kharagpur" className="bg-gray-800">
                    IIT Kharagpur
                  </option>
                  <option value="IIT Roorkee" className="bg-gray-800">
                    IIT Roorkee
                  </option>
                  <option value="IIT Guwahati" className="bg-gray-800">
                    IIT Guwahati
                  </option>
                  <option value="IIT Hyderabad" className="bg-gray-800">
                    IIT Hyderabad
                  </option>
                  <option value="IIT Indore" className="bg-gray-800">
                    IIT Indore
                  </option>
                  <option value="IIT Bhubaneswar" className="bg-gray-800">
                    IIT Bhubaneswar
                  </option>
                  <option value="IIT Gandhinagar" className="bg-gray-800">
                    IIT Gandhinagar
                  </option>
                  <option value="IIT Ropar" className="bg-gray-800">
                    IIT Ropar
                  </option>
                  <option value="IIT Patna" className="bg-gray-800">
                    IIT Patna
                  </option>
                  <option value="IIT Mandi" className="bg-gray-800">
                    IIT Mandi
                  </option>
                  <option value="IIT Jodhpur" className="bg-gray-800">
                    IIT Jodhpur
                  </option>
                  <option value="IIT Goa" className="bg-gray-800">
                    IIT Goa
                  </option>
                  <option value="IIT Jammu" className="bg-gray-800">
                    IIT Jammu
                  </option>
                  <option value="IIT Dharwad" className="bg-gray-800">
                    IIT Dharwad
                  </option>
                  <option value="IIT Tirupati" className="bg-gray-800">
                    IIT Tirupati
                  </option>
                  <option value="IIT Bhilai" className="bg-gray-800">
                    IIT Bhilai
                  </option>
                  <option value="IIT Palakkad" className="bg-gray-800">
                    IIT Palakkad
                  </option>
                  <option value="Other" className="bg-gray-800">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Resume (PDF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-colors duration-200 flex items-center gap-2"
                  >
                    <CloudArrowUpIcon className="size-5 text-blue-400" />
                    <span className="text-sm">
                      {resumeFile ? resumeFile.name : "Choose PDF file"}
                    </span>
                  </label>
                </div>
                {resumeFile && (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <DocumentTextIcon className="size-3" />
                    File selected successfully
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <ul className="divide-y divide-white/10">
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left  hover:bg-white/5">
              <DocumentTextIcon className="size-6 text-[#1F285B]" />{" "}
              <span>Resume</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left  hover:bg-white/5">
              <AcademicCapIcon className="size-6 text-[#1F285B]" />
              <span>University</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-6 py-4 text-left text-red-400 hover:bg-white/5">
              <ArrowLeftStartOnRectangleIcon className="size-6" />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </section>
    </main>
  );
}
