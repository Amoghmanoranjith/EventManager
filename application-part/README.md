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
