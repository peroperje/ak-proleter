// Navigation routes for the application
// This file defines all the navigation routes used throughout the app
import { icons, IconType } from './icons';

export interface NavItem {
  name: string;
  href: (params?: Record<string, string>) => string;
  description?: string;
  icon?: IconType;
}

export interface NavItems {
  [key: string]: NavItem;
}

export const navItems: NavItems = {
  dashboard: {
    name: 'Dashboard',
    href: () => '/',
    description: 'View overall statistics and recent activities.',
    icon: 'dashboard'
  },
  athletes: {
    name: 'Athletes',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/athletes/${params.id}`;
      }
      return '/athletes';
    },
    description: 'Manage athlete profiles, view statistics, and track progress.',
    icon: 'athletes'
  },
  events: {
    name: 'Events',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/events/${params.id}`;
      }
      return '/events';
    },
    description: 'Manage competitions, training sessions, and other events.',
    icon: 'events'
  },
  results: {
    name: 'Results',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/results/${params.id}`;
      }
      return '/results';
    },
    description: 'Record and analyze athlete performance results.',
    icon: 'results'
  },
  training: {
    name: 'Training',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/training/${params.id}`;
      }
      return '/training';
    },
    description: 'Plan and track training sessions and exercises.',
    icon: 'training'
  },
  coaches: {
    name: 'Coaches',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/coaches/${params.id}`;
      }
      return '/coaches';
    },
    description: 'Manage coach profiles and assignments.',
    icon: 'coaches'
  },
  reports: {
    name: 'Reports',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/reports/${params.id}`;
      }
      return '/reports';
    },
    description: 'Generate reports and analytics on athlete performance.',
    icon: 'reports'
  },
};
