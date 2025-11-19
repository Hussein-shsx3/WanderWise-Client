"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { useAppSelector } from "@/redux/hooks";
import { useUserItineraries } from "@/hooks/useItineraryQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ItinerariesPage() {
  const { data: itinerariesResponse, isLoading } = useUserItineraries();

  const itineraries = itinerariesResponse?.data || itinerariesResponse?.itineraries || [];

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Itineraries</h1>
          <p className="text-gray-600 mt-2">Manage and view all your planned trips</p>
        </div>
        <Link href="/itineraries/create">
          <Button variant="primary">+ New Itinerary</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : itineraries && itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Link key={itinerary._id} href={`/itineraries/${itinerary._id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {itinerary.destination}
                  </h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">📅 Duration</span>
                      <span className="font-medium">{itinerary.duration} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">📍 Dates</span>
                      <span className="font-medium text-xs">
                        {new Date(itinerary.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    {itinerary.travelStyle && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">💼 Style</span>
                        <span className="font-medium capitalize">
                          {itinerary.travelStyle}
                        </span>
                      </div>
                    )}
                    {itinerary.budget && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">💰 Budget</span>
                        <span className="font-medium">${itinerary.budget}</span>
                      </div>
                    )}
                    {itinerary.aiGenerated && (
                      <div className="pt-2 border-t">
                        <span className="text-blue-600 text-xs font-medium">🤖 AI Generated</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No itineraries yet</h3>
            <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
            <Link href="/itineraries/create">
              <Button variant="primary">Create Your First Itinerary</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      </Container>
    </ProtectedRoute>
  );
}