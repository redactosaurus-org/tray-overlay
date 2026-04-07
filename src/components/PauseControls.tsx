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
        <div className="space-y-1.5 rounded-md border border-input bg-muted/40 p-2">
            <h3 className="text-xs font-semibold">Pause Duration</h3>

            <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1">
                    <Button
                        onClick={() => handleHoursChange(-1)}
                        disabled={hoursMinusDisabled}
                        aria-label="Decrease hours"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-6 text-center text-xs font-semibold">{hours}</div>
                    <Button
                        onClick={() => handleHoursChange(1)}
                        disabled={hoursDisabled}
                        aria-label="Increase hours"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-[10px] text-muted-foreground">h</span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        onClick={() => handleMinutesChange(-MINUTES_STEP)}
                        disabled={minutesMinusDisabled}
                        aria-label="Decrease minutes"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                    >
                        <Minus className="w-3 h-3" />
                    </Button>
                    <div className="w-6 text-center text-xs font-semibold">{minutes}</div>
                    <Button
                        onClick={() => handleMinutesChange(MINUTES_STEP)}
                        disabled={minutesDisabled}
                        aria-label="Increase minutes"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-[10px] text-muted-foreground">m</span>
                </div>

                <Button
                    onClick={isPaused ? handleResumeClick : handlePauseClick}
                    disabled={isDisabled || isLoading}
                    variant={isPaused ? 'default' : 'secondary'}
                    className="ml-auto h-7 px-2 text-[10px]"
                >
                    {isLoading ? 'Working...' : isPaused ? 'Resume' : 'Pause'}
                </Button>
            </div>

            {isPaused && (
                <Alert variant="warning" className="p-2">
                    <AlertDescription className="text-xs">
                        Resume in {formatDuration(remainingSeconds)}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
