import { Navigation } from "@/components/ui/navigation";
import { EnterpriseAnalytics } from "@/components/ui/enterprise-analytics";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation 
        onTrialClick={() => {}} 
        onDemoClick={() => {}} 
        onLoginClick={() => {}} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnterpriseAnalytics userTier="enterprise" companySize="large" />
      </div>
    </div>
  );
}