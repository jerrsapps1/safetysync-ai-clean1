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
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarOption3Props {
  // No props needed - this will be the same navigation for all pages
}

export function SidebarOption3({}: SidebarOption3Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "Case Studies", to: "/case-studies", icon: FileText },
    { name: "For HR Teams", to: "/hr", icon: Users },
    { name: "Pricing", to: "/pricing", icon: DollarSign },
    { name: "Resources", to: "/resources", icon: BookOpen },
    { name: "Contact", to: "/contact", icon: Phone },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-900 shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-40 h-full transform transition-all duration-300 ease-in-out
        bg-blue-800 border-r border-blue-700 shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
          <Link to="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <SafetySyncIcon size={32} />
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-white">SafetySync.AI</h1>
                  <p className="text-xs text-violet-400 -mt-1">OSHA Compliance</p>
                </div>
              )}
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-blue-100 hover:text-blue-200 hover:bg-blue-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ArrowRight className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-2">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} to={item.to}>
                  <div 
                    className="flex items-center px-3 py-3 text-sm font-medium text-white rounded-lg hover:bg-blue-700 hover:text-violet-400 transition-colors group relative cursor-pointer"
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <IconComponent className="w-5 h-5 text-white group-hover:text-violet-400 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3">{item.name}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-blue-700 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Client Login Button */}
        <div className="absolute bottom-6 left-2 right-2">
          <Link to="/client-portal">
            <Button 
              variant={isCollapsed ? "ghost" : "default"}
              size={isCollapsed ? "sm" : "default"}
              className={`
                ${isCollapsed ? 'w-12 h-12 p-0' : 'w-full'} 
                bg-emerald-600 hover:bg-emerald-700 text-white
              `}
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? "Client Login" : undefined}
            >
              {isCollapsed ? (
                <Users className="w-5 h-5" />
              ) : (
                "Client Login"
              )}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}