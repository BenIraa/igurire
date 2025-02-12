
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  category: string;
  onClick: () => void;
}

export const ServiceCard = ({ title, description, price, category, onClick }: ServiceCardProps) => {
  return (
    <Card className="w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 text-xl font-bold">
          ${price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClick} className="w-full">
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
};
