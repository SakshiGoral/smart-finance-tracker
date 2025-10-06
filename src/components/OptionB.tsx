import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Target, PiggyBank, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OptionBProps {
  onClose?: () => void;
}

const OptionB = memo(({ onClose }: OptionBProps) => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights into your spending patterns with AI-powered predictions',
      color: 'hsl(243 75% 59%)',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Target,
      title: 'Smart Goals',
      description: 'Set and track financial goals with intelligent recommendations',
      color: 'hsl(217 91% 60%)',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: PiggyBank,
      title: 'Savings Optimizer',
      description: 'Automated savings suggestions based on your income and expenses',
      color: 'hsl(271 81% 56%)',
      bgColor: 'bg-accent/10'
    },
    {
      icon: Wallet,
      title: 'Multi-Account View',
      description: 'Manage multiple accounts and get a unified financial overview',
      color: 'hsl(243 75% 59%)',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Both Options: Complete Package
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Get all features from both basic and premium tiers
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Ultimate
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${feature.bgColor} p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-5 w-5" style={{ color: feature.color }} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-sm">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Ready to unlock everything?</h4>
                <p className="text-xs text-muted-foreground">
                  Get complete access to all basic and premium features combined
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                size="sm"
              >
                Activate Both
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">All features from both options available</span>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

OptionB.displayName = 'OptionB';

export default OptionB;