# Event Manager

A simple event management application built with **Next.js**, **TypeScript**, **TailwindCSS**, and **Jotai** for state management.  
Users can view events, see event details, and RSVP with their response.

---

## Project Structure

- **src/app/events/page.tsx**  
  Lists all available events for users to browse. Fetches and displays a summary of each event.

- **src/app/events/[id]/page.tsx**  
  Displays details for a specific event, including event information and RSVP options. Fetches event data based on the event ID from the URL.

- **src/app/login/page.tsx**  
  Provides the login form for users to authenticate into the application. Handles user input and authentication logic.

- **src/app/login/LoginForm.tsx**  
  (If present) Renders the login form UI and manages form state and validation. Used by the login page to collect user credentials.

---

## Setup

1. **Clone the repository**
```
git clone https://github.com/Amoghmanoranjith/EventManager
cd EventManager
```
2. **Install dependencies**
```
npm install
```

3. **Configure environment variables**  
Create a .env.local file in the project root and set the required variables:
```
DATABASE_URL="supabase_connection_uri"
NODE_ENV="development"
JWT_SECRET_KEY="your_secret_key"
```
4. **Run the development server**
```
npm run dev
```

The app will be available at http://localhost:3000.

## Features

### 🔑 User Authentication with JWT
- Secure login system using **JSON Web Tokens (JWT)**.
- Users provide a username and email to log in.
- JWTs are stored securely on the client side (localStorage) to maintain authentication state.
- Protected routes (e.g., event pages, RSVP actions) are only accessible with a valid token.
- Automatic redirection for unauthenticated users to the login page.

### 📅 Event Listing and Details
- Displays a list of upcoming events in a clean, card-based UI.
- Each event shows:
  - **Title** of the event
  - **Date** (formatted for readability)
  - **City/Location**
- "Know More" button available on each event card to view detailed event information.
- Handles cases where no events are available:
  - Displays a friendly message: *"Looks like you missed the party. Stay tuned for more events in the future."*

### ✋ RSVP Functionality
- Logged-in users can RSVP to events with options such as **Yes, No, or Maybe**.
- RSVP responses are stored and linked to both the user and event.
- Ensures that each user can only RSVP once per event (unique constraint).
- Events dynamically reflect a user’s RSVP status.
- Provides a seamless flow from browsing events → viewing details → confirming RSVP.

### ⚠️ Robust API Error Handling
- All API endpoints implement consistent error responses with meaningful messages.
- Handles common scenarios such as:
  - **Authentication errors** (invalid or missing JWT).
  - **Validation errors** (e.g., missing required fields like event ID, name, or email).
  - **Not found errors** (e.g., when an event or RSVP does not exist).
  - **Conflict errors** (e.g., attempting to RSVP multiple times for the same event).
  - **Server errors** (graceful fallback when unexpected issues occur).

## Deployment
on vercel:

https://event-manager-olive.vercel.app/login
