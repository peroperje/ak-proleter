'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchTimelineAction } from '@/app/lib/actions/timeline';
import { EventCard, ResultCard } from './TimelineCards';

const LIMIT = 10;

export default function TimelineList({ initialData }: { initialData: any[] }) {
    const [items, setItems] = useState(initialData);
    const [offset, setOffset] = useState(initialData.length);
    const [hasMore, setHasMore] = useState(initialData.length >= LIMIT);
    const [isLoading, setIsLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const result = await fetchTimelineAction(LIMIT, offset);

        if (result.success && result.data) {
            const newData = result.data;
            setItems((prev) => [...prev, ...newData]);
            setOffset((prev) => prev + newData.length);
            setHasMore(newData.length === LIMIT);
        } else {
            setHasMore(false);
        }
        setIsLoading(false);
    }, [offset, hasMore, isLoading]);

    useEffect(() => {
        if (inView && hasMore) {
            loadMore();
        }
    }, [inView, hasMore, loadMore]);

    return (
        <div className="flex flex-col space-y-6">
            {items.map((item: any) => (
                <React.Fragment key={item.id}>
                    {item.eventId && (
                        <EventCard
                            metadata={item.metadata}
                            createdAt={item.createdAt}
                            likes={item._count.likes}
                            comments={item._count.comments}
                        />
                    )}
                    {item.resultId && (
                        <ResultCard
                            metadata={item.metadata}
                            createdAt={item.createdAt}
                            likes={item._count.likes}
                            comments={item._count.comments}
                        />
                    )}
                </React.Fragment>
            ))}

            {hasMore && (
                <div ref={ref} className="flex justify-center p-4">
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : (
                        <span className="text-gray-400 text-sm italic">Loading more...</span>
                    )}
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="text-center p-4 text-gray-500 text-sm italic">
                    You have reached the end of the timeline.
                </div>
            )}

            {items.length === 0 && !isLoading && (
                <div className="text-center py-10 bg-gray-50 dark:bg-neutral-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700">
                    <p className="text-gray-500">No activities to show yet.</p>
                </div>
            )}
        </div>
    );
}
