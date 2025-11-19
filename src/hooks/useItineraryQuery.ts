import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itineraryService } from "@/services/itineraryService";
import {
  CreateItineraryDTO,
  UpdateItineraryDTO,
  GenerateItineraryDTO,
  Activity,
} from "@/types/itinerary";

export const useUserItineraries = () => {
  return useQuery({
    queryKey: ["itineraries"],
    queryFn: () => itineraryService.getUserItineraries(),
  });
};

export const useItinerary = (id: string | null) => {
  return useQuery({
    queryKey: ["itinerary", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID");
      const response = await itineraryService.getItinerary(id);
      return response.data || response.itinerary;
    },
    enabled: !!id,
  });
};

export const useCreateItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItineraryDTO) => itineraryService.createItinerary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
  });
};

export const useGenerateAIItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateItineraryDTO) => itineraryService.generateAIItinerary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
  });
};

export const useUpdateItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItineraryDTO }) =>
      itineraryService.updateItinerary(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      queryClient.invalidateQueries({ queryKey: ["itinerary", id] });
    },
  });
};

export const useDeleteItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itineraryService.deleteItinerary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
  });
};

export const useAddActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itineraryId,
      dayNumber,
      activity,
    }: {
      itineraryId: string;
      dayNumber: number;
      activity: Activity;
    }) => itineraryService.addActivity(itineraryId, dayNumber, activity),
    onSuccess: (_, { itineraryId }) => {
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itineraryId,
      dayNumber,
      activityId,
      activity,
    }: {
      itineraryId: string;
      dayNumber: number;
      activityId: string;
      activity: Activity;
    }) => itineraryService.updateActivity(itineraryId, dayNumber, activityId, activity),
    onSuccess: (_, { itineraryId }) => {
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itineraryId,
      dayNumber,
      activityId,
    }: {
      itineraryId: string;
      dayNumber: number;
      activityId: string;
    }) => itineraryService.deleteActivity(itineraryId, dayNumber, activityId),
    onSuccess: (_, { itineraryId }) => {
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
  });
};
