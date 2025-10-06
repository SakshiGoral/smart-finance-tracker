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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/supabase';
import type { GoalInput } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalAdded?: () => void;
}

interface ValidationErrors {
  name: string;
  target: string;
  deadline: string;
}

export default function AddGoalModal({ isOpen, onClose, onGoalAdded }: AddGoalModalProps) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({
    name: '',
    target: '',
    deadline: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const validateName = (value: string): string => {
    if (!value.trim()) {
      return 'Goal name is required';
    }
    if (value.trim().length < 3) {
      return 'Goal name must be at least 3 characters';
    }
    if (value.trim().length > 50) {
      return 'Goal name must not exceed 50 characters';
    }
    if (!/^[a-zA-Z0-9\s\-&()]+$/.test(value)) {
      return 'Goal name contains invalid characters';
    }
    return '';
  };

  const validateTarget = (value: string): string => {
    if (!value.trim()) {
      return 'Target amount is required';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Target must be a valid number';
    }
    if (numValue <= 0) {
      return 'Target must be greater than 0';
    }
    if (numValue < 100) {
      return 'Target amount must be at least $100';
    }
    if (numValue > 100000000) {
      return 'Target amount is too large';
    }
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return 'Amount can have at most 2 decimal places';
    }
    return '';
  };

  const validateDeadline = (value: string): string => {
    if (!value) {
      return 'Deadline is required';
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Deadline must be in the future';
    }
    
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 50);
    
    if (selectedDate > maxDate) {
      return 'Deadline is too far in the future';
    }
    
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: validateName(name),
      target: validateTarget(target),
      deadline: validateDeadline(deadline),
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

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors({ ...errors, name: validateName(value) });
    }
  };

  const handleTargetChange = (value: string) => {
    setTarget(value);
    if (errors.target) {
      setErrors({ ...errors, target: validateTarget(value) });
    }
  };

  const handleDeadlineChange = (value: string) => {
    setDeadline(value);
    if (errors.deadline) {
      setErrors({ ...errors, deadline: validateDeadline(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add goals',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      
      const goalData: GoalInput = {
        name: name.trim(),
        target_amount: parseFloat(target),
        current_amount: 0,
        deadline,
      };

      console.log('💾 Saving goal:', goalData);

      const { data, error } = await db.goals.create({
        ...goalData,
        user_id: user.id,
      });

      if (error) {
        console.error('❌ Error saving goal:', error);
        throw new Error(error.message || 'Failed to save goal');
      }

      console.log('✅ Goal saved:', data);

      toast({
        title: '✅ Goal created',
        description: `Goal "${name}" with target of $${target} has been created.`,
      });

      // Reset form
      setName('');
      setTarget('');
      setDeadline('');
      setErrors({
        name: '',
        target: '',
        deadline: '',
      });
      
      // Notify parent component
      if (onGoalAdded) {
        onGoalAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Failed to save goal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save goal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 50);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
          <DialogDescription>
            Create a new financial goal to track
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              disabled={isSaving}
              className={errors.name ? 'border-destructive' : ''}
              aria-label="Goal name"
              title="Enter your goal name"
              maxLength={50}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
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
            <Label htmlFor="target">Target Amount</Label>
            <Input
              id="target"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={target}
              onChange={(e) => handleTargetChange(e.target.value)}
              required
              disabled={isSaving}
              className={errors.target ? 'border-destructive' : ''}
              aria-label="Target amount"
              title="Enter your target amount"
              min="100"
              max="100000000"
            />
            <AnimatePresence>
              {errors.target && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.target}
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
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => handleDeadlineChange(e.target.value)}
              required
              disabled={isSaving}
              className={errors.deadline ? 'border-destructive' : ''}
              aria-label="Goal deadline"
              title="Select your goal deadline"
              min={getMinDate()}
              max={getMaxDate()}
            />
            <AnimatePresence>
              {errors.deadline && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 text-sm text-destructive"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.deadline}
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
              {isSaving ? 'Creating...' : 'Create Goal'}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}