"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, MapPin } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { Textarea } from "@/components/ui/forms/Textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { Toast } from "@/components/ui/feedback/Toast";
import { Spinner } from "@/components/ui/feedback/Spinner";
import {
  useCreateItinerary,
  useGenerateAIItinerary,
} from "@/hooks/useItineraryQuery";

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelStyle: "budget" | "comfort" | "luxury";
  budget: string;
  preferences: string;
}

interface ItineraryResponse {
  _id?: string;
  id?: string;
  success?: boolean;
  data?: {
    _id?: string;
    id?: string;
  };
}

function CreateItineraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "ai";

  const { mutate: createItinerary, isPending: isCreating } =
    useCreateItinerary();
  const { mutate: generateAI, isPending: isGenerating } =
    useGenerateAIItinerary();

  const [formData, setFormData] = useState<FormData>({
    destination: "",
    startDate: "",
    endDate: "",
    travelStyle: "comfort",
    budget: "",
    preferences: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    return newErrors;
  };

  const calculateDays = (): number => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ type: "error", message: "Please fix the errors above" });
      return;
    }

    const days = calculateDays();
    const preferences = formData.preferences
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (mode === "ai") {
      generateAI(
        {
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelStyle: formData.travelStyle,
          budget: formData.budget ? parseInt(formData.budget, 10) : undefined,
          preferences,
          numberOfDays: days,
        },
        {
          onSuccess: (response: ItineraryResponse) => {
            setToast({
              type: "success",
              message: "Itinerary created successfully!",
            });
            setTimeout(() => {
              const itineraryId =
                response.data?._id ||
                response.data?.id ||
                response._id ||
                response.id;
              if (itineraryId) {
                router.push(`/itineraries/${itineraryId}`);
              } else {
                router.push("/dashboard");
              }
            }, 1500);
          },
          onError: (error: unknown) => {
            const message =
              typeof error === "string"
                ? error
                : error instanceof Error
                ? error.message
                : "Failed to create itinerary";
            setToast({ type: "error", message });
          },
        }
      );
    } else {
      createItinerary(
        {
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelStyle: formData.travelStyle,
          budget: formData.budget ? parseInt(formData.budget, 10) : undefined,
          preferences,
          useAI: false,
        },
        {
          onSuccess: (response: ItineraryResponse) => {
            setToast({
              type: "success",
              message: "Itinerary created successfully!",
            });
            setTimeout(() => {
              const itineraryId =
                response.data?._id ||
                response.data?.id ||
                response._id ||
                response.id;
              if (itineraryId) {
                router.push(`/itineraries/${itineraryId}`);
              } else {
                router.push("/dashboard");
              }
            }, 1500);
          },
          onError: (error: unknown) => {
            const message =
              typeof error === "string"
                ? error
                : error instanceof Error
                ? error.message
                : "Failed to create itinerary";
            setToast({ type: "error", message });
          },
        }
      );
    }
  };

  const isLoading = isCreating || isGenerating;

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {mode === "ai" ? (
            <>
              <Zap className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-semibold text-gray-900">
                AI-Powered Trip Planner
              </h1>
            </>
          ) : (
            <>
              <MapPin className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-semibold text-gray-900">
                Create Custom Itinerary
              </h1>
            </>
          )}
        </div>
        <p className="text-gray-600 ml-10">
          {mode === "ai"
            ? "Let our AI create the perfect itinerary for your trip"
            : "Build your itinerary step by step"}
        </p>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={toast.type === "error" ? undefined : 3000}
        />
      )}

      <Card className="border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900">Trip Details</h2>
        </CardHeader>
        <CardContent className="p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
              <Spinner />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <Input
              label="Where do you want to go?"
              name="destination"
              type="text"
              placeholder="e.g., Paris, Tokyo, New York"
              value={formData.destination}
              onChange={handleChange}
              error={errors.destination}
              required
              disabled={isLoading}
            />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
                required
                disabled={isLoading}
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                required
                disabled={isLoading}
              />
            </div>

            {/* Travel Style & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Travel Style"
                name="travelStyle"
                value={formData.travelStyle}
                onChange={handleChange}
                options={[
                  {
                    value: "budget",
                    label: "Budget - Backpacking, hostels, local food",
                  },
                  {
                    value: "comfort",
                    label: "Comfort - Mid-range hotels, mix of activities",
                  },
                  {
                    value: "luxury",
                    label: "Luxury - 5-star hotels, premium experiences",
                  },
                ]}
                disabled={isLoading}
              />
              <Input
                label="Budget (Optional)"
                name="budget"
                type="number"
                placeholder="Enter total budget in USD"
                value={formData.budget}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Preferences */}
            <Textarea
              label="Preferences (Optional)"
              name="preferences"
              placeholder="E.g., Beach, hiking, museums, local cuisine, nightlife (Enter one per line)"
              value={formData.preferences}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Creating...
                  </span>
                ) : (
                  "Create Itinerary"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function CreateItineraryPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="xl" className="py-8">
          <div className="flex items-center justify-center h-96">
            <Spinner />
          </div>
        </Container>
      }
    >
      <CreateItineraryContent />
    </Suspense>
  );
}
