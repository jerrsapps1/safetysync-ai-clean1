import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarOption1 } from "@/components/ui/sidebar-option1";
import { SidebarOption2 } from "@/components/ui/sidebar-option2";
import { SidebarOption3 } from "@/components/ui/sidebar-option3";

export default function SidebarDemoPage() {
  const [currentSidebar, setCurrentSidebar] = useState(1);

  const renderCurrentSidebar = () => {
    switch (currentSidebar) {
      case 1:
        return <SidebarOption1 />;
      case 2:
        return <SidebarOption2 />;
      case 3:
        return <SidebarOption3 />;
      default:
        return <SidebarOption1 />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {renderCurrentSidebar()}
      
      {/* Main Content */}
      <div className="md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8">
            Sidebar Navigation Options
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={`cursor-pointer transition-all ${currentSidebar === 1 ? 'ring-2 ring-emerald-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-lg">Option 1: Clean & Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-500 mb-4">
                  Clean white sidebar with simple navigation items and chevron arrows. 
                  Professional and minimalist design.
                </p>
                <Button 
                  variant={currentSidebar === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSidebar(1)}
                  className="w-full"
                >
                  {currentSidebar === 1 ? "Currently Active" : "View Option 1"}
                </Button>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${currentSidebar === 2 ? 'ring-2 ring-emerald-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-lg">Option 2: Branded & Rich</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-500 mb-4">
                  Emerald gradient background with rich navigation items including descriptions. 
                  More visual and branded approach.
                </p>
                <Button 
                  variant={currentSidebar === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSidebar(2)}
                  className="w-full"
                >
                  {currentSidebar === 2 ? "Currently Active" : "View Option 2"}
                </Button>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${currentSidebar === 3 ? 'ring-2 ring-emerald-500' : ''}`}>
              <CardHeader>
                <CardTitle className="text-lg">Option 3: Dark & Collapsible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-500 mb-4">
                  Dark theme sidebar with collapsible functionality. 
                  Modern dashboard-style with tooltips and space-saving design.
                </p>
                <Button 
                  variant={currentSidebar === 3 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSidebar(3)}
                  className="w-full"
                >
                  {currentSidebar === 3 ? "Currently Active" : "View Option 3"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Features Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Feature</th>
                      <th className="text-center py-2">Option 1</th>
                      <th className="text-center py-2">Option 2</th>
                      <th className="text-center py-2">Option 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Theme</td>
                      <td className="text-center">Clean White</td>
                      <td className="text-center">Emerald Gradient</td>
                      <td className="text-center">Dark Theme</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Collapsible</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Navigation Descriptions</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">❌</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Mobile Responsive</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Brand Consistency</td>
                      <td className="text-center">Good</td>
                      <td className="text-center">Excellent</td>
                      <td className="text-center">Modern</td>
                    </tr>
                    <tr>
                      <td className="py-2">Best For</td>
                      <td className="text-center">Simple Sites</td>
                      <td className="text-center">Marketing Sites</td>
                      <td className="text-center">Dashboards</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-2">Current Selection: Option {currentSidebar}</h3>
            <p className="text-emerald-700">
              {currentSidebar === 1 && "Clean and professional sidebar with simple navigation and clear hierarchy."}
              {currentSidebar === 2 && "Branded sidebar with rich visual elements and descriptive navigation items."}
              {currentSidebar === 3 && "Modern dark sidebar with collapsible functionality and space-saving design."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}