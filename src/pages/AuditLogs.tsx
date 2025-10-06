import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Search, Filter, Calendar as CalendarIcon, User, Activity, Database, Settings, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ExportFunctionality from '@/components/ExportFunctionality';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'failure' | 'warning' | 'info';
  ipAddress: string;
  details: string;
  category: 'authentication' | 'transaction' | 'data_access' | 'configuration' | 'security';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T10:30:00'),
    user: 'john.doe@example.com',
    action: 'User Login',
    resource: 'Authentication System',
    status: 'success',
    ipAddress: '192.168.1.100',
    details: 'Successful login from Chrome browser',
    category: 'authentication',
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T10:35:00'),
    user: 'jane.smith@example.com',
    action: 'Transaction Created',
    resource: 'Transaction #12345',
    status: 'success',
    ipAddress: '192.168.1.101',
    details: 'Created new transaction worth $1,250.00',
    category: 'transaction',
  },
  {
    id: '3',
    timestamp: new Date('2024-01-15T10:40:00'),
    user: 'admin@example.com',
    action: 'Settings Updated',
    resource: 'System Configuration',
    status: 'warning',
    ipAddress: '192.168.1.1',
    details: 'Modified security settings - 2FA requirement enabled',
    category: 'configuration',
  },
  {
    id: '4',
    timestamp: new Date('2024-01-15T10:45:00'),
    user: 'bob.wilson@example.com',
    action: 'Failed Login Attempt',
    resource: 'Authentication System',
    status: 'failure',
    ipAddress: '203.0.113.42',
    details: 'Invalid password - 3rd attempt',
    category: 'security',
  },
  {
    id: '5',
    timestamp: new Date('2024-01-15T10:50:00'),
    user: 'alice.johnson@example.com',
    action: 'Data Export',
    resource: 'Customer Database',
    status: 'info',
    ipAddress: '192.168.1.102',
    details: 'Exported 500 customer records to CSV',
    category: 'data_access',
  },
  {
    id: '6',
    timestamp: new Date('2024-01-15T11:00:00'),
    user: 'charlie.brown@example.com',
    action: 'Transaction Deleted',
    resource: 'Transaction #12340',
    status: 'warning',
    ipAddress: '192.168.1.103',
    details: 'Deleted transaction - requires approval',
    category: 'transaction',
  },
];

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const statusIcons = {
    success: CheckCircle,
    failure: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const statusColors = {
    success: 'text-green-500',
    failure: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const categoryIcons = {
    authentication: User,
    transaction: Activity,
    data_access: Database,
    configuration: Settings,
    security: Shield,
  };

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;

    const matchesDateRange =
      !dateRange.from ||
      !dateRange.to ||
      (log.timestamp >= dateRange.from && log.timestamp <= dateRange.to);

    return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Audit Logs
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and track all system activities and user actions
            </p>
          </div>
          <ExportFunctionality data={filteredLogs} filename="audit-logs" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Monitor</CardTitle>
            <CardDescription>
              View detailed logs of all system activities, user actions, and security events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="transaction">Transaction</SelectItem>
                    <SelectItem value="data_access">Data Access</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !dateRange.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) =>
                        setDateRange({ from: range?.from, to: range?.to })
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Results Summary */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>
                  Showing {filteredLogs.length} of {mockAuditLogs.length} logs
                </span>
              </div>

              {/* Logs Table */}
              <ScrollArea className="h-[600px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const StatusIcon = statusIcons[log.status];
                      const CategoryIcon = categoryIcons[log.category];
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">
                            {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{log.user}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.resource}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn('gap-1', statusColors[log.status])}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1">
                              <CategoryIcon className="h-3 w-3" />
                              {log.category.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuditLogs;
