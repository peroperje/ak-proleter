import React from 'react';
import { AwardIcon, CalendarIcon, MapPinIcon, NoteIcon } from '@/app/ui/icons';

interface ResultInfoContentProps {
    disciplineName: string;
    disciplineDescription?: string | null;
    score: string | null;
    unitSymbol?: string | null;
    position: number | null;
    eventName: string;
    eventDate: Date | string;
    eventLocation: string;
    notes?: string | null;
}

const ResultInfoContent: React.FC<ResultInfoContentProps> = ({
    disciplineName,
    disciplineDescription,
    score,
    unitSymbol,
    position,
    eventName,
    eventDate,
    eventLocation,
    notes
}) => {
    const formattedDate = new Date(eventDate).toLocaleDateString('sr-RS', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const displayScore = score ? `${score}${unitSymbol ? ` ${unitSymbol}` : ''}` : 'N/A';

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-600 rounded-lg text-white mt-1">
                        <AwardIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Discipline</h3>
                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{disciplineName}</p>
                        {disciplineDescription && (
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-md italic">{disciplineDescription}</p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Score</h3>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 whitespace-nowrap">{displayScore}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                    <div className="flex items-center space-x-3 mb-3">
                        <CalendarIcon size={18} className="text-gray-400" />
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Event Details</h4>
                            <div className="flex flex-wrap items-center gap-x-3 mt-1">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{eventName}</span>
                                <span className="text-xs text-gray-400 dark:text-neutral-500">•</span>
                                <span className="text-xs text-gray-500 dark:text-neutral-400">{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-3 border-t border-gray-200 dark:border-neutral-700">
                        <MapPinIcon size={18} className="text-gray-400 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Location</h4>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{eventLocation}</p>
                        </div>
                    </div>
                </div>

                {position && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full w-fit border border-amber-100 dark:border-amber-800 text-sm font-bold">
                        <span>Rank:</span>
                        <span className="text-lg">{position}. place</span>
                    </div>
                )}

                {notes && (
                    <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                        <div className="flex items-center space-x-3 mb-2">
                            <NoteIcon size={18} className="text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Notes</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-neutral-400 italic">"{notes}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultInfoContent;
