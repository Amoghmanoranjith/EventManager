"use client";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eventAtom, Event } from "../../../../atoms/eventAtom";
import { useRouter } from "next/navigation";

export default function EventDetailsPage() {
  const [event, setEvent] = useAtom(eventAtom);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const params = useParams();

  // If atom is empty, fetch event from API
  useEffect(() => {
    if (!event && params?.id) {
      const fetchEvent = async () => {
        try {
          setFetching(true);
          const res = await fetch(`/api/events/${params.id}`);
          const data = await res.json();

          if (res.ok) {
            setEvent(data as Event);
          } else {
            alert(data.error || "Failed to fetch event");
          }
        } catch (err) {
          alert("Something went wrong while fetching event");
        } finally {
          setFetching(false);
        }
      };

      fetchEvent();
    }
  }, [event, params?.id, setEvent]);

  if (fetching) {
    return <p className="text-center mt-10">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-center mt-10 text-red-500">Event not found.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) {
      alert("Please select a response (Yes, No, Maybe).");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("You must be logged in to respond.");
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: event.id,
          status,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Response submitted successfully!");
      } else {
        alert(data.error || "Failed to submit response");
      }
      router.push('/events');
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-700 mb-2">{event.description}</p>
        <p className="text-gray-600 mb-1">
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>City:</strong> {event.city}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Your Response</label>
            <div className="flex gap-4">
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
