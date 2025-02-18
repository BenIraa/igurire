
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { Hero } from "@/components/home/Hero";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const referralCode = searchParams.get("ref");

  useEffect(() => {
    const handleReferral = async () => {
      if (!user || !referralCode) return;

      try {
        // Get referrer's profile
        const { data: referrer } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", referralCode)
          .single();

        if (!referrer) {
          throw new Error("Invalid referral code");
        }

        // Create referral
        const { error } = await supabase
          .from("referrals")
          .insert({
            referrer_id: referrer.id,
            referred_id: user.id,
          });

        if (error) {
          if (error.code === "23505") { // Unique violation
            return; // User already referred
          }
          throw error;
        }

        toast({
          title: "Welcome!",
          description: "You've been successfully referred. Your referrer will receive their bonus.",
        });
      } catch (error) {
        console.error("Referral error:", error);
      }
    };

    handleReferral();
  }, [user, referralCode, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {!user ? (
          <div className="max-w-md mx-auto mb-12">
            <h1 className="text-4xl font-bold text-center mb-7">
              Boost Your Social Media Presence
            </h1>
            <AuthForm />
          </div>
        ) : (
          <Hero />
        )}
      </main>
    </div>
  );
};

export default Index;