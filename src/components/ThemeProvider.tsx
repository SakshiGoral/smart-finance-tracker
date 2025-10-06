import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === 'dark' || stored === 'light' || stored === 'system')) {
        return stored as Theme;
      }
      return defaultTheme;
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
      return defaultTheme;
    }
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    try {
      // Remove existing theme classes
      root.classList.remove('light', 'dark');

      // Determine the actual theme to apply
      let appliedTheme: 'light' | 'dark' = 'dark';
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        appliedTheme = systemTheme;
      } else {
        appliedTheme = theme;
      }

      // Apply theme class with smooth transition
      root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      root.classList.add(appliedTheme);
      
      // Set CSS custom properties for better visibility and animations
      if (appliedTheme === 'dark') {
        root.style.setProperty('--chart-background', '#0f172a');
        root.style.setProperty('--chart-foreground', '#e2e8f0');
        root.style.setProperty('--chart-grid', 'rgba(100, 116, 139, 0.1)');
        root.style.setProperty('--chart-shadow', 'rgba(0, 0, 0, 0.4)');
        root.style.setProperty('--chart-highlight', 'rgba(99, 102, 241, 0.3)');
        root.style.setProperty('--animation-primary', 'rgba(99, 102, 241, 0.5)');
        root.style.setProperty('--animation-secondary', 'rgba(168, 85, 247, 0.5)');
        root.style.setProperty('--animation-accent', 'rgba(20, 184, 166, 0.5)');
      } else {
        root.style.setProperty('--chart-background', '#ffffff');
        root.style.setProperty('--chart-foreground', '#1e293b');
        root.style.setProperty('--chart-grid', 'rgba(148, 163, 184, 0.2)');
        root.style.setProperty('--chart-shadow', 'rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--chart-highlight', 'rgba(99, 102, 241, 0.2)');
        root.style.setProperty('--animation-primary', 'rgba(99, 102, 241, 0.3)');
        root.style.setProperty('--animation-secondary', 'rgba(168, 85, 247, 0.3)');
        root.style.setProperty('--animation-accent', 'rgba(20, 184, 166, 0.3)');
      }

      // Ensure body has proper background with transition
      document.body.style.transition = 'background-color 0.3s ease';
      document.body.style.backgroundColor = appliedTheme === 'dark' ? '#0f172a' : '#ffffff';
      
      console.log('✅ Theme applied successfully:', appliedTheme);
    } catch (error) {
      console.error('❌ Failed to apply theme:', error);
    }
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
        console.log('✅ Theme saved:', newTheme);
      } catch (error) {
        console.error('❌ Failed to save theme:', error);
        setTheme(newTheme);
      }
    },
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};