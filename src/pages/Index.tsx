
import { Navigation } from "@/components/Navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Instagram Followers",
    description: "High-quality Instagram followers delivered instantly",
    price: 9.99,
    category: "Instagram"
  },
  {
    id: 2,
    title: "YouTube Views",
    description: "Real YouTube views with high retention rate",
    price: 14.99,
    category: "YouTube"
  },
  {
    id: 3,
    title: "TikTok Likes",
    description: "Genuine TikTok likes from active users",
    price: 4.99,
    category: "TikTok"
  },
  {
    id: 4,
    title: "Twitter Retweets",
    description: "Boost your tweets with authentic retweets",
    price: 7.99,
    category: "Twitter"
  }
];

const Index = () => {
  const handleOrder = (serviceId: number) => {
    console.log("Ordering service:", serviceId);
    // Add order functionality here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">
            Boost Your Social Media Presence
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            High-quality social media services at competitive prices
          </p>
          
          {/* Search Bar */}
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              price={service.price}
              category={service.category}
              onClick={() => handleOrder(service.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
