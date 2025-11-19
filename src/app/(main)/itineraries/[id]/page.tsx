"use client";

import { useParams } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { useItinerary } from "@/hooks/useItineraryQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import type { DayItinerary, Activity } from "@/types/itinerary";

export default function ItineraryPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: itinerary, isLoading, error } = useItinerary(id);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !itinerary) {
    return (
      <ProtectedRoute>
        <Container maxWidth="xl" className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Itinerary not found</h1>
            <Link href="/itineraries">
              <Button variant="primary">Back to Itineraries</Button>
            </Link>
          </div>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className="py-12">
        <div className="mb-8">
          <Link href="/itineraries" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Itineraries
          </Link>
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">{itinerary.destination}</h1>
          <p className="text-gray-600">
            {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-semibold text-blue-600 mb-2">
                {Math.ceil(
                  (new Date(itinerary.endDate).getTime() - new Date(itinerary.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}
              </div>
              <p className="text-gray-600">Days</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-semibold text-green-600 mb-2">{itinerary.travelStyle}</div>
              <p className="text-gray-600">Travel Style</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-semibold text-purple-600 mb-2">
                ${itinerary.budget || "N/A"}
              </div>
              <p className="text-gray-600">Budget</p>
            </CardContent>
          </Card>
        </div>

        {itinerary.dayItineraries && itinerary.dayItineraries.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Daily Itinerary</h2>
            {itinerary.dayItineraries.map((day: DayItinerary, index: number) => (
              <Card key={index}>
                <CardHeader className="bg-blue-50">
                  <h3 className="text-lg font-semibold text-gray-900">Day {day.day || index + 1}</h3>
                </CardHeader>
                <CardContent className="p-6">
                  {day.activities && day.activities.length > 0 ? (
                    <ul className="space-y-3">
                      {day.activities.map((activity: Activity, actIdx: number) => (
                        <li key={actIdx} className="flex gap-3">
                          <span className="text-blue-600 font-semibold">•</span>
                          <div>
                            <p className="font-medium text-gray-900">{activity.name}</p>
                            <p className="text-gray-600 text-sm">{activity.description}</p>
                            {activity.time && <p className="text-gray-500 text-xs">⏰ {activity.time}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No activities planned for this day.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Link href="/itineraries">
            <Button variant="outline">Back to Itineraries</Button>
          </Link>
          <Link href="/itineraries">
            <Button variant="primary">Create Another</Button>
          </Link>
        </div>
      </Container>
    </ProtectedRoute>
  );
}
