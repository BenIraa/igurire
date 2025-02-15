
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  BanknoteIcon,
  Banknote,
  CreditCard,
  Wallet,
} from "lucide-react";

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  type: string;
  status: string;
  payment_method: string;
  description: string | null;
}

const paymentMethods = [
  { id: "momo", name: "MTN Mobile Money", icon: Wallet },
  { id: "binance", name: "Binance Pay", icon: BanknoteIcon },
  { id: "paypal", name: "PayPal", icon: Banknote },
  { id: "visa", name: "Visa/Mastercard", icon: CreditCard },
];

const BalancePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("momo");

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

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
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
        payment_method: selectedMethod,
        description: `Deposit via ${selectedMethod.toUpperCase()}`,
      });

    if (transactionError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transaction",
      });
      return;
    }

    // For MTN MoMo, show the USSD code
    if (selectedMethod === "momo") {
      toast({
        title: "Payment Instructions",
        description: "Dial *182*8*1*594812# to complete your payment",
      });
    } else {
      toast({
        title: "Coming Soon",
        description: "This payment method will be available soon",
      });
    }

    // Reset form
    setFullName("");
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${profile?.balance.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          {/* Add Funds Form */}
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
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <method.icon className="h-4 w-4" />
                            <span>{method.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Add Funds
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.created_at), "PPp")}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">
                        {transaction.payment_method}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BalancePage;
