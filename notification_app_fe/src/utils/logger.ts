/**
 * Actual logging middleware hitting the required evaluation server endpoint.
 * Replaces console.log, console.error, console.warn.
 */

const LOG_SERVER_URL = 'http://20.207.122.201/evaluation-service/logs';

// Helper to stringify complex objects safely
const safeStringify = (data: any) => {
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch (e) {
    return String(data);
  }
};

const sendLog = async (level: 'INFO' | 'ERROR' | 'WARN', message: any, ...optionalParams: any[]) => {
  try {
    const token = import.meta.env.VITE_API_TOKEN;
    const formattedMessage = [
      safeStringify(message), 
      ...optionalParams.map(safeStringify)
    ].join(' ');

    const payload = {
      level,
      message: formattedMessage,
      timestamp: new Date().toISOString()
    };

    // Make an actual API call to the logging server
    await fetch(LOG_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // If the logger itself fails, we must silently swallow it or use native console
    // However, rules state "cannot use native console loggers", so we do nothing.
  }
};

export const Log = (message: any, ...optionalParams: any[]) => {
  sendLog('INFO', message, ...optionalParams);
};

export const LogError = (message: any, ...optionalParams: any[]) => {
  sendLog('ERROR', message, ...optionalParams);
};

export const LogWarn = (message: any, ...optionalParams: any[]) => {
  sendLog('WARN', message, ...optionalParams);
};
