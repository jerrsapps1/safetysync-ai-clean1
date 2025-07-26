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
  Menu,
  X,
  Dot
} from "lucide-react";
import { Link } from "wouter";

interface SidebarOption2Props {
  // No props needed - this will be the same navigation for all pages
}

export function SidebarOption2({}: SidebarOption2Props) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home, description: "Main dashboard" },
    { name: "Case Studies", href: "/case-studies", icon: FileText, description: "Success stories" },
    { name: "For HR Teams", href: "/hr", icon: Users, description: "HR solutions" },
    { name: "Pricing", href: "/pricing", icon: DollarSign, description: "Plans & pricing" },
    { name: "Resources", href: "/resources", icon: BookOpen, description: "Guides & templates" },
    { name: "Contact", href: "/contact", icon: Phone, description: "Get in touch" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/80 backdrop-blur-sm border border-blue-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-40 h-full w-72 transform transition-transform duration-300 ease-in-out
        bg-gradient-to-b from-emerald-50 to-white border-r border-emerald-200 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex flex-col items-center justify-center h-20 px-6 border-b border-emerald-200 bg-white/50">
          <Link href="/">
            <div className="flex flex-col items-center cursor-pointer">
              <SafetySyncIcon size={40} />
              <h1 className="text-xl font-bold text-blue-800 mt-2">SafetySync.AI</h1>
              <p className="text-xs text-emerald-600 font-medium">OSHA Compliance Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a 
                    className="flex items-start px-4 py-3 text-sm font-medium text-blue-600 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mt-0.5 mr-3 text-emerald-600" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-800 group-hover:text-emerald-700">
                        {item.name}
                      </div>
                      <div className="text-xs text-blue-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    <Dot className="w-4 h-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Client Login Section */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
            <p className="text-xs text-blue-500 mb-3 text-center">
              Already have an account?
            </p>
            <Link href="/client-portal">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setIsOpen(false)}
              >
                Client Login
              </Button>
            </Link>
          </div>
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