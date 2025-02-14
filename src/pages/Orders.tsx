
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/orders/OrdersTable";

interface Order {
  id: string;
  created_at: string;
  service_id: string;
  quantity: number;
  amount: number;
  status: string;
  target_url: string;
  api_order_id: string | null;
  service: {
    name: string;
    category: string;
  };
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

  const filterOrdersByStatus = (status: string) => {
    return orders?.filter(order => order.status === status) || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <OrdersTable
                  orders={orders}
                  isLoading={ordersLoading}
                  getStatusColor={getStatusColor}
                />
              </TabsContent>

              <TabsContent value="pending">
                <OrdersTable
                  orders={filterOrdersByStatus('pending')}
                  isLoading={ordersLoading}
                  getStatusColor={getStatusColor}
                />
              </TabsContent>

              <TabsContent value="processing">
                <OrdersTable
                  orders={filterOrdersByStatus('processing')}
                  isLoading={ordersLoading}
                  getStatusColor={getStatusColor}
                />
              </TabsContent>

              <TabsContent value="completed">
                <OrdersTable
                  orders={filterOrdersByStatus('completed')}
                  isLoading={ordersLoading}
                  getStatusColor={getStatusColor}
                />
              </TabsContent>

              <TabsContent value="failed">
                <OrdersTable
                  orders={filterOrdersByStatus('failed')}
                  isLoading={ordersLoading}
                  getStatusColor={getStatusColor}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrdersPage;
