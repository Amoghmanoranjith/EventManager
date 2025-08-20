"use client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventAtom, Event } from "../../../../atoms/eventAtom";

export default function EventDetailsPage() {
  // Access global atom state for selected event
  const [event, setEvent] = useAtom(eventAtom);

  // Local state for RSVP response status ("Yes", "No", "Maybe")
  const [status, setStatus] = useState("");

  // Loading state for RSVP submission
  const [loading, setLoading] = useState(false);

  // Loading state for fetching event details if atom is empty
  const [fetching, setFetching] = useState(false);

  // Next.js router for navigation
  const router = useRouter();

  // Get the `id` parameter from the route (e.g., /events/[id])
  const params = useParams();

  // Fetch event details if atom is empty (e.g., page refresh)
  useEffect(() => {
    if (!event && params?.id) {
      const fetchEvent = async () => {
        try {
          setFetching(true); // start loading
          const res = await fetch(`/api/events/${params.id}`); // call API to get event
          const data = await res.json();

          if (res.ok) {
            // Update atom with fetched event
            // @ts-ignore
            setEvent(data as Event);
          } else {
            alert(data.error || "Failed to fetch event");
          }
        } catch (err) {
          alert("Something went wrong while fetching event");
        } finally {
          setFetching(false); // stop loading
        }
      };

      fetchEvent();
    }
  }, [event, params?.id, setEvent]);

  // Show loading screen while fetching event
  if (fetching) {
    return <p className="text-center mt-10">Loading event...</p>;
  }

  // Show error if event is not found
  if (!event) {
    return <p className="text-center mt-10 text-red-500">Event not found.</p>;
  }

  // Handle RSVP form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user selects a response
    if (!status) {
      alert("Please select a response (Yes, No, Maybe).");
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("You must be logged in to respond.");
      router.push('/login');
      return;
    }

    try {
      setLoading(true); // start loading for submission
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach JWT for authentication
        },
        body: JSON.stringify({
          event_id: event.id,
          status, // send RSVP response
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Response submitted successfully!");
      } else {
        alert(data.error || "Failed to submit response");
      }

      // Navigate back to events page after submission
      router.push('/events');
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        {/* Event Title */}
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        {/* Event Description */}
        <p className="text-gray-700 mb-2">{event.description}</p>

        {/* Event Date */}
        <p className="text-gray-600 mb-1">
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>

        {/* Event City */}
        <p className="text-gray-600 mb-4">
          <strong>City:</strong> {event.city}
        </p>

        {/* RSVP Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Your Response</label>
            <div className="flex gap-4">
              {/* Radio buttons for Yes, No, Maybe */}
              {["Yes", "No", "Maybe"].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={opt}
                    checked={status === opt}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Respond"}
          </button>
        </form>
      </div>
    </div>
  );
}
