// Event utility functions

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Formats a date to DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Formats a date to HH:mm
 */
export function formatTime(date: Date | string): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Determines the status of an event based on start and end dates
 */
export function getEventStatus(startDate: Date | string, endDate?: Date | string | null): EventStatus {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    if (end < now) {
        return 'completed';
    } else if (start > now) {
        return 'upcoming';
    } else {
        return 'ongoing';
    }
}

/**
 * Formats categories list into a comma-separated string or returns "All categories"
 */
export function formatCategories(categories?: { name: string }[] | null): string {
    if (!categories || categories.length === 0) {
        return 'All categories';
    }
    return categories.map((cat) => cat.name).join(', ');
}

/**
 * Capitalizes first letter of a string
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
