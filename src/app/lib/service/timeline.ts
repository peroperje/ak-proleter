import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export type TimelineActivityMetadata = {
    // For Event
    title?: string;
    location?: string;
    startDate?: Date | string;
    // For Result
    athleteName?: string;
    disciplineName?: string;
    score?: string;
};

// getTimeline now just reads from Activity table, 
// sort by date and includes likes/comments
export const getTimeline = async (limit: number = 10, offset: number = 0) => {
    return await prisma.activity.findMany({
        take: limit,
        skip: offset,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            event: {
                include: {
                    categories: true
                }
            },
            result: {
                include: {
                    athlete: true,
                    discipline: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
    });
};
