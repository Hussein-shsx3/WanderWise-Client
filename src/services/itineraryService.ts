import axiosInstance from "@/lib/axios";
import {
  Itinerary,
  CreateItineraryDTO,
  UpdateItineraryDTO,
  GenerateItineraryDTO,
  ItineraryResponse,
  ItinerariesResponse,
  Activity,
} from "@/types/itinerary";

export const itineraryService = {
  // Create a new itinerary
  createItinerary: async (data: CreateItineraryDTO): Promise<ItineraryResponse> => {
    const response = await axiosInstance.post("/itineraries", data);
    return response.data;
  },

  // Generate AI-powered itinerary
  generateAIItinerary: async (data: GenerateItineraryDTO): Promise<ItineraryResponse> => {
    const response = await axiosInstance.post("/itineraries/generate", data);
    return response.data;
  },

  // Get all user itineraries
  getUserItineraries: async (): Promise<ItinerariesResponse> => {
    const response = await axiosInstance.get("/itineraries");
    return response.data;
  },

  // Get specific itinerary by ID
  getItinerary: async (id: string): Promise<ItineraryResponse> => {
    const response = await axiosInstance.get(`/itineraries/${id}`);
    return response.data;
  },

  // Update itinerary
  updateItinerary: async (id: string, data: UpdateItineraryDTO): Promise<ItineraryResponse> => {
    const response = await axiosInstance.put(`/itineraries/${id}`, data);
    return response.data;
  },

  // Delete itinerary
  deleteItinerary: async (id: string): Promise<ItineraryResponse> => {
    const response = await axiosInstance.delete(`/itineraries/${id}`);
    return response.data;
  },

  // Add activity to a day
  addActivity: async (
    itineraryId: string,
    dayNumber: number,
    activity: Activity
  ): Promise<ItineraryResponse> => {
    const response = await axiosInstance.post(
      `/itineraries/${itineraryId}/days/${dayNumber}/activities`,
      activity
    );
    return response.data;
  },

  // Update activity
  updateActivity: async (
    itineraryId: string,
    dayNumber: number,
    activityId: string,
    activity: Activity
  ): Promise<ItineraryResponse> => {
    const response = await axiosInstance.put(
      `/itineraries/${itineraryId}/days/${dayNumber}/activities/${activityId}`,
      activity
    );
    return response.data;
  },

  // Delete activity
  deleteActivity: async (
    itineraryId: string,
    dayNumber: number,
    activityId: string
  ): Promise<ItineraryResponse> => {
    const response = await axiosInstance.delete(
      `/itineraries/${itineraryId}/days/${dayNumber}/activities/${activityId}`
    );
    return response.data;
  },
};
