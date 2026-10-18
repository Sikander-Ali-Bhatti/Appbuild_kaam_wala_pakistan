import { WorkerProfile, Booking, ServiceCategory } from './types';

// Replace with your local machine's IP (e.g., http://192.168.1.100:3000) or production URL
export const API_BASE_URL = 'http://localhost:3000';

export async function fetchWorkers(filters?: { category?: string; city?: string; query?: string }): Promise<WorkerProfile[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.query) params.append('query', filters.query);

    const res = await fetch(`${API_BASE_URL}/api/workers?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch workers');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
}

export async function fetchWorkerById(id: string): Promise<{ worker: WorkerProfile; reviews: any[] } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/workers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch worker');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return null;
  }
}

export async function fetchCategories(): Promise<ServiceCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
}

export async function createBookingRequest(bookingData: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}
