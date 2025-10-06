import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import authService from '@/services/authService';
import crudOperations from '@/components/CRUDOperations';

interface BackendStatus {
  isHealthy: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  apiUrl: string;
  error: string | null;
}

const RealtimeBackend = () => {
  const [status, setStatus] = useState<BackendStatus>({
    isHealthy: false,
    isChecking: true,
    lastChecked: null,
    apiUrl: authService.getApiUrl(),
    error: null
  });

  const checkBackendHealth = async () => {
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      console.log('🏥 Checking backend health...');
      const isHealthy = await authService.healthCheck();
      
      setStatus({
        isHealthy,
        isChecking: false,
        lastChecked: new Date(),
        apiUrl: authService.getApiUrl(),
        error: isHealthy ? null : 'Backend is not responding'
      });

      if (!isHealthy) {
        console.error('❌ Backend health check failed');
        console.error('🔌 Backend may not be deployed at:', authService.getApiUrl());
      } else {
        console.log('✅ Backend is healthy and responding');
      }
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      setStatus({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        apiUrl: authService.getApiUrl(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    // Initial health check
    checkBackendHealth();

    // Periodic health checks every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <AnimatePresence mode="wait">
        {status.isChecking ? (
          <motion.div
            key="checking"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card border-2 border-primary/20 rounded-lg shadow-lg p-3 flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium">Checking backend...</span>
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-card border-2 rounded-lg shadow-lg p-3 ${
              status.isHealthy
                ? 'border-green-500/50'
                : 'border-red-500/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {status.isHealthy ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                Backend {status.isHealthy ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{status.apiUrl}</span>
              </div>
              
              {status.lastChecked && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>
                    Last checked: {status.lastChecked.toLocaleTimeString()}
                  </span>
                </div>
              )}
              
              {status.error && (
                <div className="text-red-500 mt-2 p-2 bg-red-500/10 rounded">
                  {status.error}
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkBackendHealth}
              className="mt-2 w-full text-xs bg-primary/10 hover:bg-primary/20 text-primary py-1 px-2 rounded transition-colors"
            >
              Refresh Status
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealtimeBackend;