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
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/supabase';
import type { BudgetInput } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetAdded?: () => void;
}

interface ValidationErrors {
  category: string;
  amount: string;
  period: string;
}

export default function AddBudgetModal({ isOpen, onClose, onBudgetAdded }: AddBudgetModalProps) {
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    category: '',
    amount: '',
    period: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const validateCategory = (value: string): string => {
    const validCategories = ['food', 'transport', 'entertainment', 'shopping', 'healthcare', 'utilities'];
    if (!validCategories.includes(value)) {
      return 'Please select a valid category';
    }
    return '';
  };

  const validateAmount = (value: string): string => {
    if (!value.trim()) {
      return 'Budget amount is required';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Amount must be a valid number';
    }
    if (numValue <= 0) {
      return 'Amount must be greater than 0';
    }
    if (numValue < 10) {
      return 'Budget amount must be at least $10';
    }
    if (numValue > 10000000) {
      return 'Budget amount is too large';
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return 'Amount can have at most 2 decimal places';
    }
    return '';
  };

  const validatePeriod = (value: string): string => {
    if (value !== 'monthly' && value !== 'yearly') {
      return 'Please select a valid period';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      category: validateCategory(category),
      amount: validateAmount(amount),
      period: validatePeriod(period),
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

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (errors.category) {
      setErrors({ ...errors, category: validateCategory(value) });
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: validateAmount(value) });
    }
  };

  const handlePeriodChange = (value: 'monthly' | 'yearly') => {
    setPeriod(value);
    if (errors.period) {
      setErrors({ ...errors, period: validatePeriod(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add budgets',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      
      const budgetData: BudgetInput = {
        category,
        amount: parseFloat(amount),
        period,
      };

      console.log('💾 Saving budget:', budgetData);

      const { data, error } = await db.budgets.create({
        ...budgetData,
        user_id: user.id,
        spent: 0,
      });

      if (error) {
        console.error('❌ Error saving budget:', error);
        throw new Error(error.message || 'Failed to save budget');
      }

      console.log('✅ Budget saved:', data);

      toast({
        title: '✅ Budget created',
        description: `Budget of $${amount} set for ${category} (${period}).`,
      });

      // Reset form
      setCategory('food');
      setAmount('');
      setPeriod('monthly');
      setErrors({
        category: '',
        amount: '',
        period: '',
      });
      
      // Notify parent component
      if (onBudgetAdded) {
        onBudgetAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Failed to save budget:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save budget. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogDescription>
            Set a spending limit for a category
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange} disabled={isSaving}>
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
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
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              required
              disabled={isSaving}
              className={errors.amount ? 'border-destructive' : ''}
              aria-label="Budget amount"
              title="Enter the budget amount"
              min="10"
              max="10000000"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={handlePeriodChange} disabled={isSaving}>
              <SelectTrigger className={errors.period ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <AnimatePresence>
              {errors.period && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.period}
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? 'Creating...' : 'Create Budget'}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}