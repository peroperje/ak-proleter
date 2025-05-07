import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiAward,
  FiActivity,
  FiBriefcase,
  FiBarChart2,
  FiBox
} from 'react-icons/fi';

// Export all icons used in the application
export const icons = {
  // Navigation icons
  dashboard: FiHome,
  athletes: FiUsers,
  events: FiCalendar,
  results: FiAward,
  training: FiActivity,
  coaches: FiBriefcase,
  reports: FiBarChart2,

  // Box component icon
  box: FiBox
};

// Export icon types
export type IconType = keyof typeof icons;
