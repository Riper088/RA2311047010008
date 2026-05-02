import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { CampusNotification } from '../types';

interface NotificationCardProps {
  notification: CampusNotification;
  isRead: boolean;
  onClick: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  isRead, 
  onClick 
}) => {
  // Determine chip color based on the notification type
  const getChipColor = (type: string) => {
    switch (type) {
      case 'Placement': return 'error';   // Red for high priority
      case 'Result': return 'warning';    // Orange for medium priority
      case 'Event': return 'info';        // Blue for standard priority
      default: return 'default';
    }
  };

  // Support both ID and id to be safe based on backend response
  const id = notification.id || (notification as any).ID;
  const type = notification.type || (notification as any).Type;
  const timestamp = notification.timestamp || (notification as any).Timestamp;
  const message = notification.message || (notification as any).Message;

  return (
    <Card 
      onClick={() => onClick(id)}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isRead ? '#f5f5f5' : '#ffffff',
        opacity: isRead ? 0.75 : 1,
        borderLeft: isRead ? '4px solid transparent' : '4px solid #1976d2',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={type} 
            size="small" 
            color={getChipColor(type) as any} 
            variant={isRead ? "outlined" : "filled"}
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ fontWeight: isRead ? 'normal' : 'bold' }}
          color={isRead ? 'text.secondary' : 'text.primary'}
        >
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};
