// utils/posthog.ts
"use client";

import posthog from "posthog-js";
import { EVENTS } from "./events";

// Type definitions
interface EventProperties {
  [key: string]: unknown;
}

interface UserProperties {
  [key: string]: unknown;
}

interface ErrorProperties {
  [key: string]: unknown;
}

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  properties: EventProperties = {}
): void => {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
};

/**
 * Track page views manually
 */
export const trackPageView = (path: string): void => {
  if (typeof window !== "undefined") {
    posthog.capture("$pageview", { $current_url: path });
  }
};

/**
 * Identify users
 */
export const identifyUser = (
  userId: string,
  properties: UserProperties = {}
): void => {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
};

/**
 * Track errors manually
 */
export const trackError = (
  error: Error,
  additionalProperties: ErrorProperties = {}
): void => {
  if (typeof window !== "undefined") {
    posthog.captureException(error, additionalProperties);
  }
};

/**
 * Track sign up events (useful for funnels)
 */
export const trackSignUp = (method: string = "email"): void => {
  trackEvent("user_signed_up", { method });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  location: string
): void => {
  trackEvent("button_clicked", {
    button_name: buttonName,
    location,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: UserProperties): void => {
  if (typeof window !== "undefined") {
    posthog.capture("$set", { $set: properties });
  }
};

/**
 * Reset user identification
 */
export const resetUser = (): void => {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
};

// Authentication tracking functions
export const trackLoginAttempt = (
  loginMethod: string,
  screenSource: string
): void => {
  trackEvent(EVENTS.LOGIN_ATTEMPT, {
    login_method: loginMethod,
    screen_source: screenSource,
  });
};

export const trackLoginSuccess = (loginMethod: string): void => {
  trackEvent(EVENTS.LOGIN_SUCCESS, {
    login_method: loginMethod,
  });
};

export const trackLoginFailure = (errorMessage?: string): void => {
  trackEvent(EVENTS.LOGIN_FAILURE, {
    error_message: errorMessage,
  });
};

export const trackLogoutButtonClick = (): void => {
  trackEvent(EVENTS.LOGOUT_BUTTON_CLICK);
};

export const trackCreateAccountStart = (signupMethod: string): void => {
  trackEvent(EVENTS.CREATE_ACCOUNT_START, {
    signup_method: signupMethod,
  });
};

export const trackCreateAccountSuccess = (signupMethod: string): void => {
  trackEvent(EVENTS.CREATE_ACCOUNT_SUCCESS, {
    signup_method: signupMethod,
  });
};

export const trackLinkClick = (linkName: string): void => {
  trackEvent(EVENTS.LINK_CLICK, {
    link_name: linkName,
  });
};

// Onboarding tracking functions
export const trackFieldInteraction = (
  fieldName: string,
  interactionType: string
): void => {
  trackEvent(EVENTS.FIELD_INTERACTION, {
    field_name: fieldName,
    interaction_type: interactionType,
  });
};

export const trackNextButtonClick = (): void => {
  trackEvent(EVENTS.NEXT_BUTTON_CLICK);
};

export const trackOnboardingEducationComplete = (
  degreeProvided: boolean,
  universityProvided: boolean,
  timeOnScreen?: number
): void => {
  trackEvent(EVENTS.ONBOARDING_EDUCATION_COMPLETE, {
    degree_provided: degreeProvided,
    university_provided: universityProvided,
    time_on_screen: timeOnScreen,
  });
};

// Onboarding setup tracking functions
export const trackTargetRoleSelected = (selectedRole: string): void => {
  trackEvent(EVENTS.TARGET_ROLE_SELECTED, {
    selected_role: selectedRole,
  });
};

export const trackExperienceSelected = (selectedExperience: string): void => {
  trackEvent(EVENTS.EXPERIENCE_SELECTED, {
    selected_experience: selectedExperience,
  });
};

export const trackResumeUploadStart = (): void => {
  trackEvent(EVENTS.RESUME_UPLOAD_START);
};

export const trackResumeUploadSuccess = (
  fileSize: number,
  fileType: string
): void => {
  trackEvent(EVENTS.RESUME_UPLOAD_SUCCESS, {
    file_size: fileSize,
    file_type: fileType,
  });
};

export const trackCompanyProvided = (): void => {
  trackEvent(EVENTS.COMPANY_PROVIDED);
};

export const trackSubmitButtonClick = (): void => {
  trackEvent(EVENTS.SUBMIT_BUTTON_CLICK);
};

export const trackOnboardingSetupComplete = (
  targetRole: string,
  experience: string,
  resumeUploaded: boolean
): void => {
  trackEvent(EVENTS.ONBOARDING_SETUP_COMPLETE, {
    target_role: targetRole,
    experience,
    resume_uploaded: resumeUploaded,
  });
};

// Navigation tracking functions
export const trackGetStartedButtonClick = (): void => {
  trackEvent(EVENTS.GET_STARTED_BUTTON_CLICK);
};

export const trackBottomNavClick = (destination: string): void => {
  trackEvent(EVENTS.BOTTOM_NAV_CLICK, {
    destination,
  });
};

// Interview setup tracking functions
export const trackRoleSelected = (selectedRole: string): void => {
  trackEvent(EVENTS.ROLE_SELECTED, {
    selected_role: selectedRole,
  });
};

export const trackDifficultySelected = (difficultyLevel: string): void => {
  trackEvent(EVENTS.DIFFICULTY_SELECTED, {
    difficulty_level: difficultyLevel,
  });
};

export const trackResumeToggleClick = (toggleState: boolean): void => {
  trackEvent(EVENTS.RESUME_TOGGLE_CLICK, {
    toggle_state: toggleState ? "on" : "off",
  });
};

export const trackStartInterviewButtonClick = (
  selectedRole: string,
  difficultyLevel: string,
  useResume: boolean
): void => {
  trackEvent(EVENTS.START_INTERVIEW_BUTTON_CLICK, {
    selected_role: selectedRole,
    difficulty_level: difficultyLevel,
    use_resume: useResume,
  });
};

// Interview tracking functions
export const trackInterviewQuestionView = (
  questionId: string,
  questionNumber: number,
  questionType: string,
  interviewSessionId: string
): void => {
  trackEvent(EVENTS.INTERVIEW_QUESTION_VIEW, {
    question_id: questionId,
    question_number: questionNumber,
    question_type: questionType,
    interview_session_id: interviewSessionId,
  });
};

export const trackAudioPlayClick = (): void => {
  trackEvent(EVENTS.AUDIO_PLAY_CLICK);
};

export const trackAnswerStartClick = (): void => {
  trackEvent(EVENTS.ANSWER_START_CLICK);
};

export const trackAnswerRecorded = (timeToAnswer: number): void => {
  trackEvent(EVENTS.ANSWER_RECORDED, {
    time_to_answer: timeToAnswer,
  });
};

export const trackRedoButtonClick = (
  questionId: string,
  attemptNumber: number
): void => {
  trackEvent(EVENTS.REDO_BUTTON_CLICK, {
    question_id: questionId,
    attempt_number: attemptNumber,
  });
};

export const trackSkipQuestionClick = (): void => {
  trackEvent(EVENTS.SKIP_QUESTION_CLICK);
};

export const trackSubmitInterviewClick = (): void => {
  trackEvent(EVENTS.SUBMIT_INTERVIEW_CLICK);
};

// Interview completion tracking functions
export const trackScreenView = (
  screenName: string,
  interviewSessionId?: string
): void => {
  trackEvent(EVENTS.SCREEN_VIEW, {
    screen_name: screenName,
    interview_session_id: interviewSessionId,
  });
};

export const trackReportGenerationStart = (): void => {
  trackEvent(EVENTS.REPORT_GENERATION_START);
};

export const trackViewReportButtonClick = (timeToReportView?: number): void => {
  trackEvent(EVENTS.VIEW_REPORT_BUTTON_CLICK, {
    time_to_report_view: timeToReportView,
  });
};

export const trackReportGenerationError = (errorDetails: string): void => {
  trackEvent(EVENTS.REPORT_GENERATION_ERROR, {
    error_details: errorDetails,
  });
};
