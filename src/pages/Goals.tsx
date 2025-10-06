import { useState } from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AddGoalModal from '@/components/modals/AddGoalModal';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

export default function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals] = useState<Goal[]>([
    { id: '1', name: 'Emergency Fund', target: 10000, current: 6500, deadline: '2024-12-31', icon: '🏦' },
    { id: '2', name: 'Vacation', target: 5000, current: 3200, deadline: '2024-08-15', icon: '✈️' },
    { id: '3', name: 'New Car', target: 25000, current: 12000, deadline: '2025-06-30', icon: '🚗' },
    { id: '4', name: 'Home Down Payment', target: 50000, current: 18000, deadline: '2026-01-01', icon: '🏠' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Goals & Savings</h1>
          <p className="text-muted-foreground">Track your financial goals and progress</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const daysRemaining = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{goal.icon}</span>
                  <div className="flex-1">
                    <div className="text-xl font-semibold">{goal.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">Current</div>
                    <div className="text-lg font-semibold text-green-500">
                      ${goal.current.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Target</div>
                    <div className="text-lg font-semibold">
                      ${goal.target.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className="text-sm font-semibold text-primary">
                    ${remaining.toLocaleString()}
                  </span>
                </div>

                <Button className="w-full" variant="outline">
                  Add Contribution
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}