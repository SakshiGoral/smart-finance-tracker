import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Activity, PieChart, BarChart3, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface DashboardChartsProps {
  transactions?: Transaction[];
  className?: string;
}

const DashboardCharts = memo(({ transactions = [], className }: DashboardChartsProps) => {
  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  
  // Category breakdown
  const categoryData = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  // Monthly trend (last 6 months)
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);
  
  const months = Object.keys(monthlyData).slice(-6);
  const maxAmount = Math.max(
    ...months.map(m => Math.max(monthlyData[m].income, monthlyData[m].expense))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {balance >= 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Positive balance
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Negative balance
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter(t => t.type === 'income').length} transactions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter(t => t.type === 'expense').length} transactions
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Income vs Expenses</span>
                  <span className="text-xs text-muted-foreground">
                    {((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(1)}% income
                  </span>
                </div>
                <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalIncome / (totalIncome + totalExpense)) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                  >
                    ${totalIncome.toFixed(0)}
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalExpense / (totalIncome + totalExpense)) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                  >
                    ${totalExpense.toFixed(0)}
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">Income</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm">Expenses</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Top Spending Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.length > 0 ? (
                  topCategories.map(([category, amount], index) => {
                    const percentage = (amount / totalExpense) * 100;
                    const colors = [
                      'bg-primary',
                      'bg-secondary',
                      'bg-accent',
                      'bg-orange-500',
                      'bg-pink-500'
                    ];
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{category}</span>
                          <span className="text-muted-foreground">
                            ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={cn('h-full', colors[index % colors.length])}
                          />
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No expense data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {months.length > 0 ? (
                  <div className="space-y-4">
                    {months.map((month, index) => {
                      const data = monthlyData[month];
                      const incomeHeight = (data.income / maxAmount) * 100;
                      const expenseHeight = (data.expense / maxAmount) * 100;
                      return (
                        <motion.div
                          key={month}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{month}</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-green-600">↑ ${data.income.toFixed(0)}</span>
                              <span className="text-red-600">↓ ${data.expense.toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 h-12 items-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${incomeHeight}%` }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                              className="flex-1 bg-green-500 rounded-t-md min-h-[4px]"
                            />
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${expenseHeight}%` }}
                              transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
                              className="flex-1 bg-red-500 rounded-t-md min-h-[4px]"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No trend data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

DashboardCharts.displayName = 'DashboardCharts';

export default DashboardCharts;
