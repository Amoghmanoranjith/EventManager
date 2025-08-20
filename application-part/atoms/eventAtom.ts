import { atom } from "jotai";

export type Event = {
  id: string;
  title: string;
  description:string;
  city:string;
  date:string;
} ;

// Atom to hold the logged-in user
export const eventAtom = atom<Event | null>(null);
