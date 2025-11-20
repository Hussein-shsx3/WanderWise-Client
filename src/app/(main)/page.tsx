"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent } from "@/components/ui/display/Card";
import { useAppSelector } from "@/redux/hooks";
import { Sparkles, MapPin, Brain, Zap, ArrowRight, Globe } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20 md:py-32">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-medium mb-6 leading-tight">
                Plan Your Perfect Journey with AI
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Let WanderWise create personalized travel itineraries powered by artificial intelligence. Discover destinations, plan activities, and create memories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => router.push("/itineraries/create")}
                      className="group"
                    >
                      <span>Start Planning</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/dashboard")}
                      className="bg-white/10 text-white border-white hover:bg-white hover:text-blue-600"
                    >
                      Go to Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="primary" size="lg" className="group w-full sm:w-auto">
                        <span>Get Started</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-white/10 text-white border-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                      >
                        Create Account
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <Globe className="w-24 h-24 mx-auto text-blue-200 mb-6" />
                  <p className="text-center text-blue-100">
                    Discover incredible destinations and create unforgettable memories with AI-powered planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <Container maxWidth="xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
              Why Choose WanderWise?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with intelligent features designed for modern adventurers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  AI-Powered Planning
                </h3>
                <p className="text-gray-600">
                  Let artificial intelligence craft personalized itineraries based on your preferences, budget, and travel style.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Fast & Easy
                </h3>
                <p className="text-gray-600">
                  Generate complete travel plans in seconds. No more hours spent researching and planning manually.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Full Customization
                </h3>
                <p className="text-gray-600">
                  Edit, modify, and customize every aspect of your itinerary to match your exact needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-indigo-600">
        <Container maxWidth="xl">
          <div className="text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are discovering new destinations with WanderWise AI.
            </p>
            {!isAuthenticated && (
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="group">
                  <span>Create Free Account</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Button>
              </Link>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
