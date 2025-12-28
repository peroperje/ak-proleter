import React from 'react';
import Link from 'next/link';
import { AwardIcon } from '@/app/ui/icons';

interface DisciplineScoreCardProps {
    id?: string;
    disciplineName: string;
    disciplineDescription?: string | null;
    score: string | null;
    unitSymbol?: string | null;
}

export const DisciplineScoreCard: React.FC<DisciplineScoreCardProps> = ({
    id,
    disciplineName,
    disciplineDescription,
    score,
    unitSymbol,
}) => {
    const displayScore = score
        ? `${score}${unitSymbol ? ` ${unitSymbol}` : ''}`
        : 'N/A';

    const CardContent = () => (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-lg text-blue-600 dark:text-blue-400">
                        <AwardIcon size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {disciplineName}
                        </p>
                        {disciplineDescription && (
                            <p className="text-[10px] text-gray-400 dark:text-neutral-500 italic">
                                {disciplineDescription}
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <h4 className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Score
                    </h4>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                        {displayScore}
                    </p>
                </div>
            </div>
        </div>
    );

    if (id) {
        return (
            <Link href={`/results/${id}`} className="hover:opacity-50 transition-opacity">
                <CardContent />
            </Link>
        );
    }

    return <CardContent />;
};
