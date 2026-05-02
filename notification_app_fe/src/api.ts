import { Log, LogError } from './utils/logger';
import type { CampusNotification, NotificationType } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://20.207.122.201/evaluation-service';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

interface FetchNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | 'All';
}

export const fetchNotifications = async (params: FetchNotificationsParams): Promise<CampusNotification[]> => {
  try {
    const url = new URL(`${API_URL}/notifications`);
    
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.notification_type && params.notification_type !== 'All') {
      url.searchParams.append('notification_type', params.notification_type);
    }

    Log(`Fetching notifications from: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // In case the API wraps the data, adjust here. Assuming it returns an array directly or inside a 'data' field.
    return Array.isArray(data) ? data : (data.notifications || data.data || []);
  } catch (error) {
    LogError('Failed to fetch notifications', error);
    return []; // Return empty array on failure
  }
};
