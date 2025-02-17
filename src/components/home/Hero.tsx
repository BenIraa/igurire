
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Hero = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">
        Boost Your Social Media Presence
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        High-quality social media services at competitive prices
      </p>
      
      <div className="max-w-md mx-auto flex gap-2 mb-8">
        <Input
          placeholder="Search services..."
          className="h-12"
        />
        <Button size="icon" className="h-12 w-12">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 mb-12">
        <Button variant="ghost" size="icon" className="rounded-full hover:text-pink-500">
          <Instagram className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:text-blue-400">
          <Twitter className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:text-blue-600">
          <Facebook className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:text-red-600">
          <Youtube className="h-6 w-6" />
        </Button>
        {/* Custom TikTok SVG icon since Lucide doesn't provide one */}
        <Button variant="ghost" size="icon" className="rounded-full hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        </Button>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {/* Cheapest */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-shadow">
          <div className="text-green-600 font-semibold text-lg mb-2">Cheapest</div>
          <p className="text-sm text-green-700">Best prices for your social media growth</p>
          <Badge variant="secondary" className="mt-4 bg-green-100 text-green-700">
            Save up to 50%
          </Badge>
        </div>

        {/* Best Recommended */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
          <div className="text-blue-600 font-semibold text-lg mb-2">Best Recommended</div>
          <p className="text-sm text-blue-700">Top-rated services by our customers</p>
          <Badge variant="secondary" className="mt-4 bg-blue-100 text-blue-700">
            Highly Rated
          </Badge>
        </div>

        {/* Black Friday */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
          <div className="text-purple-600 font-semibold text-lg mb-2">Black Friday</div>
          <p className="text-sm text-purple-700">Special deals and discounts</p>
          <Badge variant="secondary" className="mt-4 bg-purple-100 text-purple-700">
            Limited Time
          </Badge>
        </div>
      </div>
    </div>
  );
};
