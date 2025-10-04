"use client";
import ConcentricRadialProgress from "@/components/ConcentricRadialProgress";
import { useAuth } from "@/components/providers/auth-provider";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { trackGetStartedButtonClick } from "@/lib/posthog/tracking.utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InterviewItem {
  interviewId: number;
  track: string;
  difficulty: string;
  status: string;
  createdAt: string;
  knowledgePercentage: number;
  speechFluencyPercentage: number;
  summaryReportAvailable: boolean;
  topActionItems: string[];
  attemptsCount: number;
}

interface InterviewsResponse {
  items: InterviewItem[];
}

interface ResumeInterviewQuestion {
  interviewQuestionId: number;
  text: string;
  topic: string;
  category: string;
  status: string;
  resumeUsed: boolean;
}

interface ResumeInterviewResponse {
  interviewId: number;
  track: string;
  difficulty: string;
  questions: ResumeInterviewQuestion[];
  totalQuestions: number;
  attemptedQuestions: number;
  remainingQuestions: number;
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const userName = user?.authorizedUser?.name || "User";
  const avatarUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
    userName
  )}`;

  // Create API client for interviews
  const apiClient = createApiClient(APIService.INTERVIEWS);

  // Embla Carousel setup
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  // Fetch interviews with summary data
  const {
    data: interviewsData,
    isLoading: interviewsLoading,
    error: interviewsError,
  } = apiClient.useQuery<InterviewsResponse>({
    key: [ENDPOINTS.INTERVIEWS.WITH_SUMMARY, "interview-list"],
    url: ENDPOINTS.INTERVIEWS.WITH_SUMMARY,
    enabled: !loading, // Only fetch when auth is loaded
  });

  // Mutation for resume interview
  const { loading: isResumingInterview, mutateAsync: resumeInterviewMutation } =
    apiClient.useMutation<ResumeInterviewResponse, { interviewId: number }>({
      url: ENDPOINTS.INTERVIEWS.RESUME_INTERVIEW,
      method: "post",
      successMessage: "Interview resumed successfully!",
      errorMessage: "Failed to resume interview. Please try again.",
    });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMM, YYYY");
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "badge-success";
      case "medium":
        return "badge-warning";
      case "hard":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  // Handle continue interview
  const handleContinueInterview = async (interviewId: number) => {
    try {
      const response = await resumeInterviewMutation({ interviewId });

      // Navigate to interview page with resumed questions
      const resumeParams = new URLSearchParams({
        interviewId: response.interviewId.toString(),
        role: response.track,
        useResume: "true",
        selectedQuestions: JSON.stringify(response.questions),
        resumed: "true",
      });

      router.push(`/interview?${resumeParams.toString()}`);
    } catch (error) {
      console.error("Failed to resume interview:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-4 relative">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="flex items-center justify-center flex-col gap-20">
          <div className="w-72 h-72 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="absolute inset-x-0 bottom-20 px-6">
          <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-6">
      <div className="flex justify-between items-center relative">
        <h2 className="text-2xl font-bold">Hi {userName},</h2>

        <Image
          width={50}
          height={50}
          src={avatarUrl}
          alt="user avatar"
          unoptimized
          className="rounded-full object-cover"
        />
      </div>

      <div className="my-6">
        <h2 className="text-2xl font-bold">Recent Interviews</h2>

        {interviewsLoading ? (
          // Skeleton loader
          <div className="space-y-4 mt-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ) : interviewsError ||
          !interviewsData?.items ||
          interviewsData.items.length === 0 ? (
          // Fallback illustration and message
          <div className="text-center py-8">
            <Image
              src="/home.png"
              alt="No interviews illustration"
              height={200}
              width={200}
              className="mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-500 mb-4">
              {interviewsError
                ? "Unable to load interviews. Please try again later."
                : "Your recent interviews will be shown here. Complete your first interview to see your progress and history."}
            </p>
          </div>
        ) : (
          // Carousel with interview data
          <div className="space-y-4">
            {/* Embla Carousel */}
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex p-4">
                {interviewsData.items.map((interview) => (
                  <div
                    key={interview.interviewId}
                    className="embla__slide flex-[0_0_100%] min-w-0"
                  >
                    <div className="card bg-base-100 w-full shadow-lg ">
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="card-title text-lg">
                              {interview.track}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(interview.createdAt)} • Attempt{" "}
                              {interview.attemptsCount ?? 0}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div
                              className={`badge badge-xs ${getDifficultyColor(
                                interview.difficulty
                              )}`}
                            >
                              {interview.difficulty?.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Show completion message for active interviews, otherwise show progress data */}
                        {interview.status.toLowerCase() === "active" ? (
                          <div className="text-center py-8">
                            <div className="mb-4">
                              <div className="size-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ClockIcon className="size-6 text-yellow-600" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                Complete Your Interview
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Finish your interview to see detailed
                                performance insights and actionable
                                recommendations.
                              </p>
                              <p className="text-xs text-blue-600 font-medium italic">
                                Every expert was once a beginner. Every pro was
                                once an amateur. Keep going! 💪
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Radial Progress Chart */}
                            <div className="flex items-center gap-4 mb-4">
                              <ConcentricRadialProgress
                                size={120}
                                rings={[
                                  {
                                    value: interview.knowledgePercentage ?? 0,
                                    color: "#3b82f6",
                                    ariaLabel: "Technical Knowledge progress",
                                    trackColor: "#e5e7eb",
                                    thickness: 10,
                                  },
                                  {
                                    value:
                                      interview.speechFluencyPercentage ?? 0,
                                    color: "#6b7280",
                                    ariaLabel: "Speech Fluency progress",
                                    trackColor: "#e5e7eb",
                                    thickness: 8,
                                  },
                                ]}
                                centerRender={(rings) => (
                                  <div className="text-center">
                                    <div className="text-xs text-blue-500 font-bold">
                                      {rings[0]?.value
                                        ? `${Math.round(rings[0].value)}%`
                                        : "0%"}
                                    </div>
                                    <div className="text-xs text-gray-500 font-bold">
                                      {rings[1]?.value
                                        ? `${Math.round(rings[1].value)}%`
                                        : "0%"}
                                    </div>
                                  </div>
                                )}
                              />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-2 font-semibold">
                                  Performance Score
                                </p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    <span className="text-sm text-gray-700">
                                      Technical Knowledge
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                    <span className="text-sm text-gray-700">
                                      Speech Fluency
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Actionable Insights
                              </h4>
                              {interview.topActionItems.map((item) => (
                                <div
                                  key={item}
                                  className="flex items-start gap-2"
                                >
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="size-1.5 bg-primary rounded-full"></div>
                                  </div>
                                  <p className="text-xs font-semibold text-gray-700">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Action buttons */}
                        <div className="card-actions justify-end">
                          {interview.status.toLowerCase() === "completed" ? (
                            <>
                              {interview.summaryReportAvailable ? (
                                <Link
                                  href={`/report-summary?interviewId=${interview.interviewId}`}
                                  className="btn btn-outline btn-sm"
                                >
                                  View Report
                                </Link>
                              ) : (
                                <button
                                  className="btn btn-outline btn-sm"
                                  disabled
                                >
                                  Report Pending
                                </button>
                              )}
                              <Link
                                href={`/reattempt-interview?interviewId=${interview.interviewId}&role=${interview.track}&attemptsCount=${interview.attemptsCount}`}
                                className="btn btn-neutral btn-sm"
                              >
                                Reattempt
                              </Link>
                            </>
                          ) : interview.status.toLowerCase() === "active" ? (
                            <button
                              className="btn btn-primary btn-sm disabled:opacity-50"
                              onClick={() =>
                                handleContinueInterview(interview.interviewId)
                              }
                              disabled={isResumingInterview}
                            >
                              {isResumingInterview ? (
                                <>
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Resuming...
                                </>
                              ) : (
                                "Continue Interview"
                              )}
                            </button>
                          ) : (
                            <Link href="interview-start">
                              <button className="btn btn-primary btn-sm">
                                Start Interview
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Link href="interview-start">
        <button
          className="btn btn-neutral btn-block btn-lg rounded-lg"
          onClick={trackGetStartedButtonClick}
        >
          Get Started
        </button>
      </Link>
    </div>
  );
}
