// Database-related types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          currency: string;
          is_recurring: boolean;
          recurring_frequency: string | null;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          currency?: string;
          is_recurring?: boolean;
          recurring_frequency?: string | null;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          description?: string;
          amount?: number;
          type?: 'income' | 'expense';
          category?: string;
          currency?: string;
          is_recurring?: boolean;
          recurring_frequency?: string | null;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          amount: number;
          spent: number;
          period: 'monthly' | 'yearly';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          amount: number;
          spent?: number;
          period?: 'monthly' | 'yearly';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          amount?: number;
          spent?: number;
          period?: 'monthly' | 'yearly';
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          deadline: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          deadline: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          deadline?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
          next_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
          next_date: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          type?: 'income' | 'expense';
          category?: string;
          frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
          next_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// Auth API types - Backend specific
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'business';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;
  };
}

export interface VerifyTokenResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}

// Backend API Response types
export interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface BackendErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location?: string;
  }>;
}

export interface BackendHealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
  version: string;
}

// Transaction types
export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  currency: string;
  is_recurring: boolean;
  recurring_frequency: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  currency?: string;
  is_recurring?: boolean;
  recurring_frequency?: string | null;
  date?: string;
}

// Budget types
export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface BudgetInput {
  category: string;
  amount: number;
  period?: 'monthly' | 'yearly';
}

// Goal types
export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface GoalInput {
  name: string;
  target_amount: number;
  current_amount?: number;
  deadline: string;
}

// Recurring Transaction types
export interface RecurringTransaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringTransactionInput {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  is_active?: boolean;
}

// Legacy types (preserved for backward compatibility)
export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'classic' | 'specialty' | 'vegan';
  size: 'small' | 'medium' | 'large';
  ingredients: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'appetizer' | 'dessert' | 'drink';
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Currency types
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  net: number;
}

// Backend deployment configuration types
export interface BackendConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  timeout: number;
  retryAttempts: number;
  withCredentials: boolean;
}

export interface DeploymentStatus {
  backend: 'deployed' | 'not-deployed' | 'error';
  database: 'connected' | 'disconnected' | 'error';
  lastChecked: string;
}