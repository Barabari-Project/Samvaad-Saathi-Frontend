1. GET practice pacing levels
   Returns the status (locked / in_progress / complete) of all three speech pacing levels and the user's overall readiness score (0-100 %). Level 2 unlocks when Level 1 best score >= 90. Level 3 unlocks when Level 2 best score >= 90.

/api/pacing-practice/levels
GET

response:
{
"levels": [
{
"level": 1,
"name": "Level 1 - Sentence Control",
"description": "Master basic sentence delivery and pacing",
"status": "in_progress",
"bestScore": null,
"unlockThreshold": 90,
"unlockMessage": "Unlock level-2 at 90%"
},
{
"level": 2,
"name": "Level 2 - Paragraph Fluency",
"description": "Build confidence with longer responses",
"status": "locked",
"bestScore": null,
"unlockThreshold": 90,
"unlockMessage": "Unlock level-3 at 90%"
},
{
"level": 3,
"name": "Level 3 - Interview Mastery",
"description": "Handle complex questions with confidence",
"status": "locked",
"bestScore": null,
"unlockThreshold": 90,
"unlockMessage": "Complete all levels"
}
],
"overallReadiness": 0
}

2. Create a new pacing session
   Creates a new pacing practice session for the specified level and returns a randomly selected prompt for the user to read aloud. Levels 2 and 3 must be unlocked before they can be used (see /levels).

/api/pacing-practice/session
POST

payload:
{
"level": 1
}

response:
{
"sessionId": 11,
"level": 1,
"levelName": "Level 1 - Sentence Control",
"promptText": "I set measurable goals for myself each quarter and review my progress weekly to stay on track.",
"status": "pending",
"createdAt": "2026-03-12T13:43:53.491060Z"
}

3. Submit audio for a pacing practice session
   Accepts an audio recording (.mp3, .wav, .m4a, .flac up to 25 MB), transcribes it with Whisper, computes WPM and pause-distribution metrics, and returns a 0-100 score. Marks the session as completed.

/api/pacing-practice/session/{session_id}/submit
POST

payload:
session_id
file

response:
{
"sessionId": 0,
"level": 0,
"score": 0,
"scoreLabel": "string",
"speechSpeed": {
"value": 0,
"idealRange": "string",
"status": "string",
"feedback": "string"
},
"pauseDistribution": {
"score": 0,
"status": "string",
"feedback": "string",
"avgWordsPerPause": 0,
"totalPauses": 0,
"expectedPauses": 0,
"mandatoryPauseCount": 0,
"mandatoryPausesHit": 0,
"mandatoryPausesMissed": 0,
"commaPausesMissed": 0,
"mandatoryCovered": true,
"placementAccuracy": 0,
"mandatoryCompliance": 0,
"segmentAccuracy": 0,
"penaltyPct": 0
},
"fillerWords": {
"count": 0,
"totalWords": 0,
"fillerRatio": 0,
"status": "string",
"suggestion": "string",
"fillersFound": [
"string"
]
},
"levelUnlocked": 0
}

4. Get a specific pacing practice session
   Returns the full details and analysis result of a pacing practice session.

/api/pacing-practice/session/{session_id}
GET

response
{
"sessionId": 0,
"level": 0,
"levelName": "string",
"promptText": "string",
"status": "string",
"transcript": "string",
"score": 0,
"speechSpeed": {
"value": 0,
"idealRange": "string",
"status": "string",
"feedback": "string"
},
"pauseDistribution": {
"score": 0,
"status": "string",
"feedback": "string",
"avgWordsPerPause": 0,
"totalPauses": 0,
"expectedPauses": 0,
"mandatoryPauseCount": 0,
"mandatoryPausesHit": 0,
"mandatoryPausesMissed": 0,
"commaPausesMissed": 0,
"mandatoryCovered": true,
"placementAccuracy": 0,
"mandatoryCompliance": 0,
"segmentAccuracy": 0,
"penaltyPct": 0
},
"fillerWords": {
"count": 0,
"totalWords": 0,
"fillerRatio": 0,
"status": "string",
"suggestion": "string",
"fillersFound": [
"string"
]
},
"analysisResult": {
"additionalProp1": {}
},
"createdAt": "2026-03-12T13:47:26.625Z",
"updatedAt": "2026-03-12T13:47:26.625Z"
}
