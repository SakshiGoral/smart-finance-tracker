import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModalType = 'success' | 'error' | 'info';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

const modalVariants = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-[#22C55E]',
    borderColor: 'border-[#22C55E]/30',
    bgGlow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    animation: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: { 
          type: 'spring',
          stiffness: 300,
          damping: 20
        }
      },
      exit: { scale: 0.8, opacity: 0 }
    }
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-[#EF4444]',
    borderColor: 'border-[#EF4444]/30',
    bgGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    animation: {
      initial: { x: -20, opacity: 0 },
      animate: { 
        x: [0, -10, 10, -10, 10, 0],
        opacity: 1,
        transition: {
          x: {
            duration: 0.5,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
          },
          opacity: { duration: 0.2 }
        }
      },
      exit: { x: 20, opacity: 0 }
    }
  },
  info: {
    icon: Info,
    iconColor: 'text-[#3B82F6]',
    borderColor: 'border-[#3B82F6]/30',
    bgGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    animation: {
      initial: { opacity: 0, y: -20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: 'easeOut'
        }
      },
      exit: { opacity: 0, y: -20 }
    }
  }
};

export const Modal = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  children,
  closeOnOverlayClick = true
}: ModalProps) => {
  const variant = modalVariants[type];
  const Icon = variant.icon;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />

          {/* Modal Content */}
          <motion.div
            {...variant.animation}
            className={cn(
              "relative z-10 w-full max-w-md mx-4",
              "bg-card border-2 rounded-2xl",
              "overflow-hidden",
              variant.borderColor,
              variant.bgGlow
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Modal Body */}
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={cn(
                  "p-3 rounded-full",
                  type === 'success' && 'bg-[#22C55E]/10',
                  type === 'error' && 'bg-[#EF4444]/10',
                  type === 'info' && 'bg-[#3B82F6]/10'
                )}>
                  <Icon className={cn("w-8 h-8", variant.iconColor)} />
                </div>
              </div>

              {/* Title */}
              {title && (
                <h3 className="text-xl font-semibold text-center mb-2 text-foreground">
                  {title}
                </h3>
              )}

              {/* Message */}
              {message && (
                <p className="text-center text-muted-foreground mb-4">
                  {message}
                </p>
              )}

              {/* Custom Content */}
              {children && (
                <div className="mt-4">
                  {children}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
