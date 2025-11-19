import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItineraryState, Itinerary } from "@/types/itinerary";

const initialState: ItineraryState = {
  itineraries: [],
  currentItinerary: null,
  isLoading: false,
  error: null,
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set all itineraries
    setItineraries: (state, action: PayloadAction<Itinerary[]>) => {
      state.itineraries = action.payload;
      state.error = null;
    },

    // Add new itinerary
    addItinerary: (state, action: PayloadAction<Itinerary>) => {
      state.itineraries.push(action.payload);
    },

    // Set current itinerary
    setCurrentItinerary: (state, action: PayloadAction<Itinerary | null>) => {
      state.currentItinerary = action.payload;
    },

    // Update itinerary
    updateItinerary: (state, action: PayloadAction<Itinerary>) => {
      const index = state.itineraries.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) {
        state.itineraries[index] = action.payload;
      }
      if (state.currentItinerary?._id === action.payload._id) {
        state.currentItinerary = action.payload;
      }
    },

    // Delete itinerary
    deleteItinerary: (state, action: PayloadAction<string>) => {
      state.itineraries = state.itineraries.filter((i) => i._id !== action.payload);
      if (state.currentItinerary?._id === action.payload) {
        state.currentItinerary = null;
      }
    },

    // Clear all itineraries
    clearItineraries: (state) => {
      state.itineraries = [];
      state.currentItinerary = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setItineraries,
  addItinerary,
  setCurrentItinerary,
  updateItinerary,
  deleteItinerary,
  clearItineraries,
} = itinerarySlice.actions;

export default itinerarySlice.reducer;
