"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/display/Card";
import { Sparkles, Compass, MapPin, Cloud, Zap, Users } from "lucide-react";

const Home = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <Container maxWidth="xl" className="relative z-10 text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm text-white">✨ AI-Powered Travel Planning</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white mb-6 leading-tight">
                Your Journey<br />
                <span className="gradient-text">Awaits</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Discover amazing destinations with AI-powered itineraries, real-time weather updates, and interactive maps. Plan the perfect trip effortlessly.
              </p>
            </div>

            {/* CTA Buttons */}
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full">
                    Start Planning Free
                  </Button>
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/itineraries/create" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Create New Trip
                  </Button>
                </Link>
              </div>
            )}

            {/* Social proof */}
            <div className="pt-4 text-white/60 text-sm">
              <p>Trusted by 10,000+ travelers worldwide</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
        <Container maxWidth="xl" className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to plan the perfect adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl p-8 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
        <Container maxWidth="xl" className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
              Simple Steps to<br />
              <span className="gradient-text">Your Perfect Trip</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={`step-${step.number}`} className="relative">
                {/* Line connector (hidden on mobile) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 left-1/2 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}

                {/* Step card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <Container maxWidth="xl" className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl font-semibold gradient-text mb-2">10K+</div>
            <p className="text-slate-600">Happy Travelers</p>
          </div>
          <div>
            <div className="text-5xl font-semibold gradient-text mb-2">50+</div>
            <p className="text-slate-600">Countries Covered</p>
          </div>
          <div>
            <div className="text-5xl font-semibold gradient-text mb-2">100K+</div>
            <p className="text-slate-600">Itineraries Created</p>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      {!isAuthenticated && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
          </div>

          <Container maxWidth="xl" className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers discovering amazing destinations with WanderWise
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Your Journey Today
              </Button>
            </Link>
          </Container>
        </section>
      )}
    </div>
  );
};

const features = [
  {
    id: 1,
    icon: <Zap size={32} className="text-white" />,
    title: "AI-Powered Planning",
    description: "Our advanced AI creates personalized itineraries based on your preferences, budget, and travel style.",
  },
  {
    id: 2,
    icon: <Cloud size={32} className="text-white" />,
    title: "Live Weather Data",
    description: "Real-time weather forecasts and alerts to help you pack right and plan activities perfectly.",
  },
  {
    id: 3,
    icon: <MapPin size={32} className="text-white" />,
    title: "Interactive Maps",
    description: "Explore destinations visually with beautiful maps, directions, and location-based recommendations.",
  },
];

const steps = [
  {
    number: 1,
    title: "Choose Destination",
    description: "Tell us where you want to go and your travel dates.",
  },
  {
    number: 2,
    title: "Set Preferences",
    description: "Customize your travel style, budget, and interests.",
  },
  {
    number: 3,
    title: "Get Itinerary",
    description: "Receive your personalized AI-generated travel plan.",
  },
  {
    number: 4,
    title: "Explore & Enjoy",
    description: "Use maps, weather, and guides on your trip.",
  },
];

export default Home;
