// Utility functions for route validation

/**
 * Validates an event ID to ensure it matches the expected format
 * @param id The event ID to validate
 * @returns The validated ID
 * @throws Error if the ID format is invalid
 */
export function validateEventPath(id: string): string {
  if (!id.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid event ID format');
  }
  return id;
}

/**
 * Validates an athlete ID to ensure it matches the expected format
 * @param id The athlete ID to validate
 * @returns The validated ID
 * @throws Error if the ID format is invalid
 */
export function validateAthletePath(id: string): string {
  if (!id.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid athlete ID format');
  }
  return id;
}

/**
 * Validates a result ID to ensure it matches the expected format
 * @param id The result ID to validate
 * @returns The validated ID
 * @throws Error if the ID format is invalid
 */
export function validateResultPath(id: string): string {
  if (!id.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid result ID format');
  }
  return id;
}

/**
 * Validates a training ID to ensure it matches the expected format
 * @param id The training ID to validate
 * @returns The validated ID
 * @throws Error if the ID format is invalid
 */
export function validateTrainingPath(id: string): string {
  if (!id.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid training ID format');
  }
  return id;
}

/**
 * Validates a coach ID to ensure it matches the expected format
 * @param id The coach ID to validate
 * @returns The validated ID
 * @throws Error if the ID format is invalid
 */
export function validateCoachPath(id: string): string {
  if (!id.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid coach ID format');
  }
  return id;
}

/**
 * Validates a report ID to ensure it matches the expected format
 * @param id The report ID to validate
 * @returns The validated ID
 * @throws Error if the ID format is invalid
 */
export function validateReportPath(id: string): string {
  if (!id.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid report ID format');
  }
  return id;
}
