export type NotificationType = "Event" | "Result" | "Placement";

export interface CampusNotification {
  id: string; // The API might return lowercase 'id' or 'ID'. We'll adjust if necessary. Assuming lowercase id for standard JSON.
  type: NotificationType;
  message: string;
  timestamp: string;
}

// Keeping the original types for compatibility with the user's initial setup if needed:
export interface OriginalCampusNotification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}
