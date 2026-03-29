import React from 'react';
import { Server, Loader2 } from 'lucide-react';
import { useNativeHostStatus } from '@/hooks';

interface NativeHostIndicatorProps {
    onRefresh?: () => void;
}

export const NativeHostIndicator: React.FC<NativeHostIndicatorProps> = ({
    onRefresh,
}) => {
    const { status, isChecking, refreshStatus } = useNativeHostStatus();

    const isRunning = status.ok === true && status.isRunning === true;
    const isWarning = status.ok === false;

    const label = isRunning
        ? status.message || 'Native host running'
        : isWarning
            ? status.error || status.message || 'Native host error'
            : status.message || 'Native host stopped';

    const handleClick = () => {
        onRefresh?.();
        refreshStatus();
    };

    return (
        <button
            onClick={handleClick}
            disabled={isChecking}
            aria-label={label}
            title={label}
            className={`p-2 rounded-lg transition-colors ${isRunning
                ? 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950'
                : isWarning
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
                } ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isChecking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Server className="w-5 h-5" />
            )}
        </button>
    );
};
