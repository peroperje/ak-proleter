// Type-safe route helpers
import {
  EventRouteParams,
  AthleteRouteParams,
  ResultRouteParams,
  TrainingRouteParams,
  CoachRouteParams,
  ReportRouteParams
} from './types';
import {
  validateEventPath,
  validateAthletePath,
  validateResultPath,
  validateTrainingPath,
  validateCoachPath,
  validateReportPath
} from './utils';
import { IconType } from '../icons';

// Re-export NavItems and NavItem types from the old routes.ts file
/**
 * @deprecated
 */
export interface NavItem {
  name: string;
  href: (params?: Record<string, string>) => string;
  description?: string;
  icon?: IconType;
}

export interface NavItems {
  [key: string]: NavItem;
}

/**
 * Type-safe route helpers for the application
 */
export const routes = {
  dashboard: {
    index: () => '/',
  },
  events: {
    list: () => '/events',
    detail: (id: string) => `/events/${validateEventPath(id)}`,
    edit: (id: string) => `/events/${validateEventPath(id)}/edit`,
    delete: (id: string) => `/events/${validateEventPath(id)}/delete`,
    view: (id: string) => `/events/${validateEventPath(id)}/view`,
    new: () => '/events/new',
  },
  athletes: {
    list: () => '/athletes',
    detail: (id: string) => `/athletes/${validateAthletePath(id)}`,
    edit: (id: string) => `/athletes/${validateAthletePath(id)}/edit`,
    delete: (id: string) => `/athletes/${validateAthletePath(id)}/delete`,
    view: (id: string) => `/athletes/${validateAthletePath(id)}/view`,
    new: () => '/athletes/new',
  },
  results: {
    list: () => '/results',
    detail: (id: string) => `/results/${validateResultPath(id)}`,
    edit: (id: string) => `/results/${validateResultPath(id)}/edit`,
    delete: (id: string) => `/results/${validateResultPath(id)}/delete`,
    view: (id: string) => `/results/${validateResultPath(id)}/view`,
    new: () => '/results/new',
  },
  training: {
    list: () => '/training',
    detail: (id: string) => `/training/${validateTrainingPath(id)}`,
    edit: (id: string) => `/training/${validateTrainingPath(id)}/edit`,
    delete: (id: string) => `/training/${validateTrainingPath(id)}/delete`,
    view: (id: string) => `/training/${validateTrainingPath(id)}/view`,
    new: () => '/training/new',
  },
  coaches: {
    list: () => '/coaches',
    detail: (id: string) => `/coaches/${validateCoachPath(id)}`,
    edit: (id: string) => `/coaches/${validateCoachPath(id)}/edit`,
    delete: (id: string) => `/coaches/${validateCoachPath(id)}/delete`,
    view: (id: string) => `/coaches/${validateCoachPath(id)}/view`,
    new: () => '/coaches/new',
  },
  reports: {
    list: () => '/reports',
    detail: (id: string) => `/reports/${validateReportPath(id)}`,
    edit: (id: string) => `/reports/${validateReportPath(id)}/edit`,
    delete: (id: string) => `/reports/${validateReportPath(id)}/delete`,
    view: (id: string) => `/reports/${validateReportPath(id)}/view`,
    new: () => '/reports/new',
  },
} as const;

// Re-export types for convenience
export * from './types';
export * from './utils';

// Export navItems for backward compatibility
export const navItems: NavItems = {
  dashboard: {
    name: 'Dashboard',
    href: () => '/',
    description: 'View overall statistics and recent activities.',
    icon: 'dashboard',
  },
  athletes: {
    name: 'Athletes',
    href: (params?: Record<string, string>) => {
      if (params?.id) {
        return `/athletes/${params.id}`;
      }
      return '/athletes';
    },
    description:
      'Manage athlete profiles, view statistics, and track progress.',
    icon: 'athletes',
  },
  events: {
    name: 'Events',
    href: (params?: Record<string, string>) => {
      if (!params) return '/events';
      const { id, action } = params;
      if (!id) return '/events';
      if (action) return `/events/${id}/${action}`;
      return `/events/${id}`;
    },
    description: 'Manage competitions, training sessions, and other events.',
    icon: 'events',
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
    icon: 'results',
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
    icon: 'training',
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
    icon: 'coaches',
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
    icon: 'reports',
  },
};
