import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

export default function BackupRecovery() {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  const backupSchedules = [
    {
      id: 1,
      name: "Daily Employee Data",
      type: "automatic",
      frequency: "Daily at 2:00 AM",
      lastRun: "2025-01-08 02:00:00",
      nextRun: "2025-01-09 02:00:00",
      status: "active",
      size: "2.3 GB",
      retention: "30 days"
    },
    {
      id: 2,
      name: "Weekly Compliance Reports",
      type: "automatic",
      frequency: "Weekly on Sunday",
      lastRun: "2025-01-05 03:00:00",
      nextRun: "2025-01-12 03:00:00",
      status: "active",
      size: "1.8 GB",
      retention: "90 days"
    },
    {
      id: 3,
      name: "Monthly Archive",
      type: "automatic",
      frequency: "Monthly on 1st",
      lastRun: "2025-01-01 04:00:00",
      nextRun: "2025-02-01 04:00:00",
      status: "active",
      size: "15.2 GB",
      retention: "1 year"
    }
  ];

  const backupHistory = [
    {
      id: "bk_20250108_020000",
      name: "Daily Employee Data",
      date: "2025-01-08 02:00:00",
      size: "2.3 GB",
      status: "completed",
      type: "automatic",
      duration: "4m 32s",
      location: "AWS S3 - us-east-1"
    },
    {
      id: "bk_20250107_020000",
      name: "Daily Employee Data",
      date: "2025-01-07 02:00:00",
      size: "2.2 GB",
      status: "completed",
      type: "automatic",
      duration: "4m 18s",
      location: "AWS S3 - us-east-1"
    },
    {
      id: "bk_20250106_143000",
      name: "Manual System Backup",
      date: "2025-01-06 14:30:00",
      size: "8.7 GB",
      status: "completed",
      type: "manual",
      duration: "12m 45s",
      location: "AWS S3 - us-east-1"
    },
    {
      id: "bk_20250105_030000",
      name: "Weekly Compliance Reports",
      date: "2025-01-05 03:00:00",
      size: "1.8 GB",
      status: "completed",
      type: "automatic",
      duration: "3m 22s",
      location: "AWS S3 - us-east-1"
    },
    {
      id: "bk_20250104_020000",
      name: "Daily Employee Data",
      date: "2025-01-04 02:00:00",
      size: "2.1 GB",
      status: "failed",
      type: "automatic",
      duration: "0m 45s",
      location: "AWS S3 - us-east-1",
      error: "Network timeout during upload"
    }
  ];

  const recoveryPoints = [
    {
      id: "rp_20250108_020000",
      name: "Complete System State",
      date: "2025-01-08 02:00:00",
      type: "full",
      size: "12.4 GB",
      status: "verified",
      rto: "< 2 hours",
      rpo: "< 1 hour"
    },
    {
      id: "rp_20250107_020000",
      name: "Employee Data Snapshot",
      date: "2025-01-07 02:00:00",
      type: "incremental",
      size: "450 MB",
      status: "verified",
      rto: "< 30 minutes",
      rpo: "< 1 hour"
    },
    {
      id: "rp_20250106_020000",
      name: "Complete System State",
      date: "2025-01-06 02:00:00",
      type: "full",
      size: "12.1 GB",
      status: "verified",
      rto: "< 2 hours",
      rpo: "< 1 hour"
    }
  ];

  const handleManualBackup = () => {
    setIsBackupRunning(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestore = (backupId: string) => {
    setSelectedBackup(backupId);
    // Restore logic would go here
    console.log(`Restoring from backup: ${backupId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Backup & Recovery</h1>
          </div>
          <p className="text-white max-w-2xl mx-auto">
            Enterprise-grade backup and disaster recovery for your safety compliance data
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white">Total Backups</p>
                  <p className="text-xl font-bold text-white">247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-white">Success Rate</p>
                  <p className="text-xl font-bold text-white">99.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-white">Last Backup</p>
                  <p className="text-xl font-bold text-white">2h ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-white">Storage Used</p>
                  <p className="text-xl font-bold text-white">47.3 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedules" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-900/60 backdrop-blur-sm">
            <TabsTrigger value="schedules">Backup Schedules</TabsTrigger>
            <TabsTrigger value="history">Backup History</TabsTrigger>
            <TabsTrigger value="recovery">Recovery Points</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Automated Backup Schedules</h2>
              <Button 
                onClick={handleManualBackup}
                disabled={isBackupRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isBackupRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Backing Up...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Manual Backup
                  </>
                )}
              </Button>
            </div>

            {isBackupRunning && (
              <Alert className="bg-blue-900/50 border-blue-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">
                  Manual backup in progress: {backupProgress}% complete
                  <Progress value={backupProgress} className="mt-2" />
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              {backupSchedules.map((schedule) => (
                <Card key={schedule.id} className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{schedule.name}</CardTitle>
                        <p className="text-sm text-white">{schedule.frequency}</p>
                      </div>
                      <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-white">Last Run</p>
                        <p className="text-white">{schedule.lastRun}</p>
                      </div>
                      <div>
                        <p className="text-white">Next Run</p>
                        <p className="text-white">{schedule.nextRun}</p>
                      </div>
                      <div>
                        <p className="text-white">Backup Size</p>
                        <p className="text-white">{schedule.size}</p>
                      </div>
                      <div>
                        <p className="text-white">Retention</p>
                        <p className="text-white">{schedule.retention}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-white border-white/30">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="text-white border-white/30">
                        <Play className="w-4 h-4 mr-1" />
                        Run Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Backup History</h2>
            <div className="space-y-3">
              {backupHistory.map((backup) => (
                <Card key={backup.id} className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{backup.name}</h3>
                          <Badge variant={backup.status === 'completed' ? 'default' : 'destructive'}>
                            {backup.status}
                          </Badge>
                          <Badge variant="outline" className="text-white">
                            {backup.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-white">Date</p>
                            <p className="text-white">{backup.date}</p>
                          </div>
                          <div>
                            <p className="text-white">Size</p>
                            <p className="text-white">{backup.size}</p>
                          </div>
                          <div>
                            <p className="text-white">Duration</p>
                            <p className="text-white">{backup.duration}</p>
                          </div>
                          <div>
                            <p className="text-white">Location</p>
                            <p className="text-white">{backup.location}</p>
                          </div>
                        </div>
                        {backup.error && (
                          <Alert className="mt-2 bg-red-900/50 border-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-white">
                              {backup.error}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-white border-white/30"
                          onClick={() => handleRestore(backup.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Recovery Points</h2>
            <div className="space-y-3">
              {recoveryPoints.map((point) => (
                <Card key={point.id} className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{point.name}</h3>
                          <Badge variant={point.type === 'full' ? 'default' : 'secondary'}>
                            {point.type}
                          </Badge>
                          <Badge variant="outline" className="text-green-300">
                            {point.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-white">Date</p>
                            <p className="text-white">{point.date}</p>
                          </div>
                          <div>
                            <p className="text-white">Size</p>
                            <p className="text-white">{point.size}</p>
                          </div>
                          <div>
                            <p className="text-white">RTO</p>
                            <p className="text-white">{point.rto}</p>
                          </div>
                          <div>
                            <p className="text-white">RPO</p>
                            <p className="text-white">{point.rpo}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleRestore(point.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Backup & Recovery Settings</h2>
            <div className="grid gap-4">
              <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Storage Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white">Primary Storage</label>
                      <p className="text-white">AWS S3 - us-east-1</p>
                    </div>
                    <div>
                      <label className="text-sm text-white">Backup Storage</label>
                      <p className="text-white">AWS S3 - us-west-2</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white">Encryption</label>
                      <p className="text-white">AES-256</p>
                    </div>
                    <div>
                      <label className="text-sm text-white">Compression</label>
                      <p className="text-white">Enabled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Retention Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-white">Daily Backups</label>
                      <p className="text-white">30 days</p>
                    </div>
                    <div>
                      <label className="text-sm text-white">Weekly Backups</label>
                      <p className="text-white">12 weeks</p>
                    </div>
                    <div>
                      <label className="text-sm text-white">Monthly Backups</label>
                      <p className="text-white">12 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" defaultChecked />
                      Email notifications for backup failures
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" defaultChecked />
                      Daily backup completion reports
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" />
                      SMS alerts for critical failures
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}