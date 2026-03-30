import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    HOURS_MIN,
    HOURS_MAX,
    MINUTES_MIN,
    MINUTES_MAX,
    MINUTES_STEP,
    DEFAULT_PAUSE_HOURS,
    DEFAULT_PAUSE_MINUTES,
} from '@/lib/constants';
import { clamp, formatDuration } from '@/lib/utils';

interface PauseControlsProps {
    isPaused: boolean;
    remainingSeconds: number;
    isDisabled: boolean;
    onPause: (minutes: number) => Promise<void>;
    onResume: () => Promise<void>;
    isLoading: boolean;
}

export const PauseControls: React.FC<PauseControlsProps> = ({
    isPaused,
    remainingSeconds,
    isDisabled,
    onPause,
    onResume,
    isLoading,
}) => {
    const [hours, setHours] = useState(DEFAULT_PAUSE_HOURS);
    const [minutes, setMinutes] = useState(DEFAULT_PAUSE_MINUTES);

    const handleHoursChange = (delta: number) => {
        setHours(clamp(hours + delta, HOURS_MIN, HOURS_MAX));
    };

    const handleMinutesChange = (delta: number) => {
        setMinutes(clamp(minutes + delta, MINUTES_MIN, MINUTES_MAX));
    };

    const handlePauseClick = async () => {
        if (!isLoading) {
            const totalMinutes = hours * 60 + minutes;
            await onPause(totalMinutes);
        }
    };

    const handleResumeClick = async () => {
        if (!isLoading) {
            await onResume();
            setHours(DEFAULT_PAUSE_HOURS);
            setMinutes(DEFAULT_PAUSE_MINUTES);
        }
    };

    const hoursDisabled = isDisabled || isLoading || hours >= HOURS_MAX;
    const hoursMinusDisabled = isDisabled || isLoading || hours <= HOURS_MIN;
    const minutesDisabled = isDisabled || isLoading || minutes >= MINUTES_MAX;
    const minutesMinusDisabled = isDisabled || isLoading || minutes <= MINUTES_MIN;

    return (
        <div className="space-y-3 rounded-md border border-input bg-muted/40 p-3">
            <div>
                <h3 className="mb-2 text-sm font-semibold">Pause Duration</h3>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-1.5">
                        <Button
                            onClick={() => handleHoursChange(-1)}
                            disabled={hoursMinusDisabled}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="w-8 text-center text-sm font-semibold">{hours}</div>
                        <Button
                            onClick={() => handleHoursChange(1)}
                            disabled={hoursDisabled}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground">hours</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Button
                            onClick={() => handleMinutesChange(-MINUTES_STEP)}
                            disabled={minutesMinusDisabled}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="w-10 text-center text-sm font-semibold">{minutes}</div>
                        <Button
                            onClick={() => handleMinutesChange(MINUTES_STEP)}
                            disabled={minutesDisabled}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground">mins</span>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                {isPaused && (
                    <Alert variant="warning">
                        <AlertDescription>
                            Resume in {formatDuration(remainingSeconds)}
                        </AlertDescription>
                    </Alert>
                )}

                <Button
                    onClick={isPaused ? handleResumeClick : handlePauseClick}
                    disabled={isDisabled || isLoading}
                    variant={isPaused ? 'default' : 'secondary'}
                    className="h-9 w-full"
                >
                    {isLoading ? 'Working...' : isPaused ? 'Resume' : 'Pause'}
                </Button>
            </div>
        </div>
    );
};
