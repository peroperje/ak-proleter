import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiAward,
  FiActivity,
  FiBriefcase,
  FiBarChart2,
  FiBox,
  FiUserPlus,
  FiMail,
  FiEdit
} from 'react-icons/fi';

import {FaRunning} from 'react-icons/fa'

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
  addUser: FiUserPlus,
  running: FaRunning,
  mail: FiMail,

  box: FiBox,
  edit: FiEdit
};

// Export icon types
export type IconType = keyof typeof icons;
