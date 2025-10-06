import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Circle, Download, RotateCcw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'UI' | 'Functionality' | 'Performance' | 'Security' | 'Accessibility';
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'passed' | 'failed';
}

const initialChecklist: ChecklistItem[] = [
  // UI Testing
  {
    id: 'ui-1',
    title: 'Responsive Design',
    description: 'Verify layout adapts correctly across mobile, tablet, and desktop viewports',
    category: 'UI',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'ui-2',
    title: 'Color Contrast',
    description: 'Check text readability and WCAG compliance for color contrast ratios',
    category: 'UI',
    priority: 'Medium',
    status: 'pending'
  },
  {
    id: 'ui-3',
    title: 'Typography Consistency',
    description: 'Verify font sizes, weights, and line heights match design system',
    category: 'UI',
    priority: 'Low',
    status: 'pending'
  },
  {
    id: 'ui-4',
    title: 'Button States',
    description: 'Test hover, active, disabled, and focus states for all buttons',
    category: 'UI',
    priority: 'Medium',
    status: 'pending'
  },
  // Functionality Testing
  {
    id: 'func-1',
    title: 'Form Validation',
    description: 'Test all form fields with valid and invalid inputs',
    category: 'Functionality',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'func-2',
    title: 'Navigation Flow',
    description: 'Verify all navigation links and routing work correctly',
    category: 'Functionality',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'func-3',
    title: 'CRUD Operations',
    description: 'Test Create, Read, Update, Delete operations for all entities',
    category: 'Functionality',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'func-4',
    title: 'Search Functionality',
    description: 'Verify search returns accurate results and handles edge cases',
    category: 'Functionality',
    priority: 'Medium',
    status: 'pending'
  },
  {
    id: 'func-5',
    title: 'Filter & Sort',
    description: 'Test filtering and sorting mechanisms across data tables',
    category: 'Functionality',
    priority: 'Medium',
    status: 'pending'
  },
  // Performance Testing
  {
    id: 'perf-1',
    title: 'Page Load Time',
    description: 'Verify initial page load completes within 3 seconds',
    category: 'Performance',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'perf-2',
    title: 'Image Optimization',
    description: 'Check images are properly compressed and lazy-loaded',
    category: 'Performance',
    priority: 'Medium',
    status: 'pending'
  },
  {
    id: 'perf-3',
    title: 'API Response Time',
    description: 'Verify API calls complete within acceptable timeframes',
    category: 'Performance',
    priority: 'High',
    status: 'pending'
  },
  // Security Testing
  {
    id: 'sec-1',
    title: 'Authentication',
    description: 'Test login, logout, and session management',
    category: 'Security',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'sec-2',
    title: 'Authorization',
    description: 'Verify role-based access controls work correctly',
    category: 'Security',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'sec-3',
    title: 'Input Sanitization',
    description: 'Test protection against XSS and SQL injection',
    category: 'Security',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'sec-4',
    title: 'Data Encryption',
    description: 'Verify sensitive data is encrypted in transit and at rest',
    category: 'Security',
    priority: 'High',
    status: 'pending'
  },
  // Accessibility Testing
  {
    id: 'a11y-1',
    title: 'Keyboard Navigation',
    description: 'Verify all interactive elements are keyboard accessible',
    category: 'Accessibility',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'a11y-2',
    title: 'Screen Reader Support',
    description: 'Test with screen readers (NVDA, JAWS, VoiceOver)',
    category: 'Accessibility',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'a11y-3',
    title: 'ARIA Labels',
    description: 'Verify proper ARIA attributes for dynamic content',
    category: 'Accessibility',
    priority: 'Medium',
    status: 'pending'
  },
  {
    id: 'a11y-4',
    title: 'Focus Indicators',
    description: 'Check visible focus indicators on all interactive elements',
    category: 'Accessibility',
    priority: 'Medium',
    status: 'pending'
  }
];

export function TestingChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { toast } = useToast();

  const updateItemStatus = (id: string, status: 'passed' | 'failed') => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
    
    const item = checklist.find(i => i.id === id);
    toast({
      title: status === 'passed' ? 'Test Passed' : 'Test Failed',
      description: `${item?.title} marked as ${status}`,
      variant: status === 'passed' ? 'default' : 'destructive'
    });
  };

  const resetChecklist = () => {
    setChecklist(prev => prev.map(item => ({ ...item, status: 'pending' })));
    toast({
      title: 'Checklist Reset',
      description: 'All test items have been reset to pending status'
    });
  };

  const exportResults = () => {
    const results = checklist.map(item => ({
      title: item.title,
      category: item.category,
      priority: item.priority,
      status: item.status,
      description: item.description
    }));
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testing-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({
      title: 'Results Exported',
      description: 'Testing checklist results have been downloaded'
    });
  };

  const filteredChecklist = activeCategory === 'all' 
    ? checklist 
    : checklist.filter(item => item.category === activeCategory);

  const totalItems = checklist.length;
  const passedItems = checklist.filter(item => item.status === 'passed').length;
  const failedItems = checklist.filter(item => item.status === 'failed').length;
  const pendingItems = checklist.filter(item => item.status === 'pending').length;
  const completionPercentage = Math.round(((passedItems + failedItems) / totalItems) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Manual Testing Checklist</CardTitle>
            <CardDescription>Comprehensive testing checklist for quality assurance</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetChecklist}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Total Tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-500">{passedItems}</div>
              <p className="text-xs text-muted-foreground">Passed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">{failedItems}</div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">{pendingItems}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="UI">UI</TabsTrigger>
            <TabsTrigger value="Functionality">Function</TabsTrigger>
            <TabsTrigger value="Performance">Performance</TabsTrigger>
            <TabsTrigger value="Security">Security</TabsTrigger>
            <TabsTrigger value="Accessibility">A11y</TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredChecklist.map((item) => (
                  <Card key={item.id} className="border-l-4" style={{
                    borderLeftColor: item.status === 'passed' ? 'rgb(34, 197, 94)' : 
                                    item.status === 'failed' ? 'rgb(239, 68, 68)' : 
                                    'rgb(156, 163, 175)'
                  }}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{item.title}</h4>
                              <Badge variant={getPriorityColor(item.priority) as any}>
                                {item.priority}
                              </Badge>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={item.status === 'passed' ? 'default' : 'outline'}
                                onClick={() => updateItemStatus(item.id, 'passed')}
                                disabled={item.status === 'passed'}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Pass
                              </Button>
                              <Button
                                size="sm"
                                variant={item.status === 'failed' ? 'destructive' : 'outline'}
                                onClick={() => updateItemStatus(item.id, 'failed')}
                                disabled={item.status === 'failed'}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Fail
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {failedItems > 0 && (
          <div className="mt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed Tests Detected</AlertTitle>
              <AlertDescription>
                {failedItems} test{failedItems > 1 ? 's have' : ' has'} failed. Please review and address the issues before deployment.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}