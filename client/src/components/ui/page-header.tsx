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

interface PageHeaderProps {
  // No props needed - this will be the same navigation for all pages
}

export function PageHeader({}: PageHeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "Case Studies", to: "/case-studies", icon: FileText },
    { name: "For HR Teams", to: "/hr", icon: Users },
    { name: "Pricing", to: "/pricing", icon: DollarSign },
    { name: "Contact", to: "/contact", icon: Phone },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-700/80 border border-blue-500 text-blue-800 hover:bg-blue-600/80 shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5 text-blue-800" /> : <Menu className="h-5 w-5 text-blue-800" />}
      </Button>

      {/* Hover-Based Icon Sidebar - Always Visible on Desktop */}
      <aside 
        className={`
          fixed left-0 top-0 z-40 h-full transition-all duration-300 ease-in-out
          bg-blue-900/90 backdrop-blur-sm border-r border-violet-500/30 shadow-2xl
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isHovered ? 'w-64' : 'w-16'}
          hover:w-64
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link to="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <SafetySyncIcon size={32} />
              {isHovered && (
                <div>
                  <h1 className="text-lg font-bold text-white">SafetySync.AI</h1>
                  <p className="text-xs text-violet-400 -mt-1">OSHA Compliance</p>
                </div>
              )}
            </div>
          </Link>
          
          {/* Remove collapse button since it's hover-based now */}
        </div>

        {/* Client Login Button - At Top */}
        <div className="mt-6 px-2">
          <Link to="/client-portal">
            <Button 
              className={`
                ${!isHovered ? 'w-12 h-12 p-0 justify-center' : 'w-full justify-start px-3'} 
                bg-violet-500 hover:bg-emerald-600 text-white font-bold border-2 border-emerald-700
                shadow-2xl transition-all duration-300 ring-2 ring-emerald-300/50
              `}
              onClick={() => setIsMobileOpen(false)}
              title={!isHovered ? "Client Login" : undefined}
            >
              <Users className={`${!isHovered ? 'w-6 h-6' : 'w-5 h-5 mr-3'} text-white flex-shrink-0 drop-shadow-lg`} />
              {isHovered && <span className="text-white font-bold">Client Login</span>}
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-2">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} to={item.to}>
                  <div 
                    className="flex items-center px-3 py-3 text-sm font-medium text-white rounded-lg tech-surface hover:text-violet-400 group relative cursor-pointer"
                    onClick={() => setIsMobileOpen(false)}
                    title={!isHovered ? item.name : undefined}
                  >
                    <IconComponent className="w-5 h-5 text-white group-hover:text-violet-400 flex-shrink-0" />
                    {isHovered && (
                      <span className="ml-3">{item.name}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!isHovered && (
                      <div className="absolute left-full ml-2 px-3 py-2 glass-panel text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>


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