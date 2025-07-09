// Type-safe route helpers
import {
  validateAthletePath,
  validateCoachPath,
  validateEventPath,
  validateReportPath,
  validateResultPath,
  validateTrainingPath
} from './utils';

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

