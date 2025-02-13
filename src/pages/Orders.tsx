
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { ServicesGrid } from "@/components/orders/ServicesGrid";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  min_quantity: number;
  max_quantity: number;
  active: boolean;
}

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
  const { toast } = useToast();

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("category");

      if (error) throw error;
      return data as Service[];
    },
  });

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

  const handleOrder = async (service: Service) => {
    toast({
      title: "Coming soon!",
      description: "Order placement will be implemented in the next update.",
    });
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Services & Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="services" className="space-y-4">
              <TabsList>
                <TabsTrigger value="services">Available Services</TabsTrigger>
                <TabsTrigger value="orders">My Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <ServicesGrid
                  services={services}
                  isLoading={servicesLoading}
                  onOrder={handleOrder}
                />
              </TabsContent>

              <TabsContent value="orders">
                <OrdersTable
                  orders={orders}
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
