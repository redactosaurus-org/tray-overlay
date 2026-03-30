import React from 'react';
import { PlugZap, Unplug, Loader2 } from 'lucide-react';
import { ExtensionStatus } from '@/types';

interface ExtensionIndicatorProps {
    status: ExtensionStatus;
    isChecking: boolean;
    onRefresh: () => void;
}

export const ExtensionIndicator: React.FC<ExtensionIndicatorProps> = ({
    status,
    isChecking,
    onRefresh,
}) => {
    const isConnected = status.ok === true && status.state === 'connected';
    const isWarning = status.ok === false;

    const label = isConnected ? 'Extension connected' : 'Extension disconnected';

    const isLoading = isChecking;

    return (
        <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label={label}
            title={label}
            className={`p-2 rounded-lg transition-colors ${isConnected
                ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
                : isWarning
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isConnected ? (
                <PlugZap className="w-5 h-5" />
            ) : (
                <Unplug className="w-5 h-5" />
            )}
        </button>
    );
};
