
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Hero = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">
        Boost Your Social Media Presence
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        High-quality social media services at competitive prices
      </p>
      
      <div className="max-w-md mx-auto flex gap-2">
        <Input
          placeholder="Search services..."
          className="h-12"
        />
        <Button size="icon" className="h-12 w-12">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
