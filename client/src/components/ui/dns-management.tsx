import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Shield, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Settings,
  Monitor,
  Lock
} from "lucide-react";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  comment: string;
  status?: 'active' | 'pending' | 'error';
}

interface DNSStatus {
  domain: string;
  propagated: boolean;
  ssl_status: 'valid' | 'invalid' | 'pending';
  uptime: number;
  last_checked: string;
}

export function DNSManagement() {
  const { toast } = useToast();
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [dnsStatus, setDnsStatus] = useState<DNSStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState("safetysync.ai");
  const [serverIP, setServerIP] = useState("");

  // Load DNS configuration
  useEffect(() => {
    loadDNSConfiguration();
    checkDNSStatus();
  }, []);

  const loadDNSConfiguration = async () => {
    setIsLoading(true);
    try {
      // Simulate loading DNS records (in production, this would fetch from API)
      const mockRecords: DNSRecord[] = [
        {
          type: "A",
          name: "@",
          value: "YOUR_SERVER_IP",
          ttl: 300,
          comment: "Primary domain A record",
          status: "pending"
        },
        {
          type: "A",
          name: "app",
          value: "YOUR_SERVER_IP", 
          ttl: 300,
          comment: "Main application subdomain",
          status: "active"
        },
        {
          type: "A",
          name: "api",
          value: "YOUR_SERVER_IP",
          ttl: 300,
          comment: "API endpoint subdomain",
          status: "active"
        },
        {
          type: "CNAME",
          name: "www",
          value: "@",
          ttl: 300,
          comment: "WWW redirect to primary domain",
          status: "active"
        },
        {
          type: "TXT",
          name: "@",
          value: "v=spf1 include:_spf.google.com ~all",
          ttl: 300,
          comment: "SPF record for email authentication",
          status: "active"
        },
        {
          type: "TXT",
          name: "_dmarc",
          value: "v=DMARC1; p=quarantine; rua=mailto:admin@safetysync.ai",
          ttl: 300,
          comment: "DMARC policy for email security",
          status: "active"
        },
        {
          type: "CAA",
          name: "@",
          value: "0 issue \"letsencrypt.org\"",
          ttl: 300,
          comment: "Certificate Authority Authorization",
          status: "active"
        }
      ];
      
      setDnsRecords(mockRecords);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load DNS configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDNSStatus = async () => {
    try {
      // Simulate DNS status check
      const mockStatus: DNSStatus = {
        domain: "safetysync.ai",
        propagated: true,
        ssl_status: "valid",
        uptime: 99.9,
        last_checked: new Date().toISOString()
      };
      
      setDnsStatus(mockStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check DNS status",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string, recordType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRecord(`${recordType}-${text}`);
      toast({
        title: "Copied!",
        description: "DNS record copied to clipboard",
      });
      
      setTimeout(() => setCopiedRecord(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const updateServerIP = () => {
    if (!serverIP) {
      toast({
        title: "Error",
        description: "Please enter a valid server IP address",
        variant: "destructive"
      });
      return;
    }

    const updatedRecords = dnsRecords.map(record => {
      if (record.type === "A" && record.value === "YOUR_SERVER_IP") {
        return { ...record, value: serverIP, status: "pending" as const };
      }
      return record;
    });

    setDnsRecords(updatedRecords);
    toast({
      title: "Success",
      description: "DNS records updated with new server IP",
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "A": return "bg-blue-100 text-blue-800";
      case "CNAME": return "bg-green-100 text-green-800";
      case "TXT": return "bg-purple-100 text-purple-800";
      case "MX": return "bg-orange-100 text-orange-800";
      case "CAA": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-800">DNS Management</h2>
          <p className="text-blue-500">Configure and monitor DNS records for SafetySync.AI</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={checkDNSStatus} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          <Button onClick={loadDNSConfiguration}>
            <Settings className="w-4 h-4 mr-2" />
            Reload Config
          </Button>
        </div>
      </div>

      {/* DNS Status Overview */}
      {dnsStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              DNS Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${dnsStatus.propagated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  DNS Propagation: {dnsStatus.propagated ? 'Complete' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className={`w-4 h-4 ${dnsStatus.ssl_status === 'valid' ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-sm">
                  SSL Status: {dnsStatus.ssl_status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  Uptime: {dnsStatus.uptime}%
                </span>
              </div>
              <div className="text-sm text-blue-400">
                Last checked: {new Date(dnsStatus.last_checked).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">DNS Records</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="ssl">SSL Certificates</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current DNS Records</CardTitle>
              <p className="text-sm text-blue-500">
                Configure these records with your DNS provider
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dnsRecords.map((record, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <Badge className={getRecordTypeColor(record.type)}>
                          {record.type}
                        </Badge>
                      </div>
                      <div className="font-mono text-sm">
                        {record.name || '@'}
                      </div>
                      <div className="font-mono text-sm break-all">
                        {record.value}
                      </div>
                      <div className="text-sm text-blue-400">
                        TTL: {record.ttl}
                      </div>
                      <div>
                        {getStatusBadge(record.status)}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(record.value, record.type)}
                        >
                          {copiedRecord === `${record.type}-${record.value}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="domain">Custom Domain</Label>
                <Input
                  id="domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="safetysync.ai"
                />
              </div>
              <div>
                <Label htmlFor="serverip">Server IP Address</Label>
                <div className="flex space-x-2">
                  <Input
                    id="serverip"
                    value={serverIP}
                    onChange={(e) => setServerIP(e.target.value)}
                    placeholder="e.g., 192.168.1.100"
                  />
                  <Button onClick={updateServerIP}>
                    Update Records
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Run DNS Setup Script</h4>
                  <div className="bg-blue-100 p-3 rounded font-mono text-sm">
                    chmod +x scripts/dns-setup.sh && ./scripts/dns-setup.sh
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Let's Encrypt SSL Certificate</h4>
                  <div className="bg-blue-100 p-3 rounded font-mono text-sm">
                    sudo certbot certonly --dns-cloudflare -d {customDomain} -d *.{customDomain}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                SSL Certificate Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Wildcard Certificate</h4>
                    <p className="text-sm text-blue-500">*.safetysync.ai</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-green-500">Valid</Badge>
                    <span className="text-sm text-blue-400">Expires: 2025-10-06</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Primary Certificate</h4>
                    <p className="text-sm text-blue-500">safetysync.ai</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-green-500">Valid</Badge>
                    <span className="text-sm text-blue-400">Expires: 2025-10-06</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                DNS Monitoring & Health Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">app.safetysync.ai</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Online - 200ms</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">api.safetysync.ai</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Online - 150ms</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">admin.safetysync.ai</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Online - 180ms</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">docs.safetysync.ai</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Online - 120ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => window.open('https://dns-configuration-guide.md', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Guide
            </Button>
            <Button variant="outline" onClick={() => window.open('/scripts/dns-setup.sh', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Download Setup Script
            </Button>
            <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(dnsRecords, null, 2), 'all')}>
              <Copy className="w-4 h-4 mr-2" />
              Copy All Records
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}