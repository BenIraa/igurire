
import { ServiceCard } from "@/components/ServiceCard";
import { Loader2 } from "lucide-react";

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

interface ServicesGridProps {
  services: Service[] | undefined;
  isLoading: boolean;
  onOrder: (service: Service) => void;
}

export const ServicesGrid = ({ services, isLoading, onOrder }: ServicesGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!services?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No services available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          title={service.name}
          description={service.description || ""}
          price={service.price}
          category={service.category}
          onClick={() => onOrder(service)}
        />
      ))}
    </div>
  );
};
