import { prisma } from '../prisma';
import { TimelineItem } from '@/app/components/timeline/types';

// getTimeline now just reads from Activity table, 
// sort by date and includes likes/comments
export const getTimeline = async (limit: number = 10, offset: number = 0): Promise<TimelineItem[]> => {
    const data = await prisma.activity.findMany({
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
                    discipline: {
                        include: {
                            unit: true
                        }
                    },
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

    return data as unknown as TimelineItem[];
};
