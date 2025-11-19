import { createAsyncThunk } from "@reduxjs/toolkit";
import { itineraryService } from "@/services/itineraryService";
import {
  CreateItineraryDTO,
  UpdateItineraryDTO,
  GenerateItineraryDTO,
} from "@/types/itinerary";
import axios from "axios";

export const fetchUserItineraries = createAsyncThunk(
  "itinerary/fetchUserItineraries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await itineraryService.getUserItineraries();
      return response.data || response.itineraries || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch itineraries");
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const createItinerary = createAsyncThunk(
  "itinerary/createItinerary",
  async (data: CreateItineraryDTO, { rejectWithValue }) => {
    try {
      const response = await itineraryService.createItinerary(data);
      return response.data || response.itinerary;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to create itinerary");
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const generateAIItinerary = createAsyncThunk(
  "itinerary/generateAIItinerary",
  async (data: GenerateItineraryDTO, { rejectWithValue }) => {
    try {
      const response = await itineraryService.generateAIItinerary(data);
      return response.data || response.itinerary;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to generate itinerary");
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const fetchItinerary = createAsyncThunk(
  "itinerary/fetchItinerary",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await itineraryService.getItinerary(id);
      return response.data || response.itinerary;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch itinerary");
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const updateItinerary = createAsyncThunk(
  "itinerary/updateItinerary",
  async ({ id, data }: { id: string; data: UpdateItineraryDTO }, { rejectWithValue }) => {
    try {
      const response = await itineraryService.updateItinerary(id, data);
      return response.data || response.itinerary;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to update itinerary");
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const deleteItinerary = createAsyncThunk(
  "itinerary/deleteItinerary",
  async (id: string, { rejectWithValue }) => {
    try {
      await itineraryService.deleteItinerary(id);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete itinerary");
      }
      return rejectWithValue("An error occurred");
    }
  }
);
