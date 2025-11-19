"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { useAppSelector } from "@/redux/hooks";
import { useUserItineraries, useDeleteItinerary } from "@/hooks/useItineraryQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ItinerariesPage() {
  const { data: itinerariesResponse, isLoading } = useUserItineraries();
  const deleteItinerary = useDeleteItinerary();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const itineraries = itinerariesResponse?.data || itinerariesResponse?.itineraries || [];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteItinerary.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
      alert("Failed to delete itinerary");
    } finally {
      setDeletingId(null);
    }
  };

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
            <div key={itinerary._id} className="group">
              <Link href={`/itineraries/${itinerary._id}`}>
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
              <div className="mt-3 flex gap-2">
                <Link href={`/itineraries/${itinerary._id}`} className="flex-1">
                  <Button variant="primary" className="w-full">View</Button>
                </Link>
                <button
                  onClick={(e) => handleDelete(e, itinerary._id)}
                  disabled={deletingId === itinerary._id}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 font-medium text-sm transition-colors"
                >
                  {deletingId === itinerary._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
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