
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesGrid } from "@/components/orders/ServicesGrid";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { OrderForm } from "@/components/orders/OrderForm";

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

const ServicesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

  const handleOrder = (service: Service) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to place orders.",
      });
      return;
    }
    setSelectedService(service);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ServicesGrid
              services={services}
              isLoading={servicesLoading}
              onOrder={handleOrder}
            />
          </CardContent>
        </Card>
      </main>

      <OrderForm 
        selectedService={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default ServicesPage;
