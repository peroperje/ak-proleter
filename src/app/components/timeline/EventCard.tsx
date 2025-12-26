import React from 'react';
import Image from 'next/image';
import { MapPinIcon, CalendarIcon, ClockIcon, TagIcon } from '@/app/ui/icons';
import { eventTypeStyles } from '@/app/lib/constants/styles';
import { CardProps } from './types';
import { formatDate, formatTime, getEventStatus, formatCategories } from '@/app/lib/utils/event';
import { EventBadges } from '@/app/components/events/EventBadges';

export const EventCard: React.FC<CardProps> = ({ event, metadata, likes, comments }) => {
    const status = getEventStatus(
        metadata.startDate || event?.startDate || new Date(),
        event?.endDate || null
    );
    const type = (event?.type || 'OTHER') as keyof typeof eventTypeStyles;

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
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
                            <EventBadges size='xs' type={type} status={status} />
                        </div>
                        <div className="flex items-center text-[10px] text-gray-500 dark:text-neutral-500">
                            <MapPinIcon className="mr-1 text-blue-500 opacity-70" size={12} />
                            <span className="truncate">{metadata.location || event?.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {event?.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
                    {event.description}
                </p>
            )}

            <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-lg">
                    {/* From Section */}
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

                    {/* To Section */}
                    {event?.endDate ? (
                        <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-200 dark:border-neutral-700 md:pl-3 pt-2 md:pt-0">
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
                    ) : (
                        <div className="hidden md:block md:border-l border-gray-200 dark:border-neutral-700 md:pl-3" />
                    )}

                    {/* Categories Section */}
                    <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-gray-200 dark:border-neutral-700 md:pl-3 pt-2 md:pt-0">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Categories:</span>
                        <div className="flex items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                            <TagIcon className="mr-1 text-blue-500" size={14} />
                            <span className="truncate">
                                {formatCategories(event?.categories)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center"><span className="mr-1">❤️</span> {likes} Likes</span>
                <span className="flex items-center"><span className="mr-1">💬</span> {comments} Comments</span>
            </div>
        </div>
    );
};
