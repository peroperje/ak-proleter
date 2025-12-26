import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { MapPinIcon, CalendarIcon, ClockIcon, TagIcon } from '@/app/ui/icons';
import { eventStatusStyles, eventTypeStyles } from '@/app/lib/constants/styles';
import { CardProps } from './types';

// Helper functions to format date/time
function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const EventCard: React.FC<CardProps> = ({ event, metadata, createdAt, likes, comments }) => {
    const now = new Date();
    let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';

    if (event) {
        if (event.endDate && new Date(event.endDate) < now) {
            status = 'completed';
        } else if (new Date(event.startDate) > now) {
            status = 'upcoming';
        } else {
            status = 'ongoing';
        }
    }

    const type = event?.type || 'OTHER';

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <div className="mt-1 relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-500 shadow-md">
                        <Image
                            src={`/event-img/${type}.png`}
                            alt={`${type} event`}
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                        />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 dark:text-white">{metadata.title || event?.title || 'Event'}</h3>
                            <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", eventTypeStyles[type as keyof typeof eventTypeStyles])}>
                                {type}
                            </span>
                            <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", eventStatusStyles[status as keyof typeof eventStatusStyles])}>
                                {status}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-neutral-500">
                            Activity logged: {new Date(createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {event?.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
                    {event.description}
                </p>
            )}

            <div className="mt-4 space-y-3">
                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
                    <MapPinIcon className="mr-2 text-blue-500 opacity-70" size={16} />
                    <span className="font-medium">Location:</span>
                    <span className="ml-1 truncate">{metadata.location || event?.location}</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-lg">
                    {(() => {
                        const start = metadata.startDate || event?.startDate;
                        return start ? (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">From:</span>
                                <div className="flex items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                                    <CalendarIcon className="mr-1 text-blue-500" size={14} />
                                    {formatDate(start)}
                                </div>
                                <div className="flex items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                                    <ClockIcon className="mr-1 text-blue-500" size={14} />
                                    {formatTime(start)}
                                </div>
                            </div>
                        ) : null;
                    })()}
                    {event?.endDate && (
                        <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-700 sm:pl-3 pt-2 sm:pt-0">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">To:</span>
                            <div className="flex items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                                <CalendarIcon className="mr-1 text-blue-500" size={14} />
                                {formatDate(event.endDate)}
                            </div>
                            <div className="flex items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                                <ClockIcon className="mr-1 text-blue-500" size={14} />
                                {formatTime(event.endDate)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories */}
                <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
                    <TagIcon className="mr-2 text-blue-500 opacity-70" size={16} />
                    <span className="font-medium mr-1">Categories:</span>
                    <span className="font-bold">
                        {event?.categories && event.categories.length > 0
                            ? event.categories.map((cat) => cat.name).join(', ')
                            : 'All categories'}
                    </span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center"><span className="mr-1">❤️</span> {likes} Likes</span>
                <span className="flex items-center"><span className="mr-1">💬</span> {comments} Comments</span>
            </div>
        </div>
    );
};
