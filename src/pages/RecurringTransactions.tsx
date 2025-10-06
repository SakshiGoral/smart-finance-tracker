import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, DollarSign, Repeat, Edit, Trash2, Play, Pause, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  nextDate: string;
  isActive: boolean;
  type: 'income' | 'expense';
}

const RecurringTransactions = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([
    {
      id: '1',
      name: 'Netflix Subscription',
      amount: 15.99,
      frequency: 'monthly',
      category: 'Entertainment',
      nextDate: '2024-02-01',
      isActive: true,
      type: 'expense'
    },
    {
      id: '2',
      name: 'Salary',
      amount: 5000,
      frequency: 'monthly',
      category: 'Income',
      nextDate: '2024-02-01',
      isActive: true,
      type: 'income'
    },
    {
      id: '3',
      name: 'Rent',
      amount: 1200,
      frequency: 'monthly',
      category: 'Housing',
      nextDate: '2024-02-01',
      isActive: true,
      type: 'expense'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    category: '',
    nextDate: '',
    type: 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id 
          ? { ...t, ...formData, amount: parseFloat(formData.amount) }
          : t
      ));
      toast({
        title: 'Transaction Updated',
        description: 'Recurring transaction has been updated successfully.'
      });
    } else {
      const newTransaction: RecurringTransaction = {
        id: Date.now().toString(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        frequency: formData.frequency as any,
        category: formData.category,
        nextDate: formData.nextDate,
        isActive: true,
        type: formData.type as any
      };
      setTransactions([...transactions, newTransaction]);
      toast({
        title: 'Transaction Added',
        description: 'New recurring transaction has been created successfully.'
      });
    }
    
    setIsDialogOpen(false);
    setEditingTransaction(null);
    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      category: '',
      nextDate: '',
      type: 'expense'
    });
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      amount: transaction.amount.toString(),
      frequency: transaction.frequency,
      category: transaction.category,
      nextDate: transaction.nextDate,
      type: transaction.type
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: 'Transaction Deleted',
      description: 'Recurring transaction has been removed.'
    });
  };

  const toggleActive = (id: string) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-blue-500',
      weekly: 'bg-green-500',
      monthly: 'bg-purple-500',
      yearly: 'bg-orange-500'
    };
    return colors[frequency] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Recurring Transactions</h1>
              <p className="text-muted-foreground">Manage your automatic monthly bills and recurring income</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => {
                  setEditingTransaction(null);
                  setFormData({
                    name: '',
                    amount: '',
                    frequency: 'monthly',
                    category: '',
                    nextDate: '',
                    type: 'expense'
                  });
                }}>
                  <Plus className="w-4 h-4" />
                  Add Recurring Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingTransaction ? 'Edit' : 'Add'} Recurring Transaction</DialogTitle>
                  <DialogDescription>
                    Set up automatic transactions that repeat on a schedule
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Transaction Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Netflix Subscription"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Entertainment"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nextDate">Next Payment Date</Label>
                      <Input
                        id="nextDate"
                        type="date"
                        value={formData.nextDate}
                        onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingTransaction ? 'Update' : 'Add'} Transaction</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Recurring</CardTitle>
                <Repeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.filter(t => t.isActive).length}</div>
                <p className="text-xs text-muted-foreground">transactions scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactions
                    .filter(t => t.type === 'expense' && t.frequency === 'monthly' && t.isActive)
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">per month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactions
                    .filter(t => t.type === 'income' && t.frequency === 'monthly' && t.isActive)
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">per month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={!transaction.isActive ? 'opacity-60' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${
                          transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <DollarSign className={`w-6 h-6 ${
                            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{transaction.name}</h3>
                            <Badge className={`${getFrequencyBadge(transaction.frequency)} text-white`}>
                              {transaction.frequency}
                            </Badge>
                            {transaction.isActive && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Next: {new Date(transaction.nextDate).toLocaleDateString()}
                            </span>
                            <span>Category: {transaction.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(transaction.id)}
                        >
                          {transaction.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {transactions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Repeat className="w-12 h-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Recurring Transactions</h3>
                  <p className="text-muted-foreground mb-4">Get started by adding your first recurring transaction</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecurringTransactions;