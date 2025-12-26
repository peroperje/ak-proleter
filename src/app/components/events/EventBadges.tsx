import React from 'react';
import clsx from 'clsx';
import { eventStatusStyles, eventTypeStyles } from '@/app/lib/constants/styles';
import { capitalize, EventStatus } from '@/app/lib/utils/event';

interface EventBadgeProps {
    label: string;
    type: keyof typeof eventTypeStyles | EventStatus;
    variant?: 'type' | 'status';
    size?: 'xs' | 'sm' | 'md';
}

export const EventBadge: React.FC<EventBadgeProps> = ({
    label,
    type,
    variant = 'type',
    size = 'xs'
}) => {
    const styles = variant === 'type'
        ? eventTypeStyles[type as keyof typeof eventTypeStyles]
        : eventStatusStyles[type as EventStatus];

    return (
        <span
            className={clsx(
                "rounded-full font-semibold uppercase tracking-wider",
                size === 'xs' ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 ",
                size !== 'xs' ? "text-sm" : "text-xs",
                styles
            )}
        >
            {label}
        </span>
    );
};

interface EventBadgesProps {
    type: keyof typeof eventTypeStyles;
    status: EventStatus;
    size?: 'xs' | 'sm' | 'md';
}

export const EventBadges: React.FC<EventBadgesProps> = ({ type, status, size = 'xs' }) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <EventBadge
                label={capitalize(type)}
                type={type}
                variant="type"
                size={size}
            />
            <EventBadge
                label={capitalize(status)}
                type={status}
                variant="status"
                size={size}
            />
        </div>
    );
};
