'use server';

import { getTimeline } from '../service/timeline';

export async function fetchTimelineAction(limit: number, offset: number) {
    try {
        const data = await getTimeline(limit, offset);
        // Ensure dates and JSON are serialized correctly if needed, 
        // although Next.js server actions handle many types well.
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch timeline:', error);
        return { success: false, error: 'Failed to fetch timeline data' };
    }
}
