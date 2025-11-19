"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { useAppSelector } from "@/redux/hooks";
import { useUserItineraries } from "@/hooks/useItineraryQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Zap, MapPin } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: itinerariesResponse, isLoading } = useUserItineraries();

  const itineraries =
    itinerariesResponse?.data || itinerariesResponse?.itineraries || [];

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "Traveler"}!
          </h1>
          <p className="text-gray-600">
            Manage your trips and create new adventures
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Create with AI
              </h3>
              <p className="text-gray-600 mb-4">
                Let AI plan your perfect itinerary
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push("/itineraries/create?mode=ai")}
              >
                Generate Itinerary
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Create Manual
              </h3>
              <p className="text-gray-600 mb-4">
                Create your custom itinerary step by step
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/itineraries/create?mode=manual")}
              >
                Create Manually
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My Itineraries */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            My Itineraries
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : itineraries && itineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary) => (
                <Card
                  key={itinerary._id}
                  className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/itineraries/${itinerary._id}`)}
                >
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {itinerary.destination}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>
                      <p>{itinerary.duration} days</p>
                      {itinerary.travelStyle && <p>{itinerary.travelStyle}</p>}
                      {itinerary.budget && <p>${itinerary.budget}</p>}
                      {itinerary.aiGenerated && (
                        <p className="text-blue-600 font-semibold">
                          AI Generated
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 mb-6">
                  No itineraries yet. Create your first trip!
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push("/itineraries/create")}
                >
                  Create Your First Itinerary
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </ProtectedRoute>
  );
}
