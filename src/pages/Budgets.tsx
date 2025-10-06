import { useState, useEffect } from 'react';
import { Plus, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AddBudgetModal from '@/components/modals/AddBudgetModal';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Budget {
  id: string;
  category: string;
  spent: number;
  budget: number;
  icon: string;
}

export default function Budgets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { toast } = useToast();
  const [budgets] = useState<Budget[]>([
    { id: '1', category: 'Food & Dining', spent: 850, budget: 1000, icon: '🍔' },
    { id: '2', category: 'Transportation', spent: 320, budget: 500, icon: '🚗' },
    { id: '3', category: 'Entertainment', spent: 180, budget: 300, icon: '🎬' },
    { id: '4', category: 'Shopping', spent: 450, budget: 400, icon: '🛍️' },
    { id: '5', category: 'Healthcare', spent: 200, budget: 500, icon: '⚕️' },
    { id: '6', category: 'Utilities', spent: 280, budget: 350, icon: '💡' },
  ]);

  useEffect(() => {
    // Show AI recommendation
    setTimeout(() => {
      toast({
        title: '🤖 AI Budget Recommendation',
        description: 'Based on your spending patterns, consider increasing your Food budget to $1,200.',
      });
    }, 3000);
  }, [toast]);

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'from-red-500 to-red-600';
    if (percentage >= 80) return 'from-yellow-500 to-yellow-600';
    return 'from-[#0ea5e9] to-[#14b8a6]';
  };

  const getStatusBadge = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) {
      return (
        <Badge 
          variant="destructive"
          className="animate-pulse"
          style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
        >
          Over Budget
        </Badge>
      );
    }
    if (percentage >= 80) {
      return (
        <Badge 
          className="bg-yellow-500 hover:bg-yellow-600"
          style={{ boxShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }}
        >
          Warning
        </Badge>
      );
    }
    return (
      <Badge 
        className="bg-green-500 hover:bg-green-600"
        style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
      >
        On Track
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-[#1e293b] to-[#0ea5e9] dark:from-white dark:to-[#0ea5e9] bg-clip-text text-transparent">
            Budgets
          </h1>
          <p className="text-muted-foreground">Track and manage your spending limits</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="gap-2 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] hover:from-[#0284c7] hover:to-[#0d9488]"
            style={{
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Plus className="h-4 w-4" />
            Add Budget
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const remaining = budget.budget - budget.spent;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              onHoverStart={() => setHoveredCard(budget.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card 
                className="border-[#0ea5e9]/20 transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)',
                  boxShadow: hoveredCard === budget.id 
                    ? '0 20px 40px rgba(14, 165, 233, 0.3)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* 3D Background Effect */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: hoveredCard === budget.id ? 1.5 : 1,
                    opacity: hoveredCard === budget.id ? 0.2 : 0.1,
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Neon Top Border */}
                <motion.div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getProgressColor(budget.spent, budget.budget)}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  style={{
                    boxShadow: percentage >= 100
                      ? '0 0 10px rgba(239, 68, 68, 0.8)'
                      : percentage >= 80
                      ? '0 0 10px rgba(234, 179, 8, 0.8)'
                      : '0 0 10px rgba(14, 165, 233, 0.8)',
                  }}
                />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <motion.span 
                      className="text-3xl"
                      animate={{
                        rotate: hoveredCard === budget.id ? 360 : 0,
                        scale: hoveredCard === budget.id ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {budget.icon}
                    </motion.span>
                    {budget.category}
                  </CardTitle>
                  {getStatusBadge(budget.spent, budget.budget)}
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-semibold">${budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={percentage}
                        className="h-3"
                        style={{
                          background: 'rgba(14, 165, 233, 0.1)',
                        }}
                      />
                      <motion.div
                        className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getProgressColor(budget.spent, budget.budget)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                          boxShadow: percentage >= 100
                            ? '0 0 15px rgba(239, 68, 68, 0.5)'
                            : percentage >= 80
                            ? '0 0 15px rgba(234, 179, 8, 0.5)'
                            : '0 0 15px rgba(14, 165, 233, 0.5)',
                        }}
                      />
                      {/* 3D Shading */}
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full opacity-30"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-semibold">${budget.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#0ea5e9]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className={`text-sm font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        ${Math.abs(remaining).toLocaleString()}
                      </span>
                    </div>
                    {percentage >= 80 && (
                      <motion.div 
                        className="flex items-center gap-2 mt-2 text-xs text-yellow-600 dark:text-yellow-500"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <AlertCircle className="h-3 w-3" />
                        </motion.div>
                        <span>Approaching budget limit</span>
                      </motion.div>
                    )}
                  </div>

                  {/* AI Suggestion Badge */}
                  {percentage < 50 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#0ea5e9]/10 border border-[#0ea5e9]/30"
                    >
                      <Sparkles className="h-3 w-3 text-[#0ea5e9]" />
                      <span className="text-xs text-[#0ea5e9]">Great spending control!</span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}