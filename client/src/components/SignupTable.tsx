import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Download, 
  Search, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Mail,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignupDetail {
  name: string;
  email: string;
  date: string;
  plan: string;
}

const PLAN_COLORS = {
  Basic: 'bg-blue-100 text-blue-800 border-blue-200',
  Pro: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Lifer: 'bg-amber-100 text-amber-800 border-amber-200',
  Enterprise: 'bg-purple-100 text-purple-800 border-purple-200'
};

export default function SignupTable() {
  const [signupData, setSignupData] = useState<SignupDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  const fetchSignupData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/signup-details');
      if (!response.ok) throw new Error('Failed to fetch signup details');
      
      const data = await response.json();
      setSignupData(data);
    } catch (error) {
      console.error('Error fetching signup details:', error);
      toast({
        title: "Error",
        description: "Failed to load signup details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignupData();
  }, []);

  // Filter data based on search and plan selection
  const filteredData = signupData.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = selectedPlan === 'All' || user.plan === selectedPlan;
    
    return matchesSearch && matchesPlan;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Plan statistics
  const planStats = ['Basic', 'Pro', 'Lifer', 'Enterprise'].map(plan => ({
    plan,
    count: signupData.filter(user => user.plan === plan).length
  }));

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Date', 'Plan'],
      ...filteredData.map(user => [
        user.name,
        user.email,
        user.date,
        user.plan
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signup-details-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${filteredData.length} signup records exported`,
    });
  };

  if (loading) {
    return (
      <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Signup Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Signup Details
          </h2>
          <p className="text-blue-200">
            {filteredData.length} of {signupData.length} users
          </p>
        </div>
        
        <Button
          onClick={exportData}
          variant="outline"
          size="sm"
          className="border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-blue-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Plan Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {planStats.map((stat) => (
          <Card key={stat.plan} className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stat.count}</div>
              <div className="text-blue-200 text-sm">{stat.plan} Users</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-blue-800/30 border-blue-600 text-white placeholder-blue-300"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-300" />
              <select
                value={selectedPlan}
                onChange={(e) => {
                  setSelectedPlan(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-blue-800/30 border border-blue-600 rounded-md px-3 py-2 text-white text-sm"
              >
                <option value="All">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Lifer">Lifer</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-700/50">
                  <TableHead className="text-blue-200 font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Name
                    </div>
                  </TableHead>
                  <TableHead className="text-blue-200 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </TableHead>
                  <TableHead className="text-blue-200 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="text-blue-200 font-medium">Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((user, index) => (
                  <TableRow key={index} className="border-blue-700/30 hover:bg-blue-800/30">
                    <TableCell className="text-white font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-blue-200">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-blue-200">
                      {new Date(user.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={PLAN_COLORS[user.plan as keyof typeof PLAN_COLORS]}
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-blue-200 text-sm">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-blue-200 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-white px-3 py-1 bg-blue-600 rounded text-sm">
                  {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-blue-200 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {filteredData.length === 0 && !loading && (
        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No signups found</h3>
            <p className="text-blue-200">
              Try adjusting your search terms or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}