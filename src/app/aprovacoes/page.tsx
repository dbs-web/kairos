import { useEffect } from 'react';

useEffect(() => {
    // Clear briefings counter when user visits page
    fetch('/api/notifications/clear?type=briefings', { method: 'POST' });
}, []);