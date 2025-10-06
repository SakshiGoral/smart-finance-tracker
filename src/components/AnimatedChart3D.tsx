import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface AnimatedChart3DProps {
  data?: DataPoint[];
  title?: string;
  height?: number;
}

export default function AnimatedChart3D({ 
  data = [], 
  title = '3D Expense Analysis',
  height = 400 
}: AnimatedChart3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const FPS_LIMIT = 30;
  const frameInterval = 1000 / FPS_LIMIT;

  // Validate and sanitize data
  const validatedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [
        { label: 'Food', value: 500, color: 'hsl(142 71% 45%)' },
        { label: 'Transport', value: 300, color: 'hsl(221 83% 53%)' },
        { label: 'Entertainment', value: 200, color: 'hsl(262 83% 58%)' },
        { label: 'Utilities', value: 250, color: 'hsl(24 95% 53%)' }
      ];
    }
    
    return data.map((item, index) => ({
      label: item?.label || `Item ${index + 1}`,
      value: typeof item?.value === 'number' && !isNaN(item.value) ? Math.max(0, item.value) : 0,
      color: item?.color || `hsl(${(index * 60) % 360} 70% 50%)`
    }));
  }, [data]);

  // Memoize calculations with safe defaults
  const { totalValue, trend } = useMemo(() => {
    try {
      if (!validatedData || validatedData.length === 0) {
        return { totalValue: 0, trend: 0 };
      }

      const total = validatedData.reduce((sum, item) => {
        const value = typeof item?.value === 'number' && !isNaN(item.value) ? item.value : 0;
        return sum + value;
      }, 0);

      let trendValue = 0;
      if (validatedData.length > 1) {
        const firstValue = validatedData[0]?.value || 0;
        const lastValue = validatedData[validatedData.length - 1]?.value || 0;
        if (firstValue !== 0) {
          trendValue = ((lastValue - firstValue) / firstValue) * 100;
        }
      }

      return { 
        totalValue: isNaN(total) ? 0 : total, 
        trend: isNaN(trendValue) ? 0 : trendValue 
      };
    } catch (error) {
      console.error('Error calculating totals:', error);
      return { totalValue: 0, trend: 0 };
    }
  }, [validatedData]);

  const hslToRgb = useCallback((hsl: string): { r: number; g: number; b: number } => {
    try {
      const match = hsl.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
      if (!match) return { r: 99, g: 102, b: 241 };
      
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    } catch (error) {
      console.error('Error converting HSL to RGB:', error);
      return { r: 99, g: 102, b: 241 };
    }
  }, []);

  const adjustBrightness = useCallback((color: string, amount: number): string => {
    try {
      const hslMatch = color.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
      if (hslMatch) {
        const [, h, s, l] = hslMatch;
        const newL = Math.max(0, Math.min(100, parseInt(l) + amount));
        return `hsl(${h} ${s}% ${newL}%)`;
      }
      
      const rgb = hslToRgb(color);
      const factor = 1 + (amount / 100);
      const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
      const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
      const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));
      return `rgb(${r}, ${g}, ${b})`;
    } catch (error) {
      console.error('Error adjusting brightness:', error);
      return color;
    }
  }, [hslToRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setRenderError('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    });
    
    if (!ctx) {
      setRenderError('Unable to get 2D rendering context');
      return;
    }

    setRenderError(null);

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const maxValue = validatedData.length > 0 
        ? Math.max(...validatedData.map(d => d?.value || 0), 1)
        : 1;

      let animationProgress = 0;
      let autoRotateAngle = 0;

      const animate = (currentTime: number) => {
        try {
          const elapsed = currentTime - lastFrameTime.current;
          if (elapsed < frameInterval) {
            animationRef.current = requestAnimationFrame(animate);
            return;
          }
          lastFrameTime.current = currentTime - (elapsed % frameInterval);

          ctx.clearRect(0, 0, rect.width, rect.height);

          ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
          ctx.lineWidth = 1;
          for (let i = 0; i < rect.width; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, rect.height);
            ctx.stroke();
          }
          for (let i = 0; i < rect.height; i += 100) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(rect.width, i);
            ctx.stroke();
          }

          if (animationProgress < 1) {
            animationProgress += 0.02;
            animationProgress = Math.min(animationProgress, 1);
          }

          if (!isHovering) {
            autoRotateAngle += 0.01;
          }

          const rotX = isHovering ? rotation.x : Math.sin(autoRotateAngle * 0.5) * 0.2;
          const rotY = isHovering ? rotation.y : autoRotateAngle;

          const barWidth = 60;
          const barSpacing = Math.min(120, rect.width / (validatedData.length + 1));
          const startX = centerX - (validatedData.length * barSpacing) / 2;

          const barsWithDepth = validatedData.map((item, index) => {
            const x = startX + index * barSpacing;
            const z = Math.sin(rotY) * (x - centerX) * 0.3;
            return { ...item, index, x, z };
          });
          barsWithDepth.sort((a, b) => a.z - b.z);

          barsWithDepth.forEach(({ value, color, label, index, x, z }) => {
            const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
            const barHeight = (safeValue / maxValue) * (rect.height * 0.5) * animationProgress;
            
            const perspective = 800;
            const scale = perspective / (perspective + z);
            const transformedX = centerX + (x - centerX) * scale;
            const transformedY = centerY + rotX * 80;

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 10 * scale;
            ctx.shadowOffsetX = 3 * scale;
            ctx.shadowOffsetY = 3 * scale;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.ellipse(
              transformedX,
              transformedY + 15,
              barWidth * scale * 0.5,
              10 * scale,
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            const gradient = ctx.createLinearGradient(
              transformedX - barWidth * scale / 2,
              transformedY - barHeight * scale,
              transformedX + barWidth * scale / 2,
              transformedY
            );
            
            gradient.addColorStop(0, adjustBrightness(color, 40));
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, adjustBrightness(color, -20));

            ctx.fillStyle = gradient;
            ctx.fillRect(
              transformedX - barWidth * scale / 2,
              transformedY - barHeight * scale,
              barWidth * scale,
              barHeight * scale
            );

            ctx.fillStyle = adjustBrightness(color, 60);
            ctx.beginPath();
            ctx.moveTo(transformedX - barWidth * scale / 2, transformedY - barHeight * scale);
            ctx.lineTo(transformedX - 5 * scale, transformedY - barHeight * scale - 15 * scale);
            ctx.lineTo(transformedX + barWidth * scale / 2 + 5 * scale, transformedY - barHeight * scale - 15 * scale);
            ctx.lineTo(transformedX + barWidth * scale / 2, transformedY - barHeight * scale);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = adjustBrightness(color, -30);
            ctx.beginPath();
            ctx.moveTo(transformedX + barWidth * scale / 2, transformedY - barHeight * scale);
            ctx.lineTo(transformedX + barWidth * scale / 2 + 15 * scale, transformedY - barHeight * scale + 10 * scale);
            ctx.lineTo(transformedX + barWidth * scale / 2 + 15 * scale, transformedY + 10 * scale);
            ctx.lineTo(transformedX + barWidth * scale / 2, transformedY);
            ctx.closePath();
            ctx.fill();

            if (selectedBar === index) {
              ctx.save();
              ctx.shadowColor = 'rgba(99, 102, 241, 0.6)';
              ctx.shadowBlur = 15;
              ctx.strokeStyle = 'rgb(99, 102, 241)';
              ctx.lineWidth = 2 * scale;
              ctx.strokeRect(
                transformedX - barWidth * scale / 2 - 2,
                transformedY - barHeight * scale - 2,
                barWidth * scale + 4,
                barHeight * scale + 4
              );
              ctx.restore();
            }

            ctx.save();
            ctx.fillStyle = 'rgb(226, 232, 240)';
            ctx.font = `${Math.max(10, 11 * scale)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(label || '', transformedX, transformedY + 30);
            ctx.restore();

            ctx.save();
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = `bold ${Math.max(12, 13 * scale)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(
              `$${safeValue.toLocaleString()}`,
              transformedX,
              transformedY - barHeight * scale - 15
            );
            ctx.restore();
          });

          animationRef.current = requestAnimationFrame(animate);
        } catch (error) {
          console.error('Animation error:', error);
          setRenderError('Animation rendering failed');
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (error) {
      console.error('Canvas initialization error:', error);
      setRenderError('Failed to initialize canvas');
    }
  }, [validatedData, rotation, isHovering, selectedBar, adjustBrightness]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    setRotation({ x: y * 0.5, y: x * Math.PI * 0.8 });

    const barSpacing = Math.min(120, rect.width / (validatedData.length + 1));
    const centerX = rect.width / 2;
    const startX = centerX - (validatedData.length * barSpacing) / 2;
    const mouseX = e.clientX - rect.left;
    
    let hoveredBar = null;
    for (let i = 0; i < validatedData.length; i++) {
      const barX = startX + i * barSpacing;
      if (Math.abs(mouseX - barX) < 50) {
        hoveredBar = i;
        break;
      }
    }
    setSelectedBar(hoveredBar);
  }, [validatedData.length]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setSelectedBar(null);
  }, []);

  return (
    <Card className="overflow-hidden border-border/50 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm"
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-semibold ${
              trend >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {renderError ? (
            <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 rounded-lg border-2 border-destructive/20" style={{ height: `${height}px` }}>
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-destructive font-semibold text-lg mb-2">Rendering Error</p>
              <p className="text-muted-foreground text-sm text-center max-w-md">
                {renderError}. Please try refreshing the page or check your browser's WebGL support.
              </p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{ 
                width: '100%', 
                height: `${height}px`,
                background: 'transparent'
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="cursor-grab active:cursor-grabbing rounded-lg"
            />
          )}
        </motion.div>
        
        <motion.div 
          className="mt-6 pt-4 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Data Points</p>
              <p className="text-2xl font-bold text-foreground">{validatedData?.length || 0}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-4 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {validatedData && Array.isArray(validatedData) && validatedData.length > 0 && validatedData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedBar === index 
                  ? 'bg-primary/20 ring-2 ring-primary' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
              onMouseEnter={() => setSelectedBar(index)}
              onMouseLeave={() => setSelectedBar(null)}
            >
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item?.color || '#888' }}
                animate={selectedBar === index ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
              <span className="text-xs font-medium">{item?.label || 'N/A'}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ${(item?.value || 0).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}