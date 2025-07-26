import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";
import { 
  Home, 
  FileText, 
  Users, 
  DollarSign, 
  BookOpen, 
  Phone,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Link } from "wouter";

interface SidebarOption1Props {
  // No props needed - this will be the same navigation for all pages
}

export function SidebarOption1({}: SidebarOption1Props) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Case Studies", href: "/case-studies", icon: FileText },
    { name: "For HR Teams", href: "/hr", icon: Users },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-40 h-full w-64 transform transition-transform duration-200 ease-in-out
        bg-white border-r border-gray-200 shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <SafetySyncIcon size={32} />
              <div>
                <h1 className="text-lg font-bold text-blue-800">SafetySync.AI</h1>
                <p className="text-xs text-blue-500 -mt-1">OSHA Compliance</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a 
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3 text-blue-400 group-hover:text-emerald-600" />
                    {item.name}
                    <ChevronRight className="w-4 h-4 ml-auto text-blue-300 group-hover:text-emerald-600" />
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Client Login Button */}
        <div className="absolute bottom-8 left-4 right-4">
          <Link href="/client-portal">
            <Button 
              variant="outline" 
              className="w-full justify-center border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              onClick={() => setIsOpen(false)}
            >
              Client Login
            </Button>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}