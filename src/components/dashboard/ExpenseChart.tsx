import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

const data = [
  { name: 'Food & Dining', value: 850, color: '#1e3a8a' },
  { name: 'Transportation', value: 320, color: '#14b8a6' },
  { name: 'Entertainment', value: 180, color: '#0891b2' },
  { name: 'Shopping', value: 450, color: '#0ff' },
  { name: 'Healthcare', value: 200, color: '#06b6d4' },
  { name: 'Utilities', value: 280, color: '#0369a1' },
];

export default function ExpenseChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-[#1e3a8a] border-2 border-[#14b8a6] rounded-lg p-4 shadow-2xl"
          style={{
            boxShadow: '0 0 30px rgba(20, 184, 166, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(20, 184, 166, 0.95) 100%)',
          }}
        >
          <p className="text-white font-semibold text-lg">{payload[0].name}</p>
          <p className="text-[#0ff] font-bold text-2xl mt-1">
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-gray-300 text-sm mt-1">
            {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
        style={{
          textShadow: '0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(20, 184, 166, 0.6)',
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="relative"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <defs>
            {data.map((entry, index) => (
              <filter key={`shadow-${index}`} id={`shadow-${index}`} height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.6" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            {data.map((entry, index) => (
              <radialGradient key={`gradient-${index}`} id={`gradient-${index}`}>
                <stop offset="0%" stopColor={entry.color} stopOpacity="1" />
                <stop offset="100%" stopColor={entry.color} stopOpacity="0.6" />
              </radialGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={activeIndex !== null ? 110 : 100}
            innerRadius={activeIndex !== null ? 65 : 60}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient-${index})`}
                filter={`url(#shadow-${index})`}
                style={{
                  transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)',
                  transformOrigin: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                stroke={activeIndex === index ? '#0ff' : 'rgba(255, 255, 255, 0.1)'}
                strokeWidth={activeIndex === index ? 4 : 1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* AI Insight Badge with 3D Effect */}
      <motion.div
        initial={{ opacity: 0, y: -30, rotateX: -90 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotateZ: 5 }}
        className="absolute top-2 right-2 bg-gradient-to-r from-[#1e3a8a] via-[#14b8a6] to-[#0ff] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg"
        style={{
          boxShadow: '0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(0, 255, 255, 0.4)',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🤖 AI Categorized
        </motion.span>
      </motion.div>

      {/* Animated Ring Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: activeIndex !== null ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 w-48 h-48 border-4 border-[#0ff] rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)',
          }}
          animate={{
            scale: activeIndex !== null ? [1, 1.2, 1] : 1,
            opacity: activeIndex !== null ? [0.5, 0.8, 0.5] : 0,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}