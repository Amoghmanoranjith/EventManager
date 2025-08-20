"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Event, eventAtom } from "../../../atoms/eventAtom";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const setEvent = useSetAtom(eventAtom);
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();

                if (res.ok) {
                    setEvents(data);
                } else {
                    setError(data.error || "Failed to fetch events");
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading events...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    const handleKnowMore = (event: Event) => {
        setEvent(event); // store event in atom
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            router.push(`/login`); // navigate
        }
        else {
            router.push(`/events/${event.id}`); // navigate
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Events</h1>
            <div className="max-w-4xl mx-auto grid gap-6">
                {events.map((event: Event) => (
                    <div
                        key={event.id}
                        className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                        <p className="text-gray-600 mb-1">
                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>City:</strong> {event.city}
                        </p>

                        <button
                            onClick={() => handleKnowMore(event)}
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Know More
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
