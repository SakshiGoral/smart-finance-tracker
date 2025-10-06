import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  color: string;
}

export default function SummaryCard({ title, value, icon: Icon, trend, trendUp, color }: SummaryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -12,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <Card 
        className="relative overflow-hidden border-[#1e3a8a]/30 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
          boxShadow: isHovered 
            ? '0 25px 50px rgba(30, 58, 138, 0.4), 0 0 40px rgba(20, 184, 166, 0.3)' 
            : '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
        }}
      >
        {/* 3D Background Effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovered ? 1.8 : 1,
            opacity: isHovered ? 0.4 : 0.15,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Neon Accent Line - Navy Blue to Teal */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1e3a8a] via-[#14b8a6] to-[#0ff]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            boxShadow: '0 0 15px rgba(20, 184, 166, 0.9), 0 0 30px rgba(0, 255, 255, 0.5)',
          }}
        />

        {/* Animated Corner Glow */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 opacity-20"
          style={{
            background: 'radial-gradient(circle at 100% 0%, #0ff 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.4 }}
        />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </CardTitle>
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.3 : 1,
              rotateY: isHovered ? 180 : 0,
            }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 200 }}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${color || ''}`}
            style={{
              background: `radial-gradient(circle, ${
                color && color.includes('green') ? 'rgba(34, 197, 94, 0.25)' :
                color && color.includes('red') ? 'rgba(239, 68, 68, 0.25)' :
                'rgba(30, 58, 138, 0.25)'
              } 0%, transparent 70%)`,
              boxShadow: isHovered 
                ? `0 0 30px ${
                    color && color.includes('green') ? 'rgba(34, 197, 94, 0.8)' :
                    color && color.includes('red') ? 'rgba(239, 68, 68, 0.8)' :
                    'rgba(20, 184, 166, 0.8)'
                  }, 0 0 60px ${
                    color && color.includes('green') ? 'rgba(34, 197, 94, 0.4)' :
                    color && color.includes('red') ? 'rgba(239, 68, 68, 0.4)' :
                    'rgba(0, 255, 255, 0.4)'
                  }`
                : 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            <Icon className={`h-6 w-6 ${color || ''}`} />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div 
            className="text-3xl font-bold bg-gradient-to-r from-[#1e3a8a] via-[#14b8a6] to-[#0ff] bg-clip-text text-transparent"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
          >
            ${value != null ? value.toLocaleString() : '0'}
          </motion.div>
          <motion.div 
            className="flex items-center gap-1 text-sm mt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              animate={{
                y: trendUp ? [-3, 3, -3] : [3, -3, 3],
                rotate: trendUp ? [0, 10, 0] : [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {trendUp ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
            </motion.div>
            <span 
              className={`font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}
              style={{
                textShadow: trendUp 
                  ? '0 0 15px rgba(34, 197, 94, 0.5)' 
                  : '0 0 15px rgba(239, 68, 68, 0.5)',
              }}
            >
              {trend}
            </span>
            <span className="text-muted-foreground">from last month</span>
          </motion.div>
        </CardContent>

        {/* 3D Corner Accent with Neon Glow */}
        <motion.div
          className="absolute bottom-0 right-0 w-24 h-24 opacity-15"
          style={{
            background: 'radial-gradient(circle at 100% 100%, #14b8a6 0%, #0ff 50%, transparent 70%)',
          }}
          animate={{
            scale: isHovered ? 2 : 1,
            opacity: isHovered ? 0.3 : 0.15,
            rotate: isHovered ? 45 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Animated Particles */}
        {isHovered && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#0ff]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -40],
                x: [0, 20],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ boxShadow: '0 0 10px #0ff' }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-[#14b8a6]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -40],
                x: [0, -20],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              style={{ boxShadow: '0 0 10px #14b8a6' }}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
}