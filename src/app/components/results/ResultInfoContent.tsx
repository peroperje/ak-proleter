import React from 'react';
import { AwardIcon, CalendarIcon, MapPinIcon, NoteIcon } from '@/app/ui/icons';

interface ResultInfoContentProps {
    disciplineName: string;
    score: string | null;
    position: number | null;
    eventName: string;
    eventDate: Date | string;
    eventLocation: string;
    notes?: string | null;
}

const ResultInfoContent: React.FC<ResultInfoContentProps> = ({
    disciplineName,
    score,
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 rounded-lg text-white">
                        <AwardIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Discipline</h3>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{disciplineName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Score</h3>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{score || 'N/A'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                    <div className="flex items-center space-x-3 mb-2">
                        <CalendarIcon size={18} className="text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Event Details</h4>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{eventName}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">{formattedDate}</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                    <div className="flex items-center space-x-3 mb-2">
                        <MapPinIcon size={18} className="text-gray-400" />
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Location</h4>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">{eventLocation}</p>
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
    );
};

export default ResultInfoContent;
