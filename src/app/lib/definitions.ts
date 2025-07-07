// Data model definitions for the athlete tracking application

// Athlete model
import { Category } from '@/app/lib/actions';

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  email?: string;
  phone?: string;
  address: string | null | undefined;
  joinDate: Date;
  active: boolean;
  categories?: string[]; // Age categories or competition categories
  notes: string | null | undefined;
  coachNotes?: string | null | undefined;
  training?: Training[];
  results?: Result[];
  events?: Event[];
  coaches?: Coach[]
  photoUrl?: string;
}

// Event model
export interface Event {
  id: string;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  type: 'COMPETITION' | 'TRAINING' | 'CAMP' | 'MEETING' | 'OTHER'; // These match the enum case
  category: Category[] | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer?: string;
  notes?: string | null | undefined;
}

// Discipline model (track and field events)
export interface Discipline {
  id: string;
  name: string;
  category: 'sprint' | 'middle-distance' | 'long-distance' | 'hurdles' | 'jumps' | 'throws' | 'combined' | 'relay' | 'walk';
  measurementUnit: 'time' | 'distance' | 'points';
  ageGroups?: string[]; // e.g., "U18", "Senior"
  genderCategory: 'male' | 'female' | 'mixed';
}

// Result model
export interface Result {
  id: string;
  athleteId: string;
  eventId: string;
  disciplineId: string;
  date: Date;
  value: number; // Time in seconds, distance in meters, or points
  position?: number; // Finishing position
  personalBest: boolean;
  seasonBest: boolean;
  notes?: string;
  verified: boolean;
  verifiedBy?: string;
}

// Training model
export interface Training {
  id: string;
  athleteId: string;
  date: Date;
  duration: number; // in minutes
  type: string; // e.g., "Speed", "Endurance", "Strength"
  description?: string;
  exercises?: TrainingExercise[];
  notes?: string;
  coachNotes?: string;
}

// Training exercise
export interface TrainingExercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  distance?: number;
  time?: number;
  weight?: number;
  notes?: string;
}

// Coach model
export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization?: string[];
  active: boolean;
}

// User model for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coach' | 'athlete' | 'viewer';
  athleteId?: string; // If the user is an athlete
  coachId?: string; // If the user is a coach
}
