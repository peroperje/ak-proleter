// src/app/lib/constants/styles.ts
export const eventTypeStyles = {
  COMPETITION:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  TRAINING: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  CAMP: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  OTHER: 'bg-amber-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  MEETING: 'bg-cyan-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
} as const;

export const eventStatusStyles = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const;
