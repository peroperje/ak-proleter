import React, { use } from 'react';
import PageLayout from '@/app/components/PageLayout';
import Box from '@/app/components/Box';
import CloseBtn from '@/app/components/CloseBtn';
import { getResultById } from '@/app/lib/actions/result';
import ProfileInfoBoxContent from '@/app/components/athletes/ProfileInfoBoxContent';
import ResultInfoContent from '@/app/components/results/ResultInfoContent';
import { RunningIcon, AwardIcon } from '@/app/ui/icons';
import Link from 'next/link';
import Button from '@/app/ui/button';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const result = use(getResultById(id));

    if (!result) {
        return (
            <PageLayout title="Result Not Found">
                <Box icon={AwardIcon} title="Error" variants="error">
                    <p className="text-red-500">
                        The result you are looking for does not exist.
                    </p>
                    <div className="mt-4">
                        <Link href="/">
                            <Button variant="outline">Back to Timeline</Button>
                        </Link>
                    </div>
                </Box>
            </PageLayout>
        );
    }

    const { athlete } = result;

    // Transform athlete data for ProfileInfoBoxContent
    const athleteProps = {
        firstName: athlete.name.split(' ')[0],
        lastName: athlete.name.split(' ').slice(1).join(' '),
        dateOfBirth: athlete.dateOfBirth || new Date(),
        gender: (athlete.gender === 'male' ? 'male' : 'female') as 'male' | 'female',
        active: true,
        photoUrl: athlete.avatarUrl || undefined,
        categories: athlete.category ? [athlete.category.name] : [],
    };

    return (
        <PageLayout title="Result Details" action={<CloseBtn />}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Side: Athlete Profile Info */}
                <div className="lg:col-span-5">
                    <Box icon={RunningIcon} title="Athlete Profile">
                        <ProfileInfoBoxContent {...athleteProps} />
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-800">
                            <Link href={`/athletes/${athlete.id}`}>
                                <Button variant="outline">View Full Profile</Button>
                            </Link>
                        </div>
                    </Box>
                </div>

                {/* Right Side: Result Details */}
                <div className="lg:col-span-7">
                    <Box icon={AwardIcon} title="Result Details">
                        <ResultInfoContent
                            disciplineName={result.discipline.name}
                            disciplineDescription={result.discipline.description}
                            score={result.score}
                            unitSymbol={result.discipline.unit?.symbol}
                            position={result.position}
                            eventName={result.event.title}
                            eventDate={result.event.startDate}
                            eventLocation={result.event.location}
                            notes={result.notes}
                        />
                    </Box>
                </div>
            </div>
        </PageLayout>
    );
}

