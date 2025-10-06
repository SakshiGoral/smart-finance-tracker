import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  trend: 'up' | 'down';
}

const ThreeDVisualization = () => {
  const [rotation, setRotation] = useState({ x: 20, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const dataPoints: DataPoint[] = [
    { label: 'Income', value: 85, color: 'hsl(243 75% 59%)', trend: 'up' },
    { label: 'Expenses', value: 65, color: 'hsl(271 81% 56%)', trend: 'down' },
    { label: 'Savings', value: 45, color: 'hsl(217 91% 60%)', trend: 'up' },
    { label: 'Investments', value: 75, color: 'hsl(142 76% 36%)', trend: 'up' }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          3D Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative h-[400px] cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ perspective: '1000px' }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            }}
            animate={{
              rotateY: isDragging ? rotation.y : rotation.y + 360
            }}
            transition={{
              rotateY: {
                duration: isDragging ? 0 : 20,
                repeat: isDragging ? 0 : Infinity,
                ease: 'linear'
              }
            }}
          >
            {/* Center sphere */}
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl flex items-center justify-center"
              style={{
                transform: 'translateZ(0px)',
                boxShadow: '0 0 60px rgba(99, 102, 241, 0.4)'
              }}
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <DollarSign className="h-16 w-16 text-white" />
            </motion.div>

            {/* Data bars in 3D space */}
            {dataPoints.map((point, index) => {
              const angle = (index * 360) / dataPoints.length;
              const radius = 150;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const z = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <motion.div
                  key={point.label}
                  className="absolute"
                  style={{
                    transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* 3D Bar */}
                  <div
                    className="relative flex flex-col items-center"
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <motion.div
                      className="w-16 rounded-t-lg shadow-xl"
                      style={{
                        height: `${point.value * 2}px`,
                        background: `linear-gradient(to top, ${point.color}, ${point.color}dd)`,
                        transform: 'translateZ(20px)',
                        boxShadow: `0 0 30px ${point.color}66`
                      }}
                      animate={{
                        height: [`${point.value * 2}px`, `${point.value * 2.2}px`, `${point.value * 2}px`]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2
                      }}
                    />
                    
                    {/* Side faces for 3D effect */}
                    <div
                      className="absolute top-0 w-16 opacity-60"
                      style={{
                        height: `${point.value * 2}px`,
                        background: `linear-gradient(to right, ${point.color}aa, transparent)`,
                        transform: 'rotateY(-90deg) translateX(-8px)',
                        transformOrigin: 'left'
                      }}
                    />
                    <div
                      className="absolute top-0 w-16 opacity-60"
                      style={{
                        height: `${point.value * 2}px`,
                        background: `linear-gradient(to left, ${point.color}aa, transparent)`,
                        transform: 'rotateY(90deg) translateX(8px)',
                        transformOrigin: 'right'
                      }}
                    />
                    
                    {/* Label card */}
                    <motion.div
                      className="mt-4 bg-card border border-border rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm"
                      style={{
                        transform: 'translateZ(30px)'
                      }}
                      whileHover={{ scale: 1.1, translateZ: 40 }}
                    >
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xs font-semibold text-foreground">{point.label}</span>
                        {point.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      <div className="text-lg font-bold" style={{ color: point.color }}>
                        ${point.value}k
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}

            {/* Orbital rings */}
            {[1, 2, 3].map((ring, idx) => (
              <motion.div
                key={ring}
                className="absolute border-2 border-primary/20 rounded-full"
                style={{
                  width: `${100 + idx * 80}px`,
                  height: `${100 + idx * 80}px`,
                  transform: `rotateX(90deg) translateZ(${-idx * 20}px)`
                }}
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 10 + idx * 5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            ))}
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
            Drag to rotate • Auto-rotating
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {dataPoints.map((point) => (
            <motion.div
              key={point.label}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: point.color }}
              />
              <span className="text-xs font-medium text-foreground">{point.label}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDVisualization;