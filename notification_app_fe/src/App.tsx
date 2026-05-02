import React, { useState, useEffect } from 'react';
import { 
  Container, AppBar, Toolbar, Typography, Tabs, Tab, Box, CssBaseline, 
  Select, MenuItem, FormControl, InputLabel, CircularProgress 
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { NotificationCard } from './components/NotificationCard';
import type { CampusNotification, NotificationType } from './types';
import { fetchNotifications } from './api';
import { sortNotificationsByPriority } from './utils/priority';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Log } from './utils/logger';

export default function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'All'>('All');

  // Read state using local storage
  const [readIds, setReadIds] = useLocalStorage<string[]>('viewed_notifications', []);

  useEffect(() => {
    loadNotifications();
  }, [limit, page, typeFilter]);

  const loadNotifications = async () => {
    setLoading(true);
    Log(`Loading notifications with limit=${limit}, page=${page}, type=${typeFilter}`);
    const data = await fetchNotifications({ limit, page, notification_type: typeFilter });
    setNotifications(data);
    setLoading(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    Log(`Switched to tab ${newValue}`);
  };

  const handleNotificationClick = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
      Log(`Marked notification ${id} as read`);
    }
  };

  const handleLimitChange = (e: SelectChangeEvent<number>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset page on limit change
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    setTypeFilter(e.target.value as NotificationType | 'All');
    setPage(1); // Reset page on filter change
  };

  // Priority Inbox view requires sorting and filtering out read notifications
  const priorityNotifications = sortNotificationsByPriority(
    notifications.filter(n => !readIds.includes(n.id || (n as any).ID))
  );

  return (
    <>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CampusSync
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered>
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
        </Box>

        {/* View 1: All Notifications */}
        {currentTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">All Updates</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Type</InputLabel>
                  <Select value={typeFilter} label="Type" onChange={handleTypeChange}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Event">Event</MenuItem>
                    <MenuItem value="Result">Result</MenuItem>
                    <MenuItem value="Placement">Placement</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Limit</InputLabel>
                  <Select value={limit} label="Limit" onChange={handleLimitChange}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationCard 
                  key={notif.id || (notif as any).ID} 
                  notification={notif} 
                  isRead={readIds.includes(notif.id || (notif as any).ID)}
                  onClick={handleNotificationClick}
                />
              ))
            ) : (
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                No notifications found.
              </Typography>
            )}
          </Box>
        )}

        {/* View 2: Priority Inbox */}
        {currentTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>Priority Inbox</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Showing your most important unread notifications.
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : priorityNotifications.length > 0 ? (
              priorityNotifications.slice(0, limit).map((notif) => (
                <NotificationCard 
                  key={notif.id || (notif as any).ID} 
                  notification={notif} 
                  isRead={false} // It's unread if it's in this list
                  onClick={handleNotificationClick}
                />
              ))
            ) : (
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                You're all caught up! No priority notifications.
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </>
  );
}
