export const getDegreeTag = (status: string) => {
  switch (status) {
    case 'Критическая':
      return 'danger';
    case 'Высокая':
      return 'warning';
    case 'Низкая':
      return 'info';
    case 'renewal':
      return null;
  }
};
