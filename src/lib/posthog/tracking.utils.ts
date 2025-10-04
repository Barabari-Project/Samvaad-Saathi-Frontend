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
 *
 * @param eventName - The name of the event to track
 * @param properties - Additional properties to include with the event
 *
 * @example
 * ```typescript
 * trackEvent("button_clicked", {
 *   button_name: "subscribe",
 *   location: "header"
 * });
 * ```
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
 *
 * @param path - The URL path of the page being viewed
 *
 * @example
 * ```typescript
 * trackPageView("/dashboard");
 * trackPageView("/settings/profile");
 * ```
 */
export const trackPageView = (path: string): void => {
  if (typeof window !== "undefined") {
    posthog.capture("$pageview", { $current_url: path });
  }
};

/**
 * Identify users
 *
 * @param userId - The user's ID
 * @param properties - The properties to identify the user with
 *
 * @example
 * ```typescript
 * identifyUser("user123", {
 *   email: "user@example.com",
 *   name: "John Doe",
 *   plan: "premium"
 * });
 * ```
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
 *
 * @param error - The error object to track
 * @param additionalProperties - Additional context properties for the error
 *
 * @example
 * ```typescript
 * try {
 *   // some operation
 * } catch (error) {
 *   trackError(error as Error, {
 *     operation: "file_upload",
 *     file_size: "2MB"
 *   });
 * }
 * ```
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
 *
 * @param method - The signup method used (default: "email")
 *
 * @example
 * ```typescript
 * trackSignUp("google");
 * trackSignUp("apple");
 * trackSignUp("email");
 * ```
 */
export const trackSignUp = (method: string = "email"): void => {
  trackEvent("user_signed_up", { method });
};

/**
 * Track button clicks
 *
 * @param buttonName - The name/identifier of the button
 * @param location - The location/context where the button was clicked
 *
 * @example
 * ```typescript
 * trackButtonClick("subscribe", "header");
 * trackButtonClick("download", "landing_page");
 * trackButtonClick("contact_us", "footer");
 * ```
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
 *
 * @param properties - The properties to set for the current user
 *
 * @example
 * ```typescript
 * setUserProperties({
 *   plan: "premium",
 *   feature_flags: ["beta_access", "dark_mode"],
 *   last_login: new Date().toISOString()
 * });
 * ```
 */
export const setUserProperties = (properties: UserProperties): void => {
  if (typeof window !== "undefined") {
    posthog.capture("$set", { $set: properties });
  }
};

/**
 * Reset user identification
 *
 * @example
 * ```typescript
 * // Call when user logs out
 * resetUser();
 * ```
 */
export const resetUser = (): void => {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
};

// Authentication tracking functions
/**
 * Track login attempts
 *
 * @param loginMethod - The method used for login ("Google", "Apple", "Email")
 * @param screenSource - The screen where login was initiated ("login", "create_account")
 *
 * @example
 * ```typescript
 * trackLoginAttempt("Google", "create_account");
 * trackLoginAttempt("Email", "login");
 * trackLoginAttempt("Apple", "create_account");
 * ```
 */
export const trackLoginAttempt = (
  loginMethod: string,
  screenSource: string
): void => {
  trackEvent(EVENTS.LOGIN_ATTEMPT, {
    login_method: loginMethod,
    screen_source: screenSource,
  });
};

/**
 * Track successful login
 *
 * @param loginMethod - The method used for successful login ("Google", "Apple", "Email")
 *
 * @example
 * ```typescript
 * trackLoginSuccess("Google");
 * trackLoginSuccess("Email");
 * trackLoginSuccess("Apple");
 * ```
 */
export const trackLoginSuccess = (loginMethod: string): void => {
  trackEvent(EVENTS.LOGIN_SUCCESS, {
    login_method: loginMethod,
  });
};

/**
 * Track login failures
 *
 * @param errorMessage - Optional error message describing the failure
 *
 * @example
 * ```typescript
 * trackLoginFailure("invalid_credentials");
 * trackLoginFailure("google_login_error");
 * trackLoginFailure(); // No specific error message
 * ```
 */
export const trackLoginFailure = (errorMessage?: string): void => {
  trackEvent(EVENTS.LOGIN_FAILURE, {
    error_message: errorMessage,
  });
};

/**
 * Track logout button clicks
 *
 * @example
 * ```typescript
 * trackLogoutButtonClick();
 * ```
 */
export const trackLogoutButtonClick = (): void => {
  trackEvent(EVENTS.LOGOUT_BUTTON_CLICK);
};

/**
 * Track account creation start
 *
 * @param signupMethod - The method used for signup ("Google", "Apple", "Email")
 *
 * @example
 * ```typescript
 * trackCreateAccountStart("Google");
 * trackCreateAccountStart("Email");
 * ```
 */
export const trackCreateAccountStart = (signupMethod: string): void => {
  trackEvent(EVENTS.CREATE_ACCOUNT_START, {
    signup_method: signupMethod,
  });
};

/**
 * Track successful account creation
 *
 * @param signupMethod - The method used for successful signup ("Google", "Apple", "Email")
 *
 * @example
 * ```typescript
 * trackCreateAccountSuccess("Google");
 * trackCreateAccountSuccess("Email");
 * ```
 */
export const trackCreateAccountSuccess = (signupMethod: string): void => {
  trackEvent(EVENTS.CREATE_ACCOUNT_SUCCESS, {
    signup_method: signupMethod,
  });
};

/**
 * Track link clicks
 *
 * @param linkName - The name/identifier of the link clicked
 *
 * @example
 * ```typescript
 * trackLinkClick("Create an account");
 * trackLinkClick("Login");
 * trackLinkClick("Forgot password");
 * ```
 */
export const trackLinkClick = (linkName: string): void => {
  trackEvent(EVENTS.LINK_CLICK, {
    link_name: linkName,
  });
};

// Onboarding tracking functions
/**
 * Track field interactions during onboarding
 *
 * @param fieldName - The name of the field being interacted with ("degree", "university")
 * @param interactionType - The type of interaction ("select", "type")
 *
 * @example
 * ```typescript
 * trackFieldInteraction("degree", "select");
 * trackFieldInteraction("university", "type");
 * ```
 */
export const trackFieldInteraction = (
  fieldName: string,
  interactionType: string
): void => {
  trackEvent(EVENTS.FIELD_INTERACTION, {
    field_name: fieldName,
    interaction_type: interactionType,
  });
};

/**
 * Track next button clicks during onboarding
 *
 * @example
 * ```typescript
 * trackNextButtonClick();
 * ```
 */
export const trackNextButtonClick = (): void => {
  trackEvent(EVENTS.NEXT_BUTTON_CLICK);
};

/**
 * Track completion of onboarding education step
 *
 * @param degreeProvided - Whether degree information was provided
 * @param universityProvided - Whether university information was provided
 * @param timeOnScreen - Optional time spent on the screen in seconds
 *
 * @example
 * ```typescript
 * trackOnboardingEducationComplete(true, true, 45);
 * trackOnboardingEducationComplete(false, true);
 * ```
 */
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
/**
 * Track target role selection during onboarding
 *
 * @param selectedRole - The selected target role
 *
 * @example
 * ```typescript
 * trackTargetRoleSelected("Software Engineer");
 * trackTargetRoleSelected("Product Manager");
 * ```
 */
export const trackTargetRoleSelected = (selectedRole: string): void => {
  trackEvent(EVENTS.TARGET_ROLE_SELECTED, {
    selected_role: selectedRole,
  });
};

/**
 * Track experience level selection during onboarding
 *
 * @param selectedExperience - The selected experience level
 *
 * @example
 * ```typescript
 * trackExperienceSelected("0-2 years");
 * trackExperienceSelected("3-5 years");
 * trackExperienceSelected("6+ years");
 * ```
 */
export const trackExperienceSelected = (selectedExperience: string): void => {
  trackEvent(EVENTS.EXPERIENCE_SELECTED, {
    selected_experience: selectedExperience,
  });
};

/**
 * Track resume upload start
 *
 * @example
 * ```typescript
 * trackResumeUploadStart();
 * ```
 */
export const trackResumeUploadStart = (): void => {
  trackEvent(EVENTS.RESUME_UPLOAD_START);
};

/**
 * Track successful resume upload
 *
 * @param fileSize - The size of the uploaded file in bytes
 * @param fileType - The type of the uploaded file
 *
 * @example
 * ```typescript
 * trackResumeUploadSuccess(1024000, "application/pdf");
 * trackResumeUploadSuccess(512000, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
 * ```
 */
export const trackResumeUploadSuccess = (
  fileSize: number,
  fileType: string
): void => {
  trackEvent(EVENTS.RESUME_UPLOAD_SUCCESS, {
    file_size: fileSize,
    file_type: fileType,
  });
};

/**
 * Track when company information is provided
 *
 * @example
 * ```typescript
 * trackCompanyProvided();
 * ```
 */
export const trackCompanyProvided = (): void => {
  trackEvent(EVENTS.COMPANY_PROVIDED);
};

/**
 * Track submit button clicks during onboarding
 *
 * @example
 * ```typescript
 * trackSubmitButtonClick();
 * ```
 */
export const trackSubmitButtonClick = (): void => {
  trackEvent(EVENTS.SUBMIT_BUTTON_CLICK);
};

/**
 * Track completion of onboarding setup
 *
 * @param targetRole - The selected target role
 * @param experience - The selected experience level
 * @param resumeUploaded - Whether a resume was uploaded
 *
 * @example
 * ```typescript
 * trackOnboardingSetupComplete("Software Engineer", "3-5 years", true);
 * trackOnboardingSetupComplete("Product Manager", "0-2 years", false);
 * ```
 */
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
/**
 * Track get started button clicks
 *
 * @example
 * ```typescript
 * trackGetStartedButtonClick();
 * ```
 */
export const trackGetStartedButtonClick = (): void => {
  trackEvent(EVENTS.GET_STARTED_BUTTON_CLICK);
};

/**
 * Track bottom navigation clicks
 *
 * @param destination - The destination screen ("dashboard", "home", "profile")
 *
 * @example
 * ```typescript
 * trackBottomNavClick("dashboard");
 * trackBottomNavClick("home");
 * trackBottomNavClick("profile");
 * ```
 */
export const trackBottomNavClick = (destination: string): void => {
  trackEvent(EVENTS.BOTTOM_NAV_CLICK, {
    destination,
  });
};

// Interview setup tracking functions
/**
 * Track role selection for interview
 *
 * @param selectedRole - The selected role for the interview
 *
 * @example
 * ```typescript
 * trackRoleSelected("Software Engineer");
 * trackRoleSelected("Data Scientist");
 * ```
 */
export const trackRoleSelected = (selectedRole: string): void => {
  trackEvent(EVENTS.ROLE_SELECTED, {
    selected_role: selectedRole,
  });
};

/**
 * Track difficulty level selection for interview
 *
 * @param difficultyLevel - The selected difficulty level ("easy", "medium", "hard")
 *
 * @example
 * ```typescript
 * trackDifficultySelected("easy");
 * trackDifficultySelected("medium");
 * trackDifficultySelected("hard");
 * ```
 */
export const trackDifficultySelected = (difficultyLevel: string): void => {
  trackEvent(EVENTS.DIFFICULTY_SELECTED, {
    difficulty_level: difficultyLevel,
  });
};

/**
 * Track resume toggle clicks for interview
 *
 * @param toggleState - Whether the resume toggle is on or off
 *
 * @example
 * ```typescript
 * trackResumeToggleClick(true);  // Resume enabled
 * trackResumeToggleClick(false); // Resume disabled
 * ```
 */
export const trackResumeToggleClick = (toggleState: boolean): void => {
  trackEvent(EVENTS.RESUME_TOGGLE_CLICK, {
    toggle_state: toggleState ? "on" : "off",
  });
};

/**
 * Track start interview button clicks
 *
 * @param selectedRole - The selected role for the interview
 * @param difficultyLevel - The selected difficulty level
 * @param useResume - Whether resume is being used
 *
 * @example
 * ```typescript
 * trackStartInterviewButtonClick("Software Engineer", "medium", true);
 * trackStartInterviewButtonClick("Product Manager", "easy", false);
 * ```
 */
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
/**
 * Track interview question views
 *
 * @param questionId - Unique identifier for the question
 * @param questionNumber - The sequential number of the question (1, 2, 3, etc.)
 * @param questionType - The type of question ("technical", "behavioral")
 * @param interviewSessionId - Unique identifier for the interview session
 *
 * @example
 * ```typescript
 * trackInterviewQuestionView("q_001", 1, "technical", "session_123");
 * trackInterviewQuestionView("q_002", 2, "behavioral", "session_123");
 * ```
 */
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

/**
 * Track audio play clicks for hearing questions
 *
 * @example
 * ```typescript
 * trackAudioPlayClick();
 * ```
 */
export const trackAudioPlayClick = (): void => {
  trackEvent(EVENTS.AUDIO_PLAY_CLICK);
};

/**
 * Track answer start clicks
 *
 * @example
 * ```typescript
 * trackAnswerStartClick();
 * ```
 */
export const trackAnswerStartClick = (): void => {
  trackEvent(EVENTS.ANSWER_START_CLICK);
};

/**
 * Track when an answer is recorded
 *
 * @param timeToAnswer - Time taken to answer from question view to completion (in seconds)
 *
 * @example
 * ```typescript
 * trackAnswerRecorded(45); // 45 seconds to answer
 * trackAnswerRecorded(120); // 2 minutes to answer
 * ```
 */
export const trackAnswerRecorded = (timeToAnswer: number): void => {
  trackEvent(EVENTS.ANSWER_RECORDED, {
    time_to_answer: timeToAnswer,
  });
};

/**
 * Track redo button clicks
 *
 * @param questionId - The ID of the question being redone
 * @param attemptNumber - The attempt number (1, 2, 3, etc.)
 *
 * @example
 * ```typescript
 * trackRedoButtonClick("q_001", 1); // First redo attempt
 * trackRedoButtonClick("q_001", 2); // Second redo attempt
 * ```
 */
export const trackRedoButtonClick = (
  questionId: string,
  attemptNumber: number
): void => {
  trackEvent(EVENTS.REDO_BUTTON_CLICK, {
    question_id: questionId,
    attempt_number: attemptNumber,
  });
};

/**
 * Track skip question clicks
 *
 * @example
 * ```typescript
 * trackSkipQuestionClick();
 * ```
 */
export const trackSkipQuestionClick = (): void => {
  trackEvent(EVENTS.SKIP_QUESTION_CLICK);
};

/**
 * Track submit interview clicks (on final question)
 *
 * @example
 * ```typescript
 * trackSubmitInterviewClick();
 * ```
 */
export const trackSubmitInterviewClick = (): void => {
  trackEvent(EVENTS.SUBMIT_INTERVIEW_CLICK);
};

// Interview completion tracking functions
/**
 * Track screen views
 *
 * @param screenName - The name of the screen being viewed
 * @param interviewSessionId - Optional interview session ID for context
 *
 * @example
 * ```typescript
 * trackScreenView("congratulations_page", "session_123");
 * trackScreenView("overall_report_page", "session_123");
 * trackScreenView("dashboard");
 * ```
 */
export const trackScreenView = (
  screenName: string,
  interviewSessionId?: string
): void => {
  trackEvent(EVENTS.SCREEN_VIEW, {
    screen_name: screenName,
    interview_session_id: interviewSessionId,
  });
};

/**
 * Track report generation start
 *
 * @example
 * ```typescript
 * trackReportGenerationStart();
 * ```
 */
export const trackReportGenerationStart = (): void => {
  trackEvent(EVENTS.REPORT_GENERATION_START);
};

/**
 * Track view report button clicks
 *
 * @param timeToReportView - Optional time from interview submit to report view (in seconds)
 *
 * @example
 * ```typescript
 * trackViewReportButtonClick(30); // 30 seconds after submission
 * trackViewReportButtonClick(); // No timing data
 * ```
 */
export const trackViewReportButtonClick = (timeToReportView?: number): void => {
  trackEvent(EVENTS.VIEW_REPORT_BUTTON_CLICK, {
    time_to_report_view: timeToReportView,
  });
};

/**
 * Track report generation errors
 *
 * @param errorDetails - Details about the error that occurred
 *
 * @example
 * ```typescript
 * trackReportGenerationError("API timeout");
 * trackReportGenerationError("Insufficient data for analysis");
 * ```
 */
export const trackReportGenerationError = (errorDetails: string): void => {
  trackEvent(EVENTS.REPORT_GENERATION_ERROR, {
    error_details: errorDetails,
  });
};
