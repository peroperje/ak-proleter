import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AwardIcon, MapPinIcon } from '@/app/ui/icons';
import { CardProps } from './types';
import { getEventStatus } from '@/app/lib/utils/event';
import { EventBadges } from '@/app/components/events/EventBadges';
import { eventTypeStyles } from '@/app/lib/constants/styles';

export const ResultCard: React.FC<CardProps> = ({ result, event, metadata, createdAt, likes, comments }) => {
    const athleteName = result?.athlete.name || metadata.athleteName || 'Athlete';
    const athletePhoto = result?.athlete.avatarUrl;
    const disciplineName = result?.discipline.name || metadata.disciplineName;
    const disciplineDescription = result?.discipline.description;
    const score = result?.score || metadata.score;
    const unitSymbol = result?.discipline.unit?.symbol;
    const displayScore = score ? `${score}${unitSymbol ? ` ${unitSymbol}` : ''}` : 'N/A';

    const eventName = event?.title || metadata.title;
    const eventType = (event?.type || 'OTHER') as keyof typeof eventTypeStyles;
    const eventStatus = getEventStatus(
        metadata.startDate || event?.startDate || new Date(),
        event?.endDate || null
    );

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800">
                        {athletePhoto ? (
                            <Image
                                src={athletePhoto}
                                alt={athleteName}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400">
                                {athleteName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{athleteName}</h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                            <p className="text-[10px] text-gray-500 dark:text-neutral-500">
                                {createdAt ? new Date(createdAt).toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {/* Discipline Score Box */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-lg text-blue-600 dark:text-blue-400">
                                <AwardIcon size={18} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Discipline</h4>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{disciplineName}</p>
                                {disciplineDescription && (
                                    <p className="text-[10px] text-gray-400 dark:text-neutral-500 italic">
                                        {disciplineDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <h4 className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Score</h4>
                            <p className="text-lg font-black text-blue-600 dark:text-blue-400">{displayScore}</p>
                        </div>
                    </div>
                </div>

                {/* Event Details Box */}
                {event && (
                    <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-700">
                        <div className="flex items-start space-x-3">
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-1 mt-0.5">
                                <Image
                                    src={`/event-img/${eventType}.png`}
                                    alt={eventType}
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                                    <Link href={`/events/${event.id}`} className="text-xs font-bold text-gray-700 dark:text-neutral-200 hover:text-blue-600 transition-colors truncate">
                                        {eventName}
                                    </Link>
                                    <EventBadges size='xs' type={eventType} status={eventStatus} />
                                </div>
                                {event.location && (
                                    <div className="flex items-center text-[10px] text-gray-400 dark:text-neutral-500">
                                        <MapPinIcon size={10} className="mr-1 text-blue-500/40" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center"><span className="mr-1">❤️</span> {likes} Likes</span>
                <span className="flex items-center"><span className="mr-1">💬</span> {comments} Comments</span>
            </div>
        </div>
    );
};

