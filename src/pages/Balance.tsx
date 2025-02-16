
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { BalanceCard } from "@/components/balance/BalanceCard";
import { MoMoPaymentForm } from "@/components/balance/MoMoPaymentForm";
import { TransactionHistory } from "@/components/balance/TransactionHistory";
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid gap-8 md:grid-cols-2">
          <BalanceCard balance={profile?.balance || 0} />
          <MoMoPaymentForm />
        </div>

        <TransactionHistory transactions={transactions || []} />
      </main>
    </div>
  );
};

export default BalancePage;
