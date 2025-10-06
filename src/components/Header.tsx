import { Menu, Bell, Moon, Sun, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'budget' | 'goal' | 'insight';
  time: string;
  read: boolean;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Budget Alert',
      message: 'Shopping budget exceeded by $50',
      type: 'budget',
      time: '5m ago',
      read: false,
    },
    {
      id: '2',
      title: 'Goal Progress',
      message: 'Emergency Fund is 65% complete!',
      type: 'goal',
      time: '1h ago',
      read: false,
    },
    {
      id: '3',
      title: 'AI Insight',
      message: 'You can save $200 this month by reducing dining expenses',
      type: 'insight',
      time: '2h ago',
      read: true,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => n && typeof n === 'object' && !n?.read).length 
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'AI Insight',
          message: 'Great job! Your savings increased by 15% this week',
          type: 'insight',
          time: 'Just now',
          read: false,
        };
        
        setNotifications(prev => {
          if (!Array.isArray(prev)) {
            return [newNotification];
          }
          return [newNotification, ...prev];
        });
        
        if (toast && typeof toast === 'function') {
          toast({
            title: '🎉 ' + newNotification.title,
            description: newNotification.message,
          });
        }
      } catch (error) {
        console.error('Failed to add notification:', error);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [toast]);

  const markAsRead = (id: string) => {
    try {
      if (!id || typeof id !== 'string') return;
      
      setNotifications(prev => {
        if (!Array.isArray(prev)) return [];
        
        return prev.map(n => {
          if (!n || typeof n !== 'object' || !n?.id) return n;
          return n.id === id ? { ...n, read: true } : n;
        });
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    try {
      if (!type || typeof type !== 'string') return '📢';
      
      switch (type) {
        case 'budget':
          return '💰';
        case 'goal':
          return '🎯';
        case 'insight':
          return '🤖';
        default:
          return '📢';
      }
    } catch (error) {
      console.error('Failed to get notification icon:', error);
      return '📢';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userName = user?.name && typeof user.name === 'string' ? user.name : 'User';
  const userEmail = user?.email && typeof user.email === 'string' ? user.email : 'user@example.com';
  const userAvatar = user?.avatar && typeof user.avatar === 'string' ? user.avatar : '';
  const userInitial = userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e3a8a]/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(20, 184, 166, 0.15), 0 0 60px rgba(0, 255, 255, 0.05)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.15, rotate: 90 }} 
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-[#14b8a6]/15 relative"
              onClick={onMenuClick}
              style={{
                boxShadow: '0 0 15px rgba(20, 184, 166, 0.2)',
              }}
            >
              <Menu className="h-6 w-6 text-[#14b8a6]" />
            </Button>
          </motion.div>
          <motion.h1 
            className="text-2xl font-heading font-bold bg-gradient-to-r from-[#1e3a8a] via-[#14b8a6] to-[#0ff] bg-clip-text text-transparent cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/dashboard')}
            style={{
              textShadow: '0 0 30px rgba(20, 184, 166, 0.3)',
            }}
          >
            Financial Trending
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e3a8a]/10 border border-[#14b8a6]/30"
          >
            <Shield className="h-4 w-4 text-[#14b8a6]" />
            <span className="text-xs font-semibold text-[#14b8a6]">JWT Secured</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.15, rotate: 180 }} 
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme && typeof setTheme === 'function' && setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-[#14b8a6]/15 relative"
              style={{
                boxShadow: theme === 'dark' 
                  ? '0 0 20px rgba(0, 255, 255, 0.4)' 
                  : '0 0 20px rgba(20, 184, 166, 0.3)',
              }}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <Sun className="h-5 w-5 text-[#0ff]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <Moon className="h-5 w-5 text-[#1e3a8a]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.15 }} 
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-[#14b8a6]/15"
                  style={{
                    boxShadow: unreadCount > 0 ? '0 0 20px rgba(0, 255, 255, 0.3)' : 'none',
                  }}
                >
                  <motion.div
                    animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Bell className="h-5 w-5 text-[#14b8a6]" />
                  </motion.div>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge 
                        className="h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs border-2 border-white dark:border-gray-900"
                        style={{
                          boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
                        }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {unreadCount}
                        </motion.span>
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 border-[#1e3a8a]/40"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(20, 184, 166, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 40px rgba(20, 184, 166, 0.3)',
              }}
            >
              <DropdownMenuLabel className="text-[#0ff] font-bold text-lg">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#14b8a6]/30" />
              <div className="max-h-96 overflow-y-auto">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((notification, index) => {
                    if (!notification || typeof notification !== 'object') return null;
                    
                    const notificationId = notification?.id || `notification-${index}`;
                    const notificationTitle = notification?.title || 'Notification';
                    const notificationMessage = notification?.message || '';
                    const notificationType = notification?.type || 'insight';
                    const notificationTime = notification?.time || '';
                    const notificationRead = notification?.read || false;
                    const notificationBudgetPercentage = notification?.budgetPercentage || null;
                    
                    return (
                      <motion.div
                        key={notificationId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <DropdownMenuItem
                          onClick={() => markAsRead(notificationId)}
                          className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                            !notificationRead ? 'bg-[#14b8a6]/15' : ''
                          } hover:bg-[#14b8a6]/20`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <motion.span 
                              className="text-2xl"
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              {getNotificationIcon(notificationType)}
                            </motion.span>
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-white flex items-center gap-2">
                                {notificationTitle}
                                {notificationType === 'budget' && notificationBudgetPercentage && (
                                  <Badge 
                                    className="text-xs px-1.5 py-0.5"
                                    style={{
                                      backgroundColor: notificationBudgetPercentage >= 90 ? '#EF4444' : notificationBudgetPercentage >= 75 ? '#F59E0B' : '#10B981',
                                      color: 'white',
                                      boxShadow: notificationBudgetPercentage >= 90 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
                                    }}
                                  >
                                    {notificationBudgetPercentage}%
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-300">{notificationMessage}</div>
                              {notificationType === 'budget' && notificationBudgetPercentage && (
                                <div className="mt-2 w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${notificationBudgetPercentage}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full rounded-full"
                                    style={{
                                      background: notificationBudgetPercentage >= 90 
                                        ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)' 
                                        : notificationBudgetPercentage >= 75 
                                        ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)' 
                                        : 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                                      boxShadow: notificationBudgetPercentage >= 90 ? '0 0 8px rgba(239, 68, 68, 0.6)' : 'none'
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            {!notificationRead && (
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.3, 1],
                                  boxShadow: [
                                    '0 0 10px rgba(0, 255, 255, 0.5)',
                                    '0 0 20px rgba(0, 255, 255, 0.8)',
                                    '0 0 10px rgba(0, 255, 255, 0.5)',
                                  ],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="h-2 w-2 rounded-full bg-[#0ff]"
                              />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{notificationTime}</span>
                        </DropdownMenuItem>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.1, rotateY: 180 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <motion.div
                    style={{
                      boxShadow: '0 0 25px rgba(20, 184, 166, 0.5), 0 0 50px rgba(0, 255, 255, 0.3)',
                    }}
                    className="rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 25px rgba(20, 184, 166, 0.5)',
                        '0 0 35px rgba(0, 255, 255, 0.6)',
                        '0 0 25px rgba(20, 184, 166, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Avatar>
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-gradient-to-r from-[#1e3a8a] to-[#14b8a6] text-white font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 border-[#1e3a8a]/40"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(20, 184, 166, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 40px rgba(20, 184, 166, 0.3)',
              }}
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-gray-300">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#14b8a6]/30" />
              <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer hover:bg-[#14b8a6]/20 text-white"
                >
                  Settings
                </DropdownMenuItem>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer hover:bg-[#14b8a6]/20 text-white"
                >
                  Profile
                </DropdownMenuItem>
              </motion.div>
              <DropdownMenuSeparator className="bg-[#14b8a6]/30" />
              <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-500/20 text-red-300"
                >
                  Logout
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}