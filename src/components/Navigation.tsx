
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Menu, X, CreditCard, LayoutDashboard, History, Package } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Services', icon: Package, path: '/services' },
    { label: 'Orders', icon: History, path: '/orders' },
    { label: 'Balance', icon: CreditCard, path: '/balance' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 font-semibold text-xl">
            SMM Panel
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start space-x-2 mb-2"
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
