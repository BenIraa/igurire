
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export const MoMoPaymentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !fullName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount",
      });
      return;
    }

    // Create a pending transaction
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        amount: numAmount,
        user_id: user?.id,
        type: "deposit",
        status: "pending",
        payment_method: "momo",
        description: "Deposit via MTN Mobile Money",
      });

    if (transactionError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transaction",
      });
      return;
    }

    toast({
      title: "Payment Instructions",
      description: "Dial *182*8*1*594812# to complete your payment",
    });

    // Reset form
    setFullName("");
    setAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Funds</CardTitle>
      </CardHeader>
      <CardContent>
        {/* MoMo Code Display */}
        <div className="mb-6 p-4 bg-muted rounded-lg text-center">
          <h3 className="text-sm font-medium mb-2">MTN MoMo Payment Code</h3>
          <p className="text-2xl font-bold font-mono">*182*8*1*594812#</p>
          <p className="text-sm text-muted-foreground mt-2">
            Use this code to complete your MTN Mobile Money payment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (RWF)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <Button type="submit" className="w-full">
            Notify Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
