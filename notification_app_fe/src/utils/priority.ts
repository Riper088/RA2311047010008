import type { CampusNotification, NotificationType } from '../types';

/**
 * Assigns a weight to the notification type.
 * Priority: Placement (3) > Result (2) > Event (1).
 */
const getWeight = (type: NotificationType | string): number => {
  switch (type) {
    case 'Placement':
      return 3;
    case 'Result':
      return 2;
    case 'Event':
      return 1;
    default:
      return 0;
  }
};

/**
 * Sorts notifications based on the Priority algorithm:
 * 1. Weight (Placement > Result > Event)
 * 2. Recency (Newest first)
 */
export const sortNotificationsByPriority = (
  notifications: CampusNotification[]
): CampusNotification[] => {
  return [...notifications].sort((a, b) => {
    const weightA = getWeight(a.type || (a as any).Type);
    const weightB = getWeight(b.type || (b as any).Type);

    if (weightA !== weightB) {
      return weightB - weightA; // Higher weight comes first
    }

    // If weights are equal, sort by recency
    const timeA = new Date(a.timestamp || (a as any).Timestamp).getTime();
    const timeB = new Date(b.timestamp || (b as any).Timestamp).getTime();
    
    return timeB - timeA; // Newest first
  });
};
