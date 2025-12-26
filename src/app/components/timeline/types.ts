export interface EventCategory {
    name: string;
}

export interface EventData {
    id: string;
    title?: string;
    description?: string | null;
    location?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    type: string;
    categories?: EventCategory[] | null;
}

export interface TimelineMetadata {
    title?: string;
    location?: string;
    startDate?: Date | string;
    athleteName?: string;
    disciplineName?: string;
    score?: string | number;
}

export interface ResultData {
    id: string;
    athlete: {
        id: string;
        name: string;
        avatarUrl?: string | null;
    };
    discipline: {
        name: string;
        description?: string | null;
        unit?: {
            symbol: string;
        } | null;
    };
    score?: string | null;
    position?: number | null;
}

export interface CardProps {
    event?: EventData | null;
    result?: ResultData | null;
    metadata: TimelineMetadata;
    createdAt?: Date | string;
    likes: number;
    comments: number;
}

export interface TimelineItem {
    id: string;
    eventId?: string | null;
    resultId?: string | null;
    event?: EventData | null;
    result?: ResultData | null;
    metadata: TimelineMetadata;
    createdAt: Date | string;
    _count: {
        likes: number;
        comments: number;
    };
}
