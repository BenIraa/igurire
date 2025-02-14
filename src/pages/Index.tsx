
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { Hero } from "@/components/home/Hero";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {!user ? (
          <div className="max-w-md mx-auto mb-12">
            <h1 className="text-4xl font-bold text-center mb-8">
              Boost Your Social Media Presence
            </h1>
            <AuthForm />
          </div>
        ) : (
          <Hero />
        )}
      </main>
    </div>
  );
};

export default Index;
