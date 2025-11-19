export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Weather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike?: number;
  uvIndex?: number;
}

export interface Activity {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  time: string; // HH:MM format
  duration: number; // in minutes
  location: Location;
  category: "attraction" | "dining" | "accommodation" | "transport" | "shopping" | "activity";
  estimatedCost?: number;
  notes?: string;
}

export interface DayItinerary {
  day: number;
  date: string; // ISO date
  weather?: Weather;
  activities: Activity[];
  summary?: string;
}

export interface Itinerary {
  _id?: string;
  userId?: string;
  destination: string;
  coordinates: Location;
  startDate: string; // ISO date
  endDate: string; // ISO date
  duration: number; // in days
  dayItineraries: DayItinerary[];
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[];
  aiGenerated: boolean;
  aiNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItineraryDTO {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[];
  useAI?: boolean;
}

export interface UpdateItineraryDTO {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[];
  dayItineraries?: DayItinerary[];
  aiNotes?: string;
}

export interface GenerateItineraryDTO {
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  travelStyle: "budget" | "comfort" | "luxury";
  preferences?: string[];
  numberOfDays: number;
}

export interface ItineraryResponse {
  success: boolean;
  message: string;
  data?: Itinerary;
  itinerary?: Itinerary;
}

export interface ItinerariesResponse {
  success: boolean;
  message: string;
  data?: Itinerary[];
  itineraries?: Itinerary[];
  count?: number;
}

export interface ItineraryState {
  itineraries: Itinerary[];
  currentItinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
}
