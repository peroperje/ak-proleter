'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon } from '@/app/ui/icons';
import { DisciplineScoreCard } from '@/app/components/results/DisciplineScoreCard';

// We define the shape of the data we expect from the server component
// This should match the Prisma include structure
export type AthleteEventResultData = {
    id: string;
    score: string | null;
    position: number | null;
    athlete: {
        id: string;
        name: string;
        avatarUrl: string | null;
        category: {
            name: string;
        } | null;
    };
    discipline: {
        name: string;
        description: string;
        unit: {
            symbol: string;
        } | null;
    };
};

interface AthleteEventResultsProps {
    results: AthleteEventResultData[];
}

export default function AthleteEventResults({ results }: AthleteEventResultsProps) {
    if (!results || results.length === 0) {
        return null;
    }

    // Group results by athlete
    const resultsByAthlete = results.reduce((acc, result) => {
        const athleteId = result.athlete.id;
        if (!acc[athleteId]) {
            acc[athleteId] = {
                athlete: result.athlete,
                results: [],
            };
        }
        acc[athleteId].results.push(result);
        return acc;
    }, {} as Record<string, { athlete: AthleteEventResultData['athlete']; results: AthleteEventResultData[] }>);

    // Sort athletes by name
    const sortedAthletes = Object.values(resultsByAthlete).sort((a, b) =>
        a.athlete.name.localeCompare(b.athlete.name)
    );

    return (
        <div className="flex flex-col space-y-4 mt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Athlete Results
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {sortedAthletes.map((item) => (
                    <AthleteResultCard
                        key={item.athlete.id}
                        athlete={item.athlete}
                        results={item.results}
                    />
                ))}
            </div>
        </div>
    );
}

function AthleteResultCard({
    athlete,
    results,
}: {
    athlete: AthleteEventResultData['athlete'];
    results: AthleteEventResultData[];
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${isExpanded ? 'ring-2 ring-blue-500/20' : ''
                }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800">
                        {athlete.avatarUrl ? (
                            <Image
                                src={athlete.avatarUrl}
                                alt={athlete.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-400">
                                {athlete.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
                            {athlete.name}
                        </h3>
                        {athlete.category && (
                            <span className="text-xs text-gray-500 dark:text-neutral-500 font-medium bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full inline-block mt-1">
                                {athlete.category.name}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-gray-400">
                    {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                </div>
            </div>

            {isExpanded && (
                <div
                    className="mt-4 space-y-2 border-t border-gray-100 dark:border-neutral-800 pt-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    {results.map((result) => (
                        <div key={result.id} className="mt-2">
                            <DisciplineScoreCard
                                id={result.id}
                                disciplineName={result.discipline.name}
                                disciplineDescription={result.discipline.description}
                                score={result.score}
                                unitSymbol={result.discipline.unit?.symbol}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
