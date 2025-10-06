import axios, { AxiosError } from 'axios';

// Production-ready API URL configuration with fallback chain
const getApiUrl = (): string => {
  // Priority 1: Production environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Priority 2: Production backend URL (deploy this first)
  if (import.meta.env.PROD) {
    return 'https://your-backend-api.com/api';
  }
  
  // Priority 3: Development fallback
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiUrl();

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'business';
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
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

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}

interface VerifyResponse {
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

class AuthService {
  private token: string | null = null;
  private apiUrl: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.apiUrl = API_BASE_URL;
    console.log('🔐 AuthService initialized');
    console.log('🌐 API URL:', this.apiUrl);
    console.log('🏗️ Environment:', import.meta.env.MODE);
    console.log('📦 Production Mode:', import.meta.env.PROD);
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.log(`⚠️ Request failed, retrying (${attempt}/${this.retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration for:', data.email);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/auth/register`);
      
      const response = await this.retryRequest(() =>
        axios.post<AuthResponse>(
          `${this.apiUrl}/auth/register`,
          {
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role
          },
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );

      console.log('✅ Registration successful:', response.data);

      if (response.data.success && response.data.data.token) {
        this.token = response.data.data.token;
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        console.log('💾 Token and user data saved to localStorage');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
          console.error('📡 Backend response error:', axiosError.response.status);
          const errorMessage = axiosError.response.data?.message || 'Registration failed';
          const validationErrors = axiosError.response.data?.errors;
          
          if (validationErrors && validationErrors.length > 0) {
            const errorMessages = validationErrors.map(err => err.msg).join(', ');
            throw new Error(errorMessages);
          }
          
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          console.error('🔌 No response from backend server');
          console.error('🔍 Check if backend is deployed and running at:', this.apiUrl);
          throw new Error('Backend server is not responding. Please ensure the backend is deployed and accessible.');
        }
      }
      
      throw new Error('Network error during registration. Please check your connection and backend deployment.');
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔑 Attempting login for:', data.email);
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/auth/login`);
      
      const response = await this.retryRequest(() =>
        axios.post<AuthResponse>(
          `${this.apiUrl}/auth/login`,
          {
            email: data.email,
            password: data.password
          },
          { 
            headers: this.getHeaders(),
            timeout: 15000,
            withCredentials: true
          }
        )
      );

      console.log('✅ Login successful:', response.data);

      if (response.data.success && response.data.data.token) {
        this.token = response.data.data.token;
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        console.log('💾 Token and user data saved to localStorage');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response) {
          console.error('📡 Backend response error:', axiosError.response.status);
          const errorMessage = axiosError.response.data?.message || 'Login failed';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          console.error('🔌 No response from backend server');
          console.error('🔍 Check if backend is deployed and running at:', this.apiUrl);
          throw new Error('Backend server is not responding. Please ensure the backend is deployed and accessible.');
        }
      }
      
      throw new Error('Network error during login. Please check your connection and backend deployment.');
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      if (!this.token) {
        console.log('⚠️ No token to verify');
        return false;
      }

      console.log('🔍 Verifying token with backend...');
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/auth/verify`);
      
      const response = await axios.post<VerifyResponse>(
        `${this.apiUrl}/auth/verify`,
        {},
        { 
          headers: this.getHeaders(),
          timeout: 10000,
          withCredentials: true
        }
      );

      console.log('✅ Token verification successful');
      
      if (response.data.success && response.data.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data.success;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      if (axios.isAxiosError(error) && !error.response) {
        console.error('🔌 Backend server not reachable at:', this.apiUrl);
      }
      this.logout();
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      console.log('🔄 Refreshing token with backend...');
      console.log('🎯 Backend endpoint:', `${this.apiUrl}/auth/refresh`);
      
      const response = await axios.post<AuthResponse>(
        `${this.apiUrl}/auth/refresh`,
        {},
        { 
          headers: this.getHeaders(),
          timeout: 10000,
          withCredentials: true
        }
      );

      if (response.data.success && response.data.data.token) {
        this.token = response.data.data.token;
        localStorage.setItem('auth_token', this.token);
        console.log('✅ Token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      if (axios.isAxiosError(error) && !error.response) {
        console.error('🔌 Backend server not reachable at:', this.apiUrl);
      }
      this.logout();
      return false;
    }
  }

  logout(): void {
    console.log('👋 Logging out...');
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('✅ Logout complete');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): any | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return null;
    }
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
    console.log('🔧 API URL updated to:', url);
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

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
      console.error('❌ Backend health check failed:', error);
      console.error('🔌 Backend may not be deployed or accessible at:', this.apiUrl);
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;