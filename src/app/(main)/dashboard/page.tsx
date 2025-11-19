"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { useAppSelector } from "@/redux/hooks";
import { useUserItineraries } from "@/hooks/useItineraryQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: itinerariesResponse, isLoading } = useUserItineraries();

  const itineraries = itinerariesResponse?.data || itinerariesResponse?.itineraries || [];

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">Manage your trips and create new adventures</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold mb-2">Create with AI</h3>
            <p className="text-gray-600 mb-4">Let AI plan your perfect itinerary</p>
            <Link href="/itineraries/create?mode=ai">
              <Button variant="primary" className="w-full">
                Generate Itinerary
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Create Manual</h3>
            <p className="text-gray-600 mb-4">Create your custom itinerary step by step</p>
            <Link href="/itineraries/create?mode=manual">
              <Button variant="outline" className="w-full">
                Create Manually
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* My Itineraries */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Itineraries</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : itineraries && itineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <Link key={itinerary._id} href={`/itineraries/${itinerary._id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {itinerary.destination}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        📅{" "}
                        {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>
                      <p>⏱️ {itinerary.duration} days</p>
                      {itinerary.travelStyle && <p>💼 {itinerary.travelStyle}</p>}
                      {itinerary.budget && <p>💰 ${itinerary.budget}</p>}
                      {itinerary.aiGenerated && (
                        <p className="text-blue-600">🤖 AI Generated</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-6">No itineraries yet. Create your first trip!</p>
              <Link href="/itineraries/create">
                <Button variant="primary">Create Your First Itinerary</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
    </ProtectedRoute>
  );
}
