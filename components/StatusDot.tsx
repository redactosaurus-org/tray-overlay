import React from 'react';

interface StatusDotProps {
    protectionEnabled: boolean;
    serviceEnabled: boolean;
    isPaused: boolean;
    isDark: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({
    protectionEnabled,
    serviceEnabled,
    isPaused,
    isDark,
}) => {
    let color = '#ff8904';

    if (!protectionEnabled || !serviceEnabled) {
        color = isDark ? '#6b7280' : '#9ca3af';
    } else if (isPaused) {
        color = isDark ? '#f59e0b' : '#d97706';
    }

    return (
        <div
            className="w-3 h-3 rounded-full"
            style={{
                backgroundColor: color,
                boxShadow: `0 0 12px ${color}bb`,
            }}
            aria-hidden="true"
        />
    );
};
