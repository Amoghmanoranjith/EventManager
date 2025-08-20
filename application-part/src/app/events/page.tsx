"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Event, eventAtom } from "../../../atoms/eventAtom";

export default function EventsPage() {
    // Local state for events, loading state, and error handling
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Atom setter to store currently selected event globally
    // @ts-ignore
    const setEvent = useSetAtom(eventAtom);

    // Next.js router for navigation
    const router = useRouter();

    // Fetch events when the component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events"); // request events from API route
                const data = await res.json(); // parse JSON response

                if (res.ok) {
                    setEvents(data); // store events in local state
                } else {
                    setError(data.error || "Failed to fetch events"); // handle error from server
                }
            } catch (err) {
                setError("Something went wrong"); // handle network or unknown error
            } finally {
                setLoading(false); // stop loading spinner
            }
        };

        fetchEvents();
    }, []);

    // Show loading state
    if (loading) return <p className="text-center mt-10">Loading events...</p>;

    // Show error state
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    // Function triggered when user clicks "Know More"
    const handleKnowMore = (event: Event) => {
        setEvent(event); // store the event in global state (atom)
        const jwt = localStorage.getItem('jwt'); // check for JWT authentication token

        if (!jwt) {
            // If not logged in, redirect to login page
            router.push(`/login`);
        }
        else if (event) {
            // If logged in and event exists, navigate to event details page
            router.push(`/events/${event.id}`);
        }
        else {
            // Fallback if event object is somehow invalid
            alert("event might be malformed try reloading this page");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Events</h1>

            <div className="max-w-4xl mx-auto grid gap-6">
                {events.length > 0 ? (
                    // Render list of events
                    events.map((event, idx) =>
                        event ? (
                            <div
                                key={event.id ?? idx} // use event id as key, fallback to index if missing
                                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                            >
                                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                                <p className="text-gray-600 mb-1">
                                    <strong>Date:</strong>{" "}
                                    {new Date(event.date).toLocaleDateString()} {/* format date */}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <strong>City:</strong> {event.city}
                                </p>

                                {/* "Know More" button to view event details */}
                                <button
                                    onClick={() => handleKnowMore(event)}
                                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Know More
                                </button>
                            </div>
                        ) : null
                    )
                ) : (
                    // Empty state when no events available
                    <p className="text-center text-gray-600 mt-10">
                        Looks like you missed the party 🎉 Stay tuned for more events in the
                        future!
                    </p>
                )}
            </div>
        </div>
    );
}
