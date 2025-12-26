import React from 'react';
import { FaTrophy, FaUser, FaRunning } from 'react-icons/fa';
import { CardProps } from './types';

export const ResultCard: React.FC<CardProps> = ({ metadata, createdAt, likes, comments }) => {
    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                        <FaTrophy size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">New Result Achievement</h3>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                            {createdAt ? new Date(createdAt).toLocaleDateString() : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
                    <FaUser className="mr-2 opacity-70" />
                    <span className="font-medium">{metadata.athleteName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-neutral-400">
                    <FaRunning className="mr-2 opacity-70" />
                    <span>{metadata.disciplineName}</span>
                </div>
                <div className="col-span-full bg-gray-50 dark:bg-neutral-800 p-2 rounded-lg text-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{metadata.score}</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center space-x-4 text-sm text-gray-500">
                <span>{likes} Likes</span>
                <span>{comments} Comments</span>
            </div>
        </div>
    );
};
