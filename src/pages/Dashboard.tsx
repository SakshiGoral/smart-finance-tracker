import { useState, useEffect, useMemo, useCallback, memo, Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Plus, MessageCircle, X, Send, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SummaryCard from '@/components/dashboard/SummaryCard';
import TransactionList from '@/components/dashboard/TransactionList';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import AnimatedChart3D from '@/components/AnimatedChart3D';
import ThreeDVisualization from '@/components/ThreeDVisualization';
import AddTransactionModal from '@/components/modals/AddTransactionModal';
import OptionB from '@/components/OptionB';
import DashboardCharts from '@/components/DashboardCharts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import crudOperations from '@/components/CRUDOperations';
import type { Transaction, Budget } from '@/types';

interface ChatMessage {
  role: 'user' | 'bot';
  message: string;
}

class DashboardErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Dashboard Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {this.state.error?.message || 'An error occurred loading the dashboard'}
              </p>
              <Button onClick={() => window.location.reload()}>Reload Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', message: 'Hello! I\'m your financial assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('📥 Loading dashboard data for user:', user.id);
      
      const [transactionsData, budgetsData] = await Promise.all([
        crudOperations.getTransactions(user.id),
        crudOperations.getBudgets(user.id)
      ]);

      console.log('✅ Dashboard data loaded:', {
        transactions: transactionsData.length,
        budgets: budgetsData.length
      });

      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleAddTransaction = useCallback(async (transactionData: any) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add transactions',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('📝 Adding transaction:', transactionData);
      
      await crudOperations.createTransaction({
        user_id: user.id,
        ...transactionData
      });

      toast({
        title: 'Success',
        description: 'Transaction added successfully',
      });

      await loadDashboardData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('❌ Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transaction. Please try again.',
        variant: 'destructive',
      });
    }
  }, [user?.id, toast, loadDashboardData]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    try {
      console.log('🗑️ Deleting transaction:', id);
      
      await crudOperations.deleteTransaction(id);

      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });

      await loadDashboardData();
    } catch (error) {
      console.error('❌ Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast, loadDashboardData]);

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    return { income, expenses, balance };
  }, [transactions]);

  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', message: chatInput };
    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        role: 'bot',
        message: 'I\'m analyzing your financial data. This feature is coming soon!'
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);

    setChatInput('');
  }, [chatInput]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-b-2 border-primary"
        />
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SummaryCard
              title="Total Balance"
              amount={summary.balance}
              icon={<Wallet className="h-6 w-6" />}
              trend={summary.balance > 0 ? 'up' : 'down'}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SummaryCard
              title="Income"
              amount={summary.income}
              icon={<TrendingUp className="h-6 w-6" />}
              trend="up"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SummaryCard
              title="Expenses"
              amount={summary.expenses}
              icon={<TrendingDown className="h-6 w-6" />}
              trend="down"
            />
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={transactions.slice(0, 5)}
                  onDelete={handleDeleteTransaction}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Budget Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <BudgetProgress budgets={budgets} transactions={transactions} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Expense Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart transactions={transactions} />
            </CardContent>
          </Card>
        </motion.div>

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onTransactionAdded={loadDashboardData}
        />

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-20 right-6 w-96 h-[500px] bg-card border border-border rounded-lg shadow-xl flex flex-col z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold">Financial Assistant</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your finances..."
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-40"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;