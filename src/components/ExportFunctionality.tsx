import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Download,
  FileText,
  FileJson,
  FileSpreadsheet,
  CheckCircle,
  Loader,
  Filter,
} from 'lucide-react';

interface ExportField {
  id: string;
  label: string;
  checked: boolean;
}

interface ExportFunctionalityProps {
  data: any[];
  filename?: string;
  onExport?: (format: string, fields: string[]) => void;
}

const ExportFunctionality = ({
  data,
  filename = 'audit-logs',
  onExport,
}: ExportFunctionalityProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const [fields, setFields] = useState<ExportField[]>([
    { id: 'timestamp', label: 'Timestamp', checked: true },
    { id: 'user', label: 'User', checked: true },
    { id: 'action', label: 'Action', checked: true },
    { id: 'resource', label: 'Resource', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'ipAddress', label: 'IP Address', checked: true },
    { id: 'details', label: 'Details', checked: false },
    { id: 'category', label: 'Category', checked: true },
  ]);

  const toggleField = (fieldId: string) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, checked: !field.checked } : field
      )
    );
  };

  const selectAllFields = () => {
    setFields(fields.map((field) => ({ ...field, checked: true })));
  };

  const deselectAllFields = () => {
    setFields(fields.map((field) => ({ ...field, checked: false })));
  };

  const exportToCSV = (data: any[], selectedFields: string[]) => {
    const headers = selectedFields.join(',');
    const rows = data.map((item) =>
      selectedFields
        .map((field) => {
          const value = item[field];
          if (value instanceof Date) {
            return `\"${value.toISOString()}\"`;
          }
          return `\"${String(value).replace(/\"/g, '\"\"')}\"`;
        })
        .join(',')
    );
    return `${headers}\n${rows.join('\n')}`;
  };

  const exportToJSON = (data: any[], selectedFields: string[]) => {
    const filteredData = data.map((item) => {
      const filtered: any = {};
      selectedFields.forEach((field) => {
        filtered[field] = item[field];
      });
      return filtered;
    });
    return JSON.stringify(filteredData, null, 2);
  };

  const downloadFile = (content: string, format: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    const selectedFields = fields.filter((f) => f.checked).map((f) => f.id);

    if (selectedFields.length === 0) {
      toast({
        title: 'No fields selected',
        description: 'Please select at least one field to export.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let content = '';
      let fileExtension = '';

      switch (exportFormat) {
        case 'csv':
          content = exportToCSV(data, selectedFields);
          fileExtension = 'csv';
          break;
        case 'json':
          content = exportToJSON(data, selectedFields);
          fileExtension = 'json';
          break;
        case 'pdf':
          toast({
            title: 'PDF Export',
            description: 'PDF export functionality coming soon!',
          });
          setIsExporting(false);
          return;
      }

      downloadFile(content, fileExtension);

      if (onExport) {
        onExport(exportFormat, selectedFields);
      }

      setExportSuccess(true);
      toast({
        title: 'Export successful',
        description: `${data.length} records exported as ${exportFormat.toUpperCase()}`,
      });

      setTimeout(() => {
        setOpen(false);
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'An error occurred while exporting data.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcons = {
    csv: FileSpreadsheet,
    json: FileJson,
    pdf: FileText,
  };

  const FormatIcon = formatIcons[exportFormat];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Audit Logs
          </DialogTitle>
          <DialogDescription>
            Choose export format and select fields to include in your export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format" className="text-sm font-medium">
              Export Format
            </Label>
            <Select
              value={exportFormat}
              onValueChange={(value: any) => setExportFormat(value)}
            >
              <SelectTrigger id="format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>CSV (Comma Separated)</span>
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    <span>JSON (JavaScript Object)</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF (Portable Document)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Select Fields
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllFields}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllFields}
                  className="h-7 text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-3">
                {fields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={field.id}
                      checked={field.checked}
                      onCheckedChange={() => toggleField(field.id)}
                    />
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {field.label}
                    </label>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {fields.filter((f) => f.checked).length} of {fields.length} selected
              </Badge>
              <span>•</span>
              <span>{data.length} records to export</span>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 gap-2"
              disabled={isExporting || exportSuccess}
            >
              <AnimatePresence mode="wait">
                {isExporting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader className="h-4 w-4 animate-spin" />
                  </motion.div>
                ) : exportSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <FormatIcon className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
              {isExporting
                ? 'Exporting...'
                : exportSuccess
                ? 'Exported!'
                : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportFunctionality;
