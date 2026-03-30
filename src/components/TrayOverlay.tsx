'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
    useTrayState,
    useDomains,
    useExtensionStatus,
    useTheme,
} from '@/hooks';
import {
    StatusDot,
    ExtensionIndicator,
    NativeHostIndicator,
    ProtectionToggle,
    PauseControls,
    DomainManager,
} from '@/components';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '@/lib/utils';

export const TrayOverlay: React.FC = () => {
    const { theme, isReady } = useTheme();
    const [isActionBusy, setIsActionBusy] = useState(false);
    const [pauseError, setPauseError] = useState<string>('');

    const {
        state,
        isLoading: isTrayLoading,
        setProtectionEnabled,
        setPause,
        clearPause,
        openMainApp,
    } = useTrayState();

    const {
        domains,
        isLoading: isDomainsLoading,
        feedback,
        refreshDomains,
        addDomain,
        removeDomain,
    } = useDomains();

    const {
        status,
        isChecking,
        refreshStatus,
    } = useExtensionStatus();

    useEffect(() => {
        void refreshDomains(true);
    }, [refreshDomains]);

    const handleProtectionToggle = async (enabled: boolean) => {
        setIsActionBusy(true);
        setPauseError('');
        try {
            const response = await setProtectionEnabled(enabled);
            if (response?.ok === false && response?.error) {
                setPauseError(response.error);
            }
        } finally {
            setIsActionBusy(false);
        }
    };

    const handlePause = async (minutes: number) => {
        setIsActionBusy(true);
        setPauseError('');
        try {
            const response = await setPause(minutes);
            if (response?.ok === false && response?.error) {
                setPauseError(response.error);
            }
        } finally {
            setIsActionBusy(false);
        }
    };

    const handleResume = async () => {
        setIsActionBusy(true);
        setPauseError('');
        try {
            const response = await clearPause();
            if (response?.ok === false && response?.error) {
                setPauseError(response.error);
            }
        } finally {
            setIsActionBusy(false);
        }
    };

    const protectionText = !state.protectionEnabled
        ? 'Protection is turned off.'
        : state.isPaused
            ? `Resume in ${formatDuration(state.remainingSeconds)}`
            : 'Protection is active.';

    if (!isReady) {
        return <div className="p-4">Loading...</div>;
    }

    const isDark = theme === 'dark';
    const protectionToggleDisabled =
        isTrayLoading || isActionBusy || state.isPaused;
    const pauseControlsDisabled =
        !state.protectionEnabled || state.isPaused || isTrayLoading || isActionBusy;

    return (
        <div data-theme={theme}>
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base">Redactosaurus</CardTitle>
                        <StatusDot
                            protectionEnabled={state.protectionEnabled}
                            serviceEnabled={state.serviceEnabled}
                            isPaused={state.isPaused}
                            isDark={isDark}
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <ExtensionIndicator
                            status={status}
                            isChecking={isChecking}
                            onRefresh={refreshStatus}
                        />
                        <NativeHostIndicator />
                    </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-0">
                    <ProtectionToggle
                        checked={state.protectionEnabled && !state.isPaused}
                        disabled={protectionToggleDisabled}
                        onChange={handleProtectionToggle}
                        isDark={isDark}
                        statusText={protectionText}
                    />

                    {state.protectionEnabled && (
                        <PauseControls
                            isPaused={state.isPaused}
                            remainingSeconds={state.remainingSeconds}
                            isDisabled={pauseControlsDisabled}
                            onPause={handlePause}
                            onResume={handleResume}
                            isLoading={isActionBusy}
                        />
                    )}

                    {pauseError && (
                        <Alert variant="destructive">
                            <AlertDescription>{pauseError}</AlertDescription>
                        </Alert>
                    )}

                    <DomainManager
                        domains={domains}
                        isLoading={isDomainsLoading}
                        feedback={feedback}
                        onAdd={addDomain}
                        onRemove={removeDomain}
                    />

                    <Button
                        onClick={openMainApp}
                        disabled={isTrayLoading}
                        variant="outline"
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Open Main App
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
