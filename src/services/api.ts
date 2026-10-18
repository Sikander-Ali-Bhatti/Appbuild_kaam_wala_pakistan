import {
  User,
  WorkerProfile,
  Booking,
  Review,
  Report,
  Notification,
  ServiceCategory,
  ProvinceLocation,
  WorkerApprovalStatus,
  BookingStatus,
} from '../types';

const TOKEN_KEY = 'kwp_auth_token';
const USER_KEY = 'kwp_auth_user';

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public static setSession(token: string, user: User, workerProfile?: WorkerProfile): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (workerProfile) {
      localStorage.setItem('kwp_worker_profile', JSON.stringify(workerProfile));
    }
  }

  public static clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('kwp_worker_profile');
  }

  public static getStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static getStoredWorkerProfile(): WorkerProfile | null {
    const raw = localStorage.getItem('kwp_worker_profile');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}: ${res.statusText}`);
    }

    return data as T;
  }

  // Auth
  static async registerCustomer(params: any): Promise<{ token: string; user: User }> {
    const data = await this.request<{ token: string; user: User }>('/api/auth/register-customer', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setSession(data.token, data.user);
    return data;
  }

  static async registerWorker(params: any): Promise<{ token: string; user: User; workerProfile: WorkerProfile }> {
    const data = await this.request<{ token: string; user: User; workerProfile: WorkerProfile }>('/api/auth/register-worker', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setSession(data.token, data.user, data.workerProfile);
    return data;
  }

  static async login(params: { email: string; password: string }): Promise<{ token: string; user: User; workerProfile?: WorkerProfile }> {
    const data = await this.request<{ token: string; user: User; workerProfile?: WorkerProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setSession(data.token, data.user, data.workerProfile);
    return data;
  }

  static async getCurrentUser(): Promise<{ user: User; workerProfile?: WorkerProfile }> {
    return this.request<{ user: User; workerProfile?: WorkerProfile }>('/api/auth/me');
  }

  static async updateProfile(params: Partial<User>): Promise<{ user: User; workerProfile?: WorkerProfile }> {
    const data = await this.request<{ user: User; workerProfile?: WorkerProfile }>('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(params),
    });
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    if (data.workerProfile) {
      localStorage.setItem('kwp_worker_profile', JSON.stringify(data.workerProfile));
    }
    return data;
  }

  // Workers
  static async getWorkers(filters?: {
    province?: string;
    city?: string;
    area?: string;
    category?: string;
    query?: string;
    isAvailable?: boolean;
    minRating?: number;
    approvalStatus?: string;
  }): Promise<WorkerProfile[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params.append(key, String(val));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<WorkerProfile[]>(`/api/workers${query}`);
  }

  static async getWorkerById(id: string): Promise<{ worker: WorkerProfile; reviews: Review[] }> {
    return this.request<{ worker: WorkerProfile; reviews: Review[] }>(`/api/workers/${id}`);
  }

  static async reportWorker(workerId: string, reason: string, details?: string): Promise<{ message: string; report: Report }> {
    return this.request<{ message: string; report: Report }>(`/api/workers/${workerId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    });
  }

  static async updateWorkerAvailability(isAvailable: boolean): Promise<{ message: string; worker: WorkerProfile }> {
    const data = await this.request<{ message: string; worker: WorkerProfile }>('/api/workers/me/availability', {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
    if (data.worker) {
      localStorage.setItem('kwp_worker_profile', JSON.stringify(data.worker));
    }
    return data;
  }

  static async updateWorkerProfile(params: Partial<WorkerProfile>): Promise<{ message: string; worker: WorkerProfile }> {
    const data = await this.request<{ message: string; worker: WorkerProfile }>('/api/workers/me/profile', {
      method: 'PUT',
      body: JSON.stringify(params),
    });
    if (data.worker) {
      localStorage.setItem('kwp_worker_profile', JSON.stringify(data.worker));
    }
    return data;
  }

  // Bookings
  static async createBooking(params: {
    workerId: string;
    description: string;
    preferredDate: string;
    preferredTimeSlot: string;
    address: string;
    city?: string;
    area?: string;
    isEmergency?: boolean;
  }): Promise<{ message: string; booking: Booking }> {
    return this.request<{ message: string; booking: Booking }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getBookings(status?: string): Promise<Booking[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<Booking[]>(`/api/bookings${query}`);
  }

  static async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    reason?: string
  ): Promise<{ message: string; booking: Booking }> {
    return this.request<{ message: string; booking: Booking }>(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  }

  static async submitReview(
    bookingId: string,
    rating: number,
    comment: string,
    tags?: string[]
  ): Promise<{ message: string; review: Review }> {
    return this.request<{ message: string; review: Review }>(`/api/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment, tags }),
    });
  }

  // Categories & Locations & Stats
  static async getCategories(): Promise<ServiceCategory[]> {
    return this.request<ServiceCategory[]>('/api/categories');
  }

  static async getLocations(): Promise<ProvinceLocation[]> {
    return this.request<ProvinceLocation[]>('/api/locations');
  }

  static async getPublicStats(): Promise<{
    approvedWorkers: number;
    completedJobs: number;
    totalReviews: number;
    totalCities: number;
    isFree: boolean;
  }> {
    return this.request('/api/stats');
  }

  // Favorites
  static async getFavorites(): Promise<WorkerProfile[]> {
    return this.request<WorkerProfile[]>('/api/favorites');
  }

  static async toggleFavorite(workerId: string): Promise<{ isFavorite: boolean; message: string }> {
    return this.request<{ isFavorite: boolean; message: string }>('/api/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ workerId }),
    });
  }

  // Notifications
  static async getNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    return this.request<{ notifications: Notification[]; unreadCount: number }>('/api/notifications');
  }

  static async markNotificationRead(id: string): Promise<void> {
    await this.request(`/api/notifications/${id}/read`, { method: 'PATCH' });
  }

  // Admin
  static async getAdminStats(): Promise<any> {
    return this.request('/api/admin/stats');
  }

  static async getAdminWorkers(status?: string, query?: string): Promise<WorkerProfile[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (query) params.append('query', query);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<WorkerProfile[]>(`/api/admin/workers${qs}`);
  }

  static async updateWorkerApproval(
    workerId: string,
    status: WorkerApprovalStatus,
    reason?: string
  ): Promise<{ message: string; worker: WorkerProfile }> {
    return this.request<{ message: string; worker: WorkerProfile }>(`/api/admin/workers/${workerId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  }

  static async updateWorkerAccountStatus(
    workerId: string,
    action: 'suspend' | 'reactivate'
  ): Promise<{ message: string; worker: WorkerProfile }> {
    return this.request<{ message: string; worker: WorkerProfile }>(`/api/admin/workers/${workerId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    });
  }

  static async getAdminUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users');
  }

  static async getAdminBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/api/admin/bookings');
  }

  static async getAdminReports(): Promise<Report[]> {
    return this.request<Report[]>('/api/admin/reports');
  }

  static async resolveReport(reportId: string, status: string, adminNotes?: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/admin/reports/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
  }
}
