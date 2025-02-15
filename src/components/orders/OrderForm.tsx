
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface OrderFormProps {
  selectedService: Service | null;
  onClose: () => void;
}

export const OrderForm = ({ selectedService, onClose }: OrderFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(selectedService?.min_quantity || 0);
  const [targetUrl, setTargetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      onClose();
      navigate('/orders');
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

  return (
    <Sheet open={!!selectedService} onOpenChange={(open) => !open && onClose()}>
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
                  value={`${(selectedService.price * quantity).toLocaleString()} RWF`}
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
  );
};
