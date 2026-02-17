## PrepWise – AI Interview Practice Platform

PrepWise is an AI‑powered interview preparation platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Firebase**, **Google Gemini**, and **Vapi**.
Users can sign up, log in, generate tailored interview question sets, and practice with a voice‑based AI interviewer.

---

### Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui, Radix UI
- **Auth & Database**: Firebase Auth + Firestore (via Firebase Admin SDK)
- **AI**: Google Gemini via `@ai-sdk/google` + `ai`
- **Voice**: Vapi Web SDK (`@vapi-ai/web`)
- **Forms & Validation**: React Hook Form, Zod
- **Notifications**: Sonner

---

### Project Structure (high level)

- `app/`
  - `(root)/` – authenticated app pages (dashboard, interview generation)
    - `page.tsx` – main dashboard, lists user interviews
    - `interview/page.tsx` – interview generation and starting point for the voice agent
  - `(auth)/` – authentication routes
    - `sign-in/page.tsx` – sign in
    - `sign-up/page.tsx` – sign up
  - `api/vapi/generate/route.ts` – API endpoint that calls Gemini to generate interview questions and stores them in Firestore
- `components/`
  - `AuthForm.tsx` – shared sign‑in / sign‑up form
  - `Agent.tsx` – client component that hosts the Vapi voice interview experience
  - `InterviewCard.tsx` – card UI for displaying individual interviews
  - `ui/` – shadcn/ui primitives (e.g. `button.tsx`)
- `firebase/`
  - `client.ts` – Firebase web SDK config (used on the client)
  - `admin.ts` – Firebase Admin SDK config (used on the server / server actions)
- `lib/`
  - `actions/auth.actions.ts` – server actions for auth, session cookies, and Firestore queries
  - `utils.ts` – shared utilities (e.g. random interview cover)
  - `vapi.sdk.ts` – Vapi web SDK instance
- `types/index.d.ts` – shared TypeScript interfaces

---

### Environment Variables

Create a `.env.local` file in the project root (do **not** commit it) and define:

```env
# Vapi – Web client token and workflow id
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_client_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id

# Firebase Admin (server-side)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Gemini (used by @ai-sdk/google)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

Notes:

- `NEXT_PUBLIC_*` variables are exposed to the browser; use **Web client** tokens only (never secret/server keys).
- `FIREBASE_PRIVATE_KEY` should preserve line breaks as `\n` characters, which are converted back to real newlines in `firebase/admin.ts`.
- After changing env vars, **restart** the dev server so Next.js picks them up.

---

### Getting Started (Local Development)

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn
   ```

2. **Create `.env.local`**

   Copy the template from the **Environment Variables** section above and fill in real values from:

   - Firebase Console (service account & project)
   - Google AI Studio (Gemini API key)
   - Vapi dashboard (web token & workflow id)

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

### Auth Flow

- **Sign up**
  - User visits `/sign-up`.
  - `AuthForm` collects name, email, password.
  - Firebase Auth creates the user account.
  - A corresponding user document is stored in Firestore in the `users` collection.

- **Sign in**
  - User visits `/sign-in`.
  - `AuthForm` signs in with Firebase Auth, gets an ID token, then calls a server action to create a secure **session cookie** via Firebase Admin.
  - `getCurrentUser` in `lib/actions/auth.actions.ts` reads this cookie, verifies it using Firebase Admin, and loads the associated user document from Firestore.

- **Protected app**
  - `(root)` layout uses `getCurrentUser` to determine if the user is logged in.
  - When logged in, the navbar shows a **profile pill** with the user’s initials and display name.

---

### Interview Generation & Voice Experience

1. **Generate questions (Gemini + Firestore)**

   - The `/interview` page calls the API route at `app/api/vapi/generate/route.ts`.
   - That route:
     - Reads parameters like `type`, `role`, `level`, `techstack`, `amount`, `userid`.
     - Calls `generateText` with `google('gemini-2.5-flash-preview-05-20')`.
     - Parses the model’s JSON string into an array of questions.
     - Writes a new document to the `interviews` collection in Firestore.

2. **Start voice interview (Vapi)**

   - The `Agent` component (`components/Agent.tsx`) uses the Vapi web SDK (`lib/vapi.sdk.ts`).
   - When the user taps **Call**, `vapi.start` is called with:
     - The configured `NEXT_PUBLIC_VAPI_WORKFLOW_ID`.
     - `variableValues` including the user’s name and id.
   - The component listens to Vapi events (`call-start`, `call-end`, `message`, `speech-start`, `speech-end`) to:
     - Update call status
     - Display the latest transcript
     - Animate the speaking indicator

---

### Available Scripts

```bash
npm run dev      # Start Next.js dev server (with Turbopack)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

### Deployment

You can deploy this project to any Node‑compatible platform (e.g. Vercel, Netlify, Render). For Vercel:

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Create a new project on Vercel and import the repo.
3. Configure **Environment Variables** in the Vercel dashboard (same keys as `.env.local`).
4. Deploy – Vercel will run `npm install`, `npm run build`, and serve `npm run start`.

---

### Troubleshooting

- **"Failed to fetch" when starting a Vapi call**
  - Ensure `NEXT_PUBLIC_VAPI_WEB_TOKEN` is a valid **Web client** token.
  - Ensure `NEXT_PUBLIC_VAPI_WORKFLOW_ID` matches an existing, published workflow.
  - Confirm your app origin (e.g. `http://localhost:3000`) is allowed in the Vapi dashboard.

- **Gemini / AI call errors**
  - Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set and not expired.
  - Restart the dev server after changing env vars.

- **Firebase errors**
  - Double‑check that `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` belong to the same service account.
  - Make sure Firestore rules allow the required reads/writes for the collections you use (`users`, `interviews`).

---
