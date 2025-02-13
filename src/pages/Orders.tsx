
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  service_id: string;
  quantity: number;
  amount: number;
  status: string;
  target_url: string;
  api_order_id: string | null;
  api_response: any;
  service: {
    name: string;
    category: string;
  };
}

interface Transaction {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  status: string;
  description: string | null;
}

const statusColors = {
  pending: "bg-yellow-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  processing: "bg-blue-500",
};

const OrdersPage = () => {
  const { user } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          service:services(name, category)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
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

  // Set up real-time subscription for order updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Real-time update:", payload);
          // React Query will automatically update the UI
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Orders & Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                {ordersLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Order ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              {format(new Date(order.created_at), "PPp")}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.service.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {order.service.category}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>${order.amount}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} text-white`}
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.api_order_id || "Pending"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="transactions">
                {transactionsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : transactions?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions?.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(
                                new Date(transaction.created_at),
                                "PPp"
                              )}
                            </TableCell>
                            <TableCell className="capitalize">
                              {transaction.type}
                            </TableCell>
                            <TableCell>
                              ${Math.abs(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusColor(
                                  transaction.status
                                )} text-white`}
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrdersPage;
