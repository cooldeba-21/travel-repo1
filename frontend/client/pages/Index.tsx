import LoginForm from "../components/auth/LoginForm"; // Ensure correct casing
import Hero from "../components/site/Hero";
import Services from "../components/site/Services";
import DestinationsGrid from "../components/site/DestinationsGrid";
import CTA from "../components/site/CTA";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
// import ConsentForm from "@/components/auth/ConsentForm";

export default function Index() {
  const { user, logout } = useAuth();
  // Always logout on mount to restart from login page
  useEffect(() => {
    logout();
  }, []);

  useEffect(() => {
    // Show login if not signed in, otherwise show main site
    if (user) {
      toast({
        title: "Welcome!",
        description: "Your travel assistant is ready.",
      });
    }
  }, [user]);

  return (
    <>
      <Toaster />
      {!user ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <LoginForm onSuccess={() => window.location.reload()} />
        </div>
      ) : (
        <main className="bg-background text-foreground">
          <Hero />
          <Services />
          <DestinationsGrid />
          <CTA />
        </main>
      )}
    </>
  );
}
