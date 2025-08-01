import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string | null;
  created_at: string;
}

export default function LeadsPage() {
  const { data: leads, isLoading, error } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <div className="text-white text-xl">Error loading leads</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Contact Form Leads
        </h1>
        
        <div className="grid gap-6">
          {leads?.map((lead) => (
            <Card key={lead.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  <span>{lead.name}</span>
                  <span className="text-sm font-normal text-blue-100">
                    {new Date(lead.created_at).toLocaleDateString()} at{' '}
                    {new Date(lead.created_at).toLocaleTimeString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white space-y-2">
                <p><strong>Email:</strong> {lead.email}</p>
                {lead.company && (
                  <p><strong>Company:</strong> {lead.company}</p>
                )}
                {lead.role && (
                  <p><strong>Role:</strong> {lead.role}</p>
                )}
                {lead.message && (
                  <div>
                    <strong>Message:</strong>
                    <p className="mt-1 text-blue-100">{lead.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {leads?.length === 0 && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="text-center py-12">
                <p className="text-white text-xl">No leads submitted yet</p>
                <p className="text-blue-100 mt-2">Contact form submissions will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}