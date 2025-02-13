
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [targetUrl, setTargetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOrder = (service: Service) => {
    setSelectedService(service);
    setQuantity(service.min_quantity);
  };

  const handlePlaceOrder = async () => {
    if (!selectedService || !user) return;

    if (quantity < selectedService.min_quantity || quantity > selectedService.max_quantity) {
      toast({
        variant: "destructive",
        title: "Invalid quantity",
        description: `Please enter a quantity between ${selectedService.min_quantity} and ${selectedService.max_quantity}`,
      });
      return;
    }

    if (!targetUrl) {
      toast({
        variant: "destructive",
        title: "Missing URL",
        description: "Please enter a target URL",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const amount = selectedService.price * quantity;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          service_id: selectedService.id,
          user_id: user.id,
          quantity,
          amount,
          target_url: targetUrl,
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and will be processed shortly.",
      });

      setSelectedService(null);
      setQuantity(0);
      setTargetUrl("");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: "There was an error placing your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <Sheet open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Place Order</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pt-4">
            {selectedService && (
              <>
                <div>
                  <Label htmlFor="service">Service</Label>
                  <Input
                    id="service"
                    value={selectedService.name}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">
                    Quantity (Min: {selectedService.min_quantity}, Max: {selectedService.max_quantity})
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min={selectedService.min_quantity}
                    max={selectedService.max_quantity}
                  />
                </div>
                <div>
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    type="url"
                    placeholder="https://..."
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <Input
                    value={`$${(selectedService.price * quantity).toFixed(2)}`}
                    disabled
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrdersPage;
