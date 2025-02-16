export const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'todo': 'default',
      'in-progress': 'processing',
      'done': 'success',
    };
    return statusColors[status] || 'default';
  };