// Event names for posthog should be added here and exported from here
export const EVENTS = {
  // Authentication events
  LOGIN_ATTEMPT: "login_attempt",
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  LOGOUT_BUTTON_CLICK: "logout_button_click",

  // Navigation events
  GET_STARTED_BUTTON_CLICK: "get_started_button_click",
  BOTTOM_NAV_CLICK: "bottom_nav_click",

  // Interview setup events
  ROLE_SELECTED: "role_selected",
  DIFFICULTY_SELECTED: "difficulty_selected",
  RESUME_TOGGLE_CLICK: "resume_toggle_click",
  START_INTERVIEW_BUTTON_CLICK: "start_interview_button_click",

  // Interview events
  INTERVIEW_QUESTION_VIEW: "interview_question_view",
  ANSWER_START_CLICK: "answer_start_click",
  ANSWER_RECORDED: "answer_recorded",
  REDO_BUTTON_CLICK: "redo_button_click",
  SKIP_QUESTION_CLICK: "skip_question_click",
  SUBMIT_INTERVIEW_CLICK: "submit_interview_click",

  // Interview completion events
  SCREEN_VIEW: "screen_view",
  REPORT_GENERATION_START: "report_generation_start",
  REPORT_GENERATION_ERROR: "report_generation_error",

  // Profile events
  PROFILE_EDIT_BUTTON_CLICK: "profile_edit_button_click",
  PROFILE_FIELD_VALUE_CHANGED: "profile_field_value_changed",
  PROFILE_UPDATE_BUTTON_CLICK: "profile_update_button_click",
  PROFILE_HELP_BUTTON_CLICK: "profile_help_button_click",
  PROFILE_SUPPORT_BUTTON_CLICK: "profile_support_button_click",

  // Error events
  API_ERROR: "api_error",
} as const;

export const SCREEN_VIEW = {
  SIGNUP_PAGE: "signup_page",
  HOME_PAGE: "home_page",
  ONBOARDING_SETUP_PAGE: "onboarding_setup_page",
  PROFILE_PAGE: "profile_page",
  INTERVIEW_PAGE: "interview_page",
  INTERVIEW_COMPLETED_PAGE: "interview_completed_page",
  CONGRATULATIONS_PAGE: "congratulations_page",
  OVERALL_REPORT_PAGE: "overall_report_page",
  DASHBOARD: "dashboard",
  HISTORY_PAGE: "history_page",
  PRACTICE_LIST_PAGE: "practice_list_page",
  ONBOARDING_PAGE: "onboarding_page",
  INTERVIEW_SETUP_PAGE: "interview_setup_page",
  PRONUNCIATION_PRACTICE_START_PAGE: "pronunciation_practice_start_page",
  PRONUNCIATION_PRACTICE_PAGE: "pronunciation_practice_page",
  STRUCTURE_YOUR_ANSWER_INTERVIEW_PAGE: "structure_your_answer_interview_page",
  STRUCTURE_YOUR_ANSWER_PAGE: "structure_your_answer_page",
} as const;
