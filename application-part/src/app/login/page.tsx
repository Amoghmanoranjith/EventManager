"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // Local state to store user inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Next.js router for navigation
  const router = useRouter();

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form reload behavior

    try {
      // Send login request to backend
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // specify JSON format
        body: JSON.stringify({ name: username, email }), // send user credentials
      });

      const data = await res.json(); // parse response

      if (res.ok && data.token) {
        // If login is successful and token is returned
        localStorage.setItem("jwt", data.token); // save JWT token locally
        router.push("/events"); // navigate to events page
      } else {
        // If login fails, show error message
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      // Handle unexpected errors
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Login form container */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username input */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Email input */}
          <input
            type="email"
            placeholder="email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
