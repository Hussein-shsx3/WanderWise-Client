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
import { Calendar, MapPin, DollarSign, Zap, Trash2, ArrowRight, Plane } from "lucide-react";

export default function ItinerariesPage() {
  const { data: itinerariesResponse, isLoading } = useUserItineraries();
  const deleteItinerary = useDeleteItinerary();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const itineraries = itinerariesResponse?.data || itinerariesResponse?.itineraries || [];
  const aiCount = itineraries.filter((i) => i.aiGenerated).length;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this itinerary? This action cannot be undone.")) {
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
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-medium text-gray-900 flex items-center gap-3">
                <Plane className="text-blue-600" size={36} />
                My Itineraries
              </h1>
              <p className="text-gray-600 mt-2">Plan, manage, and explore all your adventures</p>
            </div>
            <Link href="/itineraries/create">
              <Button variant="primary" className="group hidden sm:flex">
                <span>+ Create New</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {itineraries.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">Total Trips</p>
                  <p className="text-3xl font-medium text-blue-900 mt-2">{itineraries.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider">AI Generated</p>
                  <p className="text-3xl font-medium text-purple-900 mt-2">{aiCount}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <p className="text-green-600 text-xs font-semibold uppercase tracking-wider">Manual Plans</p>
                  <p className="text-3xl font-medium text-green-900 mt-2">{itineraries.length - aiCount}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <p className="text-orange-600 text-xs font-semibold uppercase tracking-wider">Total Days</p>
                  <p className="text-3xl font-medium text-orange-900 mt-2">
                    {itineraries.reduce((sum, i) => sum + (i.duration || 0), 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Itineraries Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : itineraries && itineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <div key={itinerary._id} className="group h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50 flex flex-col">
                  {/* Card Header with Gradient */}
                  <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white pb-6 group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-medium truncate mb-2">
                          {itinerary.destination}
                        </h3>
                        <p className="text-blue-100 text-sm">{itinerary.duration} day{itinerary.duration !== 1 ? "s" : ""}</p>
                      </div>
                      {itinerary.aiGenerated && (
                        <div className="flex-shrink-0 bg-white/20 px-3 py-1 rounded-full">
                          <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="pt-6 pb-4 flex-1">
                    <div className="space-y-4">
                      {/* Dates */}
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Travel Dates</p>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {new Date(itinerary.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })} - {new Date(itinerary.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Travel Style */}
                      {itinerary.travelStyle && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Travel Style</p>
                            <p className="text-sm text-gray-900 font-medium mt-1 capitalize">
                              {itinerary.travelStyle}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Budget */}
                      {itinerary.budget && (
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Budget</p>
                            <p className="text-sm text-gray-900 font-bold mt-1">
                              ${itinerary.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* AI Badge */}
                      {itinerary.aiGenerated && (
                        <div className="pt-3 border-t border-gray-200">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            <Zap size={14} />
                            AI Generated
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 p-4 flex gap-2">
                    <Link href={`/itineraries/${itinerary._id}`} className="flex-1">
                      <Button variant="primary" className="w-full group/btn">
                        <span>View Details</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition" />
                      </Button>
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, itinerary._id as string)}
                      disabled={deletingId === itinerary._id}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 font-medium text-sm transition-colors flex items-center gap-2"
                      title="Delete itinerary"
                    >
                      <Trash2 size={16} />
                      {deletingId === itinerary._id ? "..." : ""}
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
            <CardContent className="py-20 px-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">
                Start Your Journey
              </h3>
              <p className="text-gray-600 mb-10 max-w-md mx-auto">
                No itineraries yet. Create your first adventure and start exploring the world with WanderWise!
              </p>
              <Link href="/itineraries/create">
                <Button variant="primary" size="lg" className="group inline-flex">
                  <span>Create Your First Itinerary</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </Container>
    </ProtectedRoute>
  );
}