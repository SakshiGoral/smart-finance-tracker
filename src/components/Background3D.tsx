import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speed: number;
  type: 'cube' | 'sphere';
}

const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Generate floating shapes with neon colors
  const shapes: FloatingShape[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 40,
    color: ['#14b8a6', '#3b82f6', '#a855f7'][Math.floor(Math.random() * 3)], // teal, blue, purple
    rotation: Math.random() * 360,
    speed: Math.random() * 0.5 + 0.3,
    type: Math.random() > 0.5 ? 'cube' : 'sphere'
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosition.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.03) 0%, transparent 70%)'
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Floating 3D-styled shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, shape.speed * 10, 0],
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8 + shape.speed * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.id * 0.2
          }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            whileHover={{ scale: 1.2 }}
          >
            {shape.type === 'cube' ? (
              // 3D Cube effect
              <div
                className="w-full h-full relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(45deg) rotateY(45deg)'
                }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 rounded-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${shape.color}20, ${shape.color}10)`,
                    border: `1px solid ${shape.color}40`,
                    boxShadow: `0 0 20px ${shape.color}30, inset 0 0 20px ${shape.color}20`,
                    transform: 'translateZ(20px)'
                  }}
                />
                {/* Top face */}
                <div
                  className="absolute inset-0 rounded-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${shape.color}15, ${shape.color}08)`,
                    border: `1px solid ${shape.color}30`,
                    transform: 'rotateX(90deg) translateZ(20px)'
                  }}
                />
                {/* Right face */}
                <div
                  className="absolute inset-0 rounded-lg backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${shape.color}12, ${shape.color}06)`,
                    border: `1px solid ${shape.color}25`,
                    transform: 'rotateY(90deg) translateZ(20px)'
                  }}
                />
              </div>
            ) : (
              // 3D Sphere effect
              <div
                className="w-full h-full rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${shape.color}30, ${shape.color}10, transparent)`,
                  border: `1px solid ${shape.color}40`,
                  boxShadow: `0 0 30px ${shape.color}40, inset -10px -10px 30px ${shape.color}20`,
                  backdropFilter: 'blur(2px)'
                }}
              >
                {/* Highlight */}
                <div
                  className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${shape.color}60, transparent)`,
                    filter: 'blur(8px)'
                  }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}

      {/* Parallax grid lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(20, 184, 166, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(20, 184, 166, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
        animate={{
          x: [0, mousePosition.current.x],
          y: [0, mousePosition.current.y]
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20
        }}
      />

      {/* Glowing particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#14b8a6', '#3b82f6', '#a855f7'][i % 3],
            boxShadow: `0 0 10px ${['#14b8a6', '#3b82f6', '#a855f7'][i % 3]}`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default Background3D;