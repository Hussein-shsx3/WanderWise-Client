\"use client\";

import { useState, Suspense } from \"react\";
import { useRouter, useSearchParams } from \"next/navigation\";
import { Container } from \"@/components/Container\";
import { Button } from \"@/components/ui/buttons/Button\";
import { Input } from \"@/components/ui/forms/Input\";
import { Select } from \"@/components/ui/forms/Select\";
import { Textarea } from \"@/components/ui/forms/Textarea\";
import { Card, CardContent, CardHeader } from \"@/components/ui/display/Card\";
import { Toast } from \"@/components/ui/feedback/Toast\";
import { useCreateItinerary, useGenerateAIItinerary } from \"@/hooks/useItineraryQuery\";
import { ProtectedRoute } from \"@/components/ProtectedRoute\";

function CreateItineraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "ai";

  const { mutate: createItinerary, isPending: isCreating } = useCreateItinerary();
  const { mutate: generateAI, isPending: isGenerating } = useGenerateAIItinerary();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelStyle: "comfort" as "budget" | "comfort" | "luxury",
    budget: "",
    preferences: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start > end) {
      newErrors.endDate = "End date must be after start date";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const days = Math.ceil(
      (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
    ) + 1;

    if (mode === "ai") {
      generateAI(
        {
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelStyle: formData.travelStyle,
          budget: formData.budget ? parseInt(formData.budget) : undefined,
          preferences: formData.preferences.filter((p) => p.trim()),
          numberOfDays: days,
        },
        {
          onSuccess: (response) => {
            setToast({ type: "success", message: "Itinerary created successfully!" });
            setTimeout(() => router.push(`/itineraries/${response._id}`), 1500);
          },
          onError: (error) => {
            const message = typeof error === "string" ? error : "Failed to create itinerary";
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
          budget: formData.budget ? parseInt(formData.budget) : undefined,
          preferences: formData.preferences.filter((p) => p.trim()),
          useAI: false,
        },
        {
          onSuccess: (response) => {
            setToast({ type: "success", message: "Itinerary created successfully!" });
            setTimeout(() => router.push(`/itineraries/${response._id}`), 1500);
          },
          onError: (error) => {
            const message = typeof error === "string" ? error : "Failed to create itinerary";
            setToast({ type: "error", message });
          },
        }
      );
    }
  };

  return (
    <Container maxWidth="md" className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "ai" ? "✨ AI-Powered Trip Planner" : "🗺️ Create Custom Itinerary"}
        </h1>
        <p className="text-gray-600">
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

      <Card>
        <CardContent className="p-8">
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
              disabled={isCreating || isGenerating}
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
                required
                disabled={isCreating || isGenerating}
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                required
                disabled={isCreating || isGenerating}
              />
            </div>

            {/* Travel Style */}
            <Select
              label="Travel Style"
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              options={[
                { value: "budget", label: "Budget 💰 - Backpacking, hostels, local food" },
                {
                  value: "comfort",
                  label: "Comfort 🏨 - Mid-range hotels, mix of activities",
                },
                { value: "luxury", label: "Luxury ✨ - 5-star hotels, premium experiences" },
              ]}
              disabled={isCreating || isGenerating}
            />

            {/* Budget */}
            <Input
              label="Budget (Optional)"
              name="budget"
              type="number"
              placeholder="Enter total budget in USD"
              value={formData.budget}
              onChange={handleChange}
              disabled={isCreating || isGenerating}
            />

            {/* Preferences */}
            <Textarea
              label="Preferences (Optional)"
              name="preferences"
              placeholder="E.g., Beach, hiking, museums, local cuisine, nightlife&#10;(Enter one per line)"
              value={formData.preferences.join("\n")}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  preferences: e.target.value.split("\n"),
                }));
              }}
              disabled={isCreating || isGenerating}
              rows={4}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isCreating || isGenerating}
              >
                {isCreating || isGenerating ? "Creating..." : "Create Itinerary"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isCreating || isGenerating}
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
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateItineraryContent />
      </Suspense>
    </ProtectedRoute>
  );
}
