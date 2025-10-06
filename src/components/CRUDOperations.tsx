import axios from 'axios';
import type { Transaction, Budget } from '@/types';

// Production-ready API URL configuration
const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.PROD) {
    return 'https://your-backend-api.com/api';
  }
  
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiUrl();

console.log('🔧 CRUD Operations initialized');
console.log('🌐 Backend API URL:', API_BASE_URL);
console.log('🏗️ Environment:', import.meta.env.MODE);

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  currency?: string;
  is_recurring?: boolean;
  recurring_frequency?: string | null;
}

export interface UpdateTransactionData {
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
  type?: 'income' | 'expense';
  currency?: string;
  is_recurring?: boolean;
  recurring_frequency?: string | null;
}

export interface CreateBudgetData {
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
}

export interface UpdateBudgetData {
  category?: string;
  amount?: number;
  period?: 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
  spent?: number;
}

export interface CreateGoalData {
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category?: string;
}

export interface UpdateGoalData {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  deadline?: string;
  category?: string;
}

class CRUDOperations {
  private apiUrl: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt < this.retryAttempts && axios.isAxiosError(error) && !error.response) {
        console.log(`⚠️ Request failed, retrying (${attempt}/${this.retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  private handleError(operation: string, error: unknown): never {
    console.error(`❌ Error ${operation}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error('🔌 Backend server not reachable at:', this.apiUrl);
        throw new Error(`Backend server is not responding. Please ensure the backend is deployed at ${this.apiUrl}`);
      }
      
      const message = error.response.data?.message || `Failed to ${operation}`;
      throw new Error(message);
    }
    
    throw new Error(`Failed to ${operation}`);
  }

  // Transaction CRUD Operations
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    try {
      console.log('📝 Creating transaction:', data);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/transactions`);
      
      const response = await this.retryRequest(() =>
        axios.post<{ success: boolean; data: Transaction }>(
          `${this.apiUrl}/transactions`,
          data,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Transaction created:', response.data.data);
      return response.data.data;
    } catch (error) {
      this.handleError('creating transaction', error);
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      console.log('📥 Fetching transactions for user:', userId);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/transactions`);
      
      const response = await this.retryRequest(() =>
        axios.get<{ success: boolean; data: Transaction[] }>(
          `${this.apiUrl}/transactions?user_id=${userId}`,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Transactions fetched:', response.data.data.length);
      return response.data.data;
    } catch (error) {
      this.handleError('fetching transactions', error);
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      console.log('📥 Fetching transaction:', id);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/transactions/${id}`);
      
      const response = await this.retryRequest(() =>
        axios.get<{ success: boolean; data: Transaction }>(
          `${this.apiUrl}/transactions/${id}`,
          { 
            headers: this.getHeaders(),
            timeout: 10000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Transaction fetched:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching transaction:', error);
      return null;
    }
  }

  async updateTransaction(id: string, data: UpdateTransactionData): Promise<Transaction> {
    try {
      console.log('📝 Updating transaction:', id, data);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/transactions/${id}`);
      
      const response = await this.retryRequest(() =>
        axios.put<{ success: boolean; data: Transaction }>(
          `${this.apiUrl}/transactions/${id}`,
          data,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Transaction updated:', response.data.data);
      return response.data.data;
    } catch (error) {
      this.handleError('updating transaction', error);
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting transaction:', id);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/transactions/${id}`);
      
      await this.retryRequest(() =>
        axios.delete(
          `${this.apiUrl}/transactions/${id}`,
          { 
            headers: this.getHeaders(),
            timeout: 10000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Transaction deleted');
    } catch (error) {
      this.handleError('deleting transaction', error);
    }
  }

  // Budget CRUD Operations
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    try {
      console.log('📝 Creating budget:', data);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/budgets`);
      
      const response = await this.retryRequest(() =>
        axios.post<{ success: boolean; data: Budget }>(
          `${this.apiUrl}/budgets`,
          data,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Budget created:', response.data.data);
      return response.data.data;
    } catch (error) {
      this.handleError('creating budget', error);
    }
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    try {
      console.log('📥 Fetching budgets for user:', userId);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/budgets`);
      
      const response = await this.retryRequest(() =>
        axios.get<{ success: boolean; data: Budget[] }>(
          `${this.apiUrl}/budgets?user_id=${userId}`,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Budgets fetched:', response.data.data.length);
      return response.data.data;
    } catch (error) {
      this.handleError('fetching budgets', error);
    }
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    try {
      console.log('📥 Fetching budget:', id);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/budgets/${id}`);
      
      const response = await this.retryRequest(() =>
        axios.get<{ success: boolean; data: Budget }>(
          `${this.apiUrl}/budgets/${id}`,
          { 
            headers: this.getHeaders(),
            timeout: 10000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Budget fetched:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching budget:', error);
      return null;
    }
  }

  async updateBudget(id: string, data: UpdateBudgetData): Promise<Budget> {
    try {
      console.log('📝 Updating budget:', id, data);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/budgets/${id}`);
      
      const response = await this.retryRequest(() =>
        axios.put<{ success: boolean; data: Budget }>(
          `${this.apiUrl}/budgets/${id}`,
          data,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Budget updated:', response.data.data);
      return response.data.data;
    } catch (error) {
      this.handleError('updating budget', error);
    }
  }

  async deleteBudget(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting budget:', id);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/budgets/${id}`);
      
      await this.retryRequest(() =>
        axios.delete(
          `${this.apiUrl}/budgets/${id}`,
          { 
            headers: this.getHeaders(),
            timeout: 10000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Budget deleted');
    } catch (error) {
      this.handleError('deleting budget', error);
    }
  }

  // Goal CRUD Operations
  async createGoal(data: CreateGoalData): Promise<Goal> {
    try {
      console.log('📝 Creating goal:', data);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/goals`);
      
      const response = await this.retryRequest(() =>
        axios.post<{ success: boolean; data: Goal }>(
          `${this.apiUrl}/goals`,
          data,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Goal created:', response.data.data);
      return response.data.data;
    } catch (error) {
      this.handleError('creating goal', error);
    }
  }

  async getGoals(userId: string): Promise<Goal[]> {
    try {
      console.log('📥 Fetching goals for user:', userId);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/goals`);
      
      const response = await this.retryRequest(() =>
        axios.get<{ success: boolean; data: Goal[] }>(
          `${this.apiUrl}/goals?user_id=${userId}`,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Goals fetched:', response.data.data.length);
      return response.data.data;
    } catch (error) {
      this.handleError('fetching goals', error);
    }
  }

  async getGoalById(id: string): Promise<Goal | null> {
    try {
      console.log('📥 Fetching goal:', id);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/goals/${id}`);
      
      const response = await this.retryRequest(() =>
        axios.get<{ success: boolean; data: Goal }>(
          `${this.apiUrl}/goals/${id}`,
          { 
            headers: this.getHeaders(),
            timeout: 10000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Goal fetched:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching goal:', error);
      return null;
    }
  }

  async updateGoal(id: string, data: UpdateGoalData): Promise<Goal> {
    try {
      console.log('📝 Updating goal:', id, data);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/goals/${id}`);
      
      const response = await this.retryRequest(() =>
        axios.put<{ success: boolean; data: Goal }>(
          `${this.apiUrl}/goals/${id}`,
          data,
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Goal updated:', response.data.data);
      return response.data.data;
    } catch (error) {
      this.handleError('updating goal', error);
    }
  }

  async deleteGoal(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting goal:', id);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/goals/${id}`);
      
      await this.retryRequest(() =>
        axios.delete(
          `${this.apiUrl}/goals/${id}`,
          { 
            headers: this.getHeaders(),
            timeout: 10000,
            withCredentials: true
          }
        )
      );
      
      console.log('✅ Goal deleted');
    } catch (error) {
      this.handleError('deleting goal', error);
    }
  }

  // Batch Operations
  async batchCreateTransactions(transactions: CreateTransactionData[]): Promise<Transaction[]> {
    try {
      console.log('📝 Batch creating transactions:', transactions.length);
      const results = await Promise.all(
        transactions.map(transaction => this.createTransaction(transaction))
      );
      console.log('✅ Batch transactions created');
      return results;
    } catch (error) {
      this.handleError('batch creating transactions', error);
    }
  }

  async batchDeleteTransactions(ids: string[]): Promise<void> {
    try {
      console.log('🗑️ Batch deleting transactions:', ids.length);
      await Promise.all(ids.map(id => this.deleteTransaction(id)));
      console.log('✅ Batch transactions deleted');
    } catch (error) {
      this.handleError('batch deleting transactions', error);
    }
  }

  // Health check for backend
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🏥 Checking backend health...');
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/health`);
      
      const response = await axios.get(`${this.apiUrl}/health`, {
        timeout: 5000
      });
      
      console.log('✅ Backend is healthy:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Backend health check failed');
      console.error('🔌 Backend may not be deployed at:', this.apiUrl);
      return false;
    }
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}

const crudOperations = new CRUDOperations();
export default crudOperations;