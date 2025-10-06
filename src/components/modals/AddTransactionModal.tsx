import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Repeat, Globe, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/supabase';
import type { TransactionInput } from '@/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: () => void;
}

interface ValidationErrors {
  description: string;
  amount: string;
  category: string;
  date: string;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export default function AddTransactionModal({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('food');
  const [currency, setCurrency] = useState('USD');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    description: '',
    amount: '',
    category: '',
    date: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const validateDescription = (value: string): string => {
    if (!value.trim()) {
      return 'Description is required';
    }
    if (value.trim().length < 3) {
      return 'Description must be at least 3 characters';
    }
    if (value.trim().length > 100) {
      return 'Description must not exceed 100 characters';
    }
    if (!/^[a-zA-Z0-9\s\-.,&()]+$/.test(value)) {
      return 'Description contains invalid characters';
    }
    return '';
  };

  const validateAmount = (value: string): string => {
    if (!value.trim()) {
      return 'Amount is required';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Amount must be a valid number';
    }
    if (numValue <= 0) {
      return 'Amount must be greater than 0';
    }
    if (numValue > 1000000000) {
      return 'Amount is too large';
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return 'Amount can have at most 2 decimal places';
    }
    return '';
  };

  const validateCategory = (value: string): string => {
    const validCategories = ['food', 'transport', 'entertainment', 'shopping', 'healthcare', 'utilities', 'salary'];
    if (!validCategories.includes(value)) {
      return 'Please select a valid category';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      description: validateDescription(description),
      amount: validateAmount(amount),
      category: validateCategory(category),
      date: '',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (hasErrors) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
    }

    return !hasErrors;
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.description) {
      setErrors({ ...errors, description: validateDescription(value) });
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: validateAmount(value) });
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (errors.category) {
      setErrors({ ...errors, category: validateCategory(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add transactions',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      
      const selectedCurrency = currencies.find(c => c.code === currency);
      
      const transactionData: TransactionInput = {
        description: description.trim(),
        amount: parseFloat(amount),
        type,
        category,
        currency,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : null,
        date: new Date().toISOString(),
      };

      console.log('💾 Saving transaction:', transactionData);

      const { data, error } = await db.transactions.create({
        ...transactionData,
        user_id: user.id,
      });

      if (error) {
        console.error('❌ Error saving transaction:', error);
        throw new Error(error.message || 'Failed to save transaction');
      }

      console.log('✅ Transaction saved:', data);

      toast({
        title: '✅ Transaction added',
        description: `${type === 'income' ? 'Income' : 'Expense'} of ${selectedCurrency?.symbol}${amount} has been recorded.${isRecurring ? ' (Recurring ' + recurringFrequency + ')' : ''}`,
      });

      // Reset form
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('food');
      setCurrency('USD');
      setIsRecurring(false);
      setErrors({
        description: '',
        amount: '',
        category: '',
        date: '',
      });
      
      // Notify parent component
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Failed to save transaction:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save transaction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAICategory = () => {
    setIsAISuggesting(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const categories = ['food', 'transport', 'entertainment', 'shopping', 'healthcare', 'utilities'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setCategory(randomCategory);
      
      toast({
        title: '🤖 AI Categorization',
        description: `Smart suggestion: ${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}`,
      });
      
      setIsAISuggesting(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent 
            className="sm:max-w-[500px] border-[#1e3a8a]/40"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 50px rgba(20, 184, 166, 0.3), 0 0 100px rgba(0, 255, 255, 0.2)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateX: -20, y: 50 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateX: 20, y: -50 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              <DialogHeader>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#1e3a8a] via-[#14b8a6] to-[#0ff] bg-clip-text text-transparent flex items-center gap-2">
                    Add Transaction
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Shield className="h-5 w-5 text-[#14b8a6]" />
                    </motion.div>
                  </DialogTitle>
                </motion.div>
                <DialogDescription>
                  Enter the details of your transaction below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Grocery shopping"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    required
                    disabled={isSaving}
                    className={`border-[#1e3a8a]/40 focus:border-[#14b8a6] transition-all ${
                      errors.description ? 'border-destructive focus:border-destructive' : ''
                    }`}
                    style={{
                      boxShadow: '0 0 15px rgba(20, 184, 166, 0.1)',
                    }}
                    aria-label="Transaction description"
                    title="Enter a description for your transaction"
                    maxLength={100}
                  />
                  <AnimatePresence>
                    {errors.description && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-1 text-sm text-destructive"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      required
                      disabled={isSaving}
                      className={`border-[#1e3a8a]/40 focus:border-[#14b8a6] transition-all ${
                        errors.amount ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      style={{
                        boxShadow: '0 0 15px rgba(20, 184, 166, 0.1)',
                      }}
                      aria-label="Transaction amount"
                      title="Enter the transaction amount"
                      min="0.01"
                      max="1000000000"
                    />
                    <AnimatePresence>
                      {errors.amount && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-1 text-sm text-destructive"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.amount}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Label htmlFor="currency" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#14b8a6]" />
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency} disabled={isSaving}>
                      <SelectTrigger className="border-[#1e3a8a]/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.code} - {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense')} disabled={isSaving}>
                    <SelectTrigger className="border-[#1e3a8a]/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="category">Category</Label>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAICategory}
                        disabled={isAISuggesting || isSaving}
                        className="gap-2 text-[#14b8a6] hover:text-[#0ff] hover:bg-[#14b8a6]/15"
                        style={{
                          boxShadow: isAISuggesting ? '0 0 20px rgba(20, 184, 166, 0.5)' : 'none',
                        }}
                      >
                        <motion.div
                          animate={isAISuggesting ? { rotate: 360 } : {}}
                          transition={{ duration: 1, repeat: isAISuggesting ? Infinity : 0, ease: 'linear' }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        AI Suggest
                      </Button>
                    </motion.div>
                  </div>
                  <Select value={category} onValueChange={handleCategoryChange} disabled={isSaving}>
                    <SelectTrigger className={`border-[#1e3a8a]/40 ${
                      errors.category ? 'border-destructive' : ''
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errors.category && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-1 text-sm text-destructive"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.category}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  className="space-y-4 p-4 rounded-lg border border-[#1e3a8a]/30 bg-[#1e3a8a]/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)',
                  }}
                  style={{
                    boxShadow: '0 0 15px rgba(20, 184, 166, 0.1)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <Repeat className="h-4 w-4 text-[#14b8a6]" />
                      </motion.div>
                      <Label htmlFor="recurring" className="cursor-pointer">
                        Recurring Transaction
                      </Label>
                    </div>
                    <Switch
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={setIsRecurring}
                      disabled={isSaving}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {isRecurring && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, type: 'spring' }}
                      >
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={recurringFrequency} onValueChange={setRecurringFrequency} disabled={isSaving}>
                          <SelectTrigger className="border-[#1e3a8a]/40 mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  className="flex gap-2 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div 
                    className="flex-1" 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose} 
                      disabled={isSaving}
                      className="w-full border-[#1e3a8a]/40 hover:bg-[#1e3a8a]/10"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="flex-1" 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-[#1e3a8a] via-[#14b8a6] to-[#0ff] hover:from-[#1e3a8a] hover:to-[#14b8a6]"
                      style={{
                        boxShadow: '0 0 25px rgba(20, 184, 166, 0.5), 0 0 50px rgba(0, 255, 255, 0.3)',
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Add Transaction'}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}