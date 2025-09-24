# Samvaad Saathi (Frontend)

A mobile-first web app built with **Next.js, React, and TailwindCSS**.  
This app helps students prepare for interviews with a guided signup → onboarding → home flow.

---

## ✨ Features

- 📝 **Signup Flow**
  - Collects basic user details (before onboarding)

- 🎨 **Onboarding Flow**
  - **Step 1:** Education Details (dropdowns with gradient borders)
  - **Step 2:** Profile Picture Upload (camera / gallery options, skip support)
  - **Step 3:** Role Setup (target position, resume, experience)

- 🏠 **Home Page**
  - Personalized greeting with user profile picture
  - Central illustration for visual onboarding
  - Bottom navigation bar with **Home, History, Profile**
  - Top bar with **Settings button**

- 📱 **Mobile-First Design**
  - Tailored for smaller screens
  - Uses `shadcn/ui` and `TailwindCSS` for modern, clean UI

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://react.dev/)  
- **Styling**: [TailwindCSS](https://tailwindcss.com/), custom CSS  
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)  
- **State Management**: React hooks (`useState`, `useRouter` for navigation)  
- **Image Handling**: Next.js `<Image>` component + `public/` assets  

---

## 📂 Project Structure

```bash
.
├── src/
│   ├── app/
│   │   ├── signup/
│   │   │   └── page.jsx         # Signup page
│   │   │
│   │   ├── onboarding/
│   │   │   ├── page.jsx         # Onboarding flow controller
│   │   │   ├── step-1.jsx       # Education details
│   │   │   ├── step-2.jsx       # Profile picture upload
│   │   │   └── step-3.jsx       # Role setup
│   │   │
│   │   ├── home/
│   │   │   └── page.jsx         # Home page
│   │   │
│   │   └── layout.jsx
│   │
│   ├── components/
│   │   ├── ProgressBar.jsx
│   │   ├── Dropdown.jsx
│   │   └── (other reusable components)
│   │
│   └── public/
│       ├── step1.png
│       ├── step2.png
│       ├── step3.png
│       └── (icons + illustrations)
│
└── README.md

---

```

## Getting Started

```bash 

Clone the repo and install dependencies:

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install

```
## Run locally:

```bash
npm run dev
The app will be running at http://localhost:3000

```