
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { BalanceCard } from "@/components/balance/BalanceCard";
import { MoMoPaymentForm } from "@/components/balance/MoMoPaymentForm";
import { TransactionHistory } from "@/components/balance/TransactionHistory";
import { ReferralCard } from "@/components/balance/ReferralCard";
import type { Transaction } from "@/types/transaction";

const BalancePage = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const { data: referrals } = useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user?.id);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid gap-8 md:grid-cols-2">
          <BalanceCard balance={profile?.balance || 0} />
          <ReferralCard 
            referralCode={profile?.referral_code || ""} 
            referralCount={referrals?.length || 0}
          />
        </div>

        <div className="mt-8">
          <MoMoPaymentForm />
        </div>

        <TransactionHistory transactions={transactions || []} />
      </main>
    </div>
  );
};

export default BalancePage;
