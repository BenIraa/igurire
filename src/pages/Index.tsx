
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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col md:flex-row items-center justify-center space-x-8 md:space-x-8 md:space-y-0">
        
        {!user ? (
          <>
          <div className="p-6 w-full md:w-1/2">
          <div className="max-w-md mx-auto mb-12">
            <p className="text-white text-xl font-bold  mt-7 mb-7">
              iGurire Followers <p className="text-xl">For all social media platfoarms</p>
            </p>
            <AuthForm />
          </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center p-6">
              <img src="https://mediainitiation.com/wp-content/uploads/2024/10/nIQ-improve-performance.webp" alt="Background" className="rounded-lg" />
          </div>
         
          </>
        ) : (
         <div className="w-full flex flex-col items-center justify-center p-6">
          <h1 className="text-5xl font-bold text-white mb-8">welcome to iGurire</h1>
          <p className="text-xl text-white mb-4">thank you for logging in. explore our services</p>

         </div>
        )}
        
      
      </main>
    </div>
  );
};

export default Index;