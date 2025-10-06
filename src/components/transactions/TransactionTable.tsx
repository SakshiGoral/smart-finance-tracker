import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  currency?: string;
  exchangeRate?: number;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Salary', category: 'salary', type: 'income', amount: 5000, currency: 'USD' },
  { id: '2', date: '2024-01-14', description: 'Grocery Shopping', category: 'food', type: 'expense', amount: 150, currency: 'USD' },
  { id: '3', date: '2024-01-13', description: 'Netflix', category: 'entertainment', type: 'expense', amount: 15, currency: 'USD' },
  { id: '4', date: '2024-01-12', description: 'Freelance', category: 'salary', type: 'income', amount: 800, currency: 'EUR', exchangeRate: 1.09 },
  { id: '5', date: '2024-01-11', description: 'Gas', category: 'transport', type: 'expense', amount: 45, currency: 'USD' },
  { id: '6', date: '2024-01-10', description: 'Restaurant', category: 'food', type: 'expense', amount: 65, currency: 'USD' },
  { id: '7', date: '2024-01-09', description: 'Uber', category: 'transport', type: 'expense', amount: 25, currency: 'USD' },
  { id: '8', date: '2024-01-08', description: 'Shopping', category: 'shopping', type: 'expense', amount: 120, currency: 'GBP', exchangeRate: 1.27 },
];

interface TransactionTableProps {
  searchQuery: string;
  filterType: string;
  filterCategory: string;
}

export default function TransactionTable({ searchQuery, filterType, filterCategory }: TransactionTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const convertCurrency = (amount: number, currency: string, exchangeRate?: number) => {
    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    
    const symbol = currencySymbols[currency] || currency;
    
    if (currency === 'USD') {
      return `${symbol}${amount.toLocaleString()}`;
    }
    
    if (exchangeRate) {
      return `${symbol}${amount.toLocaleString()} ($${(amount * exchangeRate).toFixed(2)})`;
    }
    
    return `${symbol}${amount.toLocaleString()}`;
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => 
        `${t.date},${t.description},${t.category},${t.type},${t.amount},${t.currency || 'USD'}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    
    toast({
      title: '📊 CSV Export Complete',
      description: 'Your transactions have been exported successfully.',
    });
  };

  const exportToExcel = () => {
    toast({
      title: '📈 Excel Export',
      description: 'Excel export functionality would be implemented with a library like xlsx.',
    });
  };

  const exportToPDF = () => {
    toast({
      title: '📄 PDF Export',
      description: 'PDF export functionality would be implemented with a library like jsPDF.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="gap-2 border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/10"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportToCSV} className="gap-2">
              <FileJson className="h-4 w-4 text-[#0ea5e9]" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel} className="gap-2">
              <FileSpreadsheet className="h-4 w-4 text-green-500" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF} className="gap-2">
              <FileText className="h-4 w-4 text-red-500" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-[#0ea5e9]/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#0ea5e9]/10 to-[#14b8a6]/10 hover:from-[#0ea5e9]/15 hover:to-[#14b8a6]/15">
              <TableHead className="font-bold text-[#0ea5e9]">Date</TableHead>
              <TableHead className="font-bold text-[#0ea5e9]">Description</TableHead>
              <TableHead className="font-bold text-[#0ea5e9]">Category</TableHead>
              <TableHead className="font-bold text-[#0ea5e9]">Type</TableHead>
              <TableHead className="text-right font-bold text-[#0ea5e9]">Amount</TableHead>
              <TableHead className="text-right font-bold text-[#0ea5e9]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredRow(transaction.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="border-b border-[#0ea5e9]/10 hover:bg-[#0ea5e9]/5 transition-all"
                style={{
                  boxShadow: hoveredRow === transaction.id 
                    ? '0 0 15px rgba(14, 165, 233, 0.2)' 
                    : 'none',
                }}
              >
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className="bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30"
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={transaction.type === 'income' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                    }
                    style={{
                      boxShadow: transaction.type === 'income'
                        ? '0 0 10px rgba(34, 197, 94, 0.3)'
                        : '0 0 10px rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {convertCurrency(transaction.amount, transaction.currency || 'USD', transaction.exchangeRate)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-[#0ea5e9]/10 hover:text-[#0ea5e9]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}