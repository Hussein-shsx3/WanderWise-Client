"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { useAppSelector } from "@/redux/hooks";
import { useUserItineraries } from "@/hooks/useItineraryQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Zap, MapPin, Compass, Calendar, TrendingUp, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: itinerariesResponse, isLoading } = useUserItineraries();

  const itineraries =
    itinerariesResponse?.data || itinerariesResponse?.itineraries || [];

  const aiGeneratedCount = itineraries.filter((i) => i.aiGenerated).length;
  const totalDays = itineraries.reduce((sum, i) => sum + (i.duration || 0), 0);

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className="py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-4xl font-medium mb-3">
              Welcome back, {user?.firstName || "Traveler"}! ✈️
            </h1>
            <p className="text-blue-100 text-lg">
              Plan your next adventure with AI-powered itineraries or customize your own journey
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold">Total Trips</p>
                  <p className="text-3xl font-medium text-blue-900 mt-2">{itineraries.length}</p>
                </div>
                <Compass className="w-10 h-10 text-blue-500 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-semibold">AI Generated</p>
                  <p className="text-3xl font-medium text-purple-900 mt-2">{aiGeneratedCount}</p>
                </div>
                <Zap className="w-10 h-10 text-purple-500 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-600 text-sm font-semibold">Total Days</p>
                  <p className="text-3xl font-medium text-green-900 mt-2">{totalDays}</p>
                </div>
                <Calendar className="w-10 h-10 text-green-500 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-semibold">Manual Plans</p>
                  <p className="text-3xl font-medium text-orange-900 mt-2">{itineraries.length - aiGeneratedCount}</p>
                </div>
                <MapPin className="w-10 h-10 text-orange-500 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity" />
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Create with AI
                </h3>
                <p className="text-gray-600 mb-6">
                  Let artificial intelligence plan your perfect itinerary based on your preferences
                </p>
                <Button
                  variant="primary"
                  className="w-full group/btn"
                  onClick={() => router.push("/itineraries/create?mode=ai")}
                >
                  <span>Generate Itinerary</span>
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity" />
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Create Manually
                </h3>
                <p className="text-gray-600 mb-6">
                  Take full control and craft your custom itinerary step by step
                </p>
                <Button
                  variant="outline"
                  className="w-full group/btn"
                  onClick={() => router.push("/itineraries/create?mode=manual")}
                >
                  <span>Create Manually</span>
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Itineraries */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-medium text-gray-900">My Itineraries</h2>
              <p className="text-gray-600 mt-1">Manage and explore all your planned trips</p>
            </div>
            <Link href="/itineraries">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : itineraries && itineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.slice(0, 6).map((itinerary) => (
                <Card
                  key={itinerary._id}
                  className="h-full hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100"
                  onClick={() => router.push(`/itineraries/${itinerary._id}`)}
                >
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white pb-4 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                    <h3 className="text-lg font-bold truncate">
                      {itinerary.destination}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {itinerary.duration} day{itinerary.duration !== 1 ? "s" : ""}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="text-sm">
                          {new Date(itinerary.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })} -{" "}
                          {new Date(itinerary.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {itinerary.travelStyle && (
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
                              {itinerary.travelStyle}
                            </span>
                          )}
                        </div>
                        {itinerary.aiGenerated && (
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                            🤖 AI
                          </span>
                        )}
                      </div>
                      {itinerary.budget && (
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Budget: <span className="font-semibold text-gray-900">${itinerary.budget}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No itineraries yet
                </h3>
                <p className="text-gray-600 mb-8">
                  Start creating your first adventure today!
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push("/itineraries/create")}
                  className="group"
                >
                  <span>Create Your First Itinerary</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </ProtectedRoute>
  );
}
